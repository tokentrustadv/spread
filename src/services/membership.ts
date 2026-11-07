import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import type { Database } from "@/types/database";
import type { Membership, MembershipStatus } from "@/types/spread";

type Client = SupabaseClient<Database>;

const ACTIVE_STATUSES: MembershipStatus[] = ["trialing", "active"];
const SUBSCRIPTION_ID_PATTERN = /^sub_[A-Za-z0-9]+$/;

export function isMembershipActive(status: string | null | undefined): boolean {
  return !!status && ACTIVE_STATUSES.includes(status as MembershipStatus);
}

function toMembership(
  row: Database["public"]["Tables"]["memberships"]["Row"]
): Membership {
  return {
    userId: row.user_id,
    stripeCustomerId: row.stripe_customer_id,
    stripeSubscriptionId: row.stripe_subscription_id,
    status: row.status as MembershipStatus,
    currentPeriodEnd: row.current_period_end,
    cancelAtPeriodEnd: row.cancel_at_period_end,
    introOfferUsedAt: row.intro_offer_used_at,
  };
}

// Works with any client — the creator's own session client is enough here
// (memberships_select_own RLS), no service role needed just to read.
export async function getMembership(
  supabase: Client,
  userId: string
): Promise<Membership | null> {
  const { data, error } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ? toMembership(data) : null;
}

// Public "is THIS creator currently able to accept requests" check, via the
// is_membership_active(uuid) SECURITY DEFINER function — safe to call with the
// plain anon/cookie-bound client even when the viewer isn't that creator.
export async function isMembershipActiveForUser(
  supabase: Client,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_membership_active", {
    target_user_id: userId,
  });

  if (error) throw error;
  return !!data;
}

// Creates (or reuses) the Stripe Customer for a creator and ensures a
// memberships row exists. MUST be called with the admin (service-role)
// client — there is no insert policy for the authenticated role at all, by
// design (see the migration), since the row's user_id has to come from the
// caller's own verified session, not anything a client request could shape.
// The caller (checkout route) derives userId from supabase.auth.getUser(),
// never from request input.
//
// Race-safe under concurrent calls (e.g. two tabs both hitting "Activate" at
// once): the insert uses ON CONFLICT DO NOTHING on the user_id primary key,
// so if two requests both see no existing row and both create a Stripe
// Customer, only the first insert wins — the second re-reads and uses the
// winning row's customer id instead of its own (now-orphaned) one.
export async function ensureStripeCustomer(
  admin: Client,
  stripe: Stripe,
  userId: string,
  displayName: string
): Promise<Membership> {
  const existing = await getMembership(admin, userId);
  if (existing) return existing;

  const customer = await stripe.customers.create({
    name: displayName,
    metadata: { supabase_user_id: userId },
  });

  const { error: upsertError } = await admin.from("memberships").upsert(
    {
      user_id: userId,
      stripe_customer_id: customer.id,
      status: "none",
    },
    { onConflict: "user_id", ignoreDuplicates: true }
  );
  if (upsertError) throw upsertError;

  const row = await getMembership(admin, userId);
  if (!row) throw new Error("Failed to create or load membership row.");
  return row;
}

export type CheckoutClaim =
  | { won: true }
  | { won: false; reusableSessionId: string | null };

// Atomically claims the right to start a new Checkout Session for this
// creator, so two concurrent requests (two tabs, a double click, a client
// retry) can't both proceed to create separate Stripe subscriptions. This is
// a single conditional UPDATE, not a read-then-decide check in JS — Postgres
// serializes concurrent UPDATEs to the same row, so only one request's
// WHERE clause can match and win, even if both arrive at the same instant.
// The claim expires on its own after ttlSeconds so a crashed or abandoned
// request can't wedge a creator out of ever checking out again.
export async function claimCheckoutReservation(
  admin: Client,
  userId: string,
  ttlSeconds = 120
): Promise<CheckoutClaim> {
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();

  const { data: claimed, error } = await admin
    .from("memberships")
    .update({
      pending_checkout_expires_at: expiresAt,
      pending_checkout_session_id: null,
    })
    .eq("user_id", userId)
    .or(`pending_checkout_expires_at.is.null,pending_checkout_expires_at.lt.${now}`)
    .select("user_id")
    .maybeSingle();

  if (error) throw error;
  if (claimed) return { won: true };

  const { data: row, error: readError } = await admin
    .from("memberships")
    .select("pending_checkout_session_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (readError) throw readError;

  return { won: false, reusableSessionId: row?.pending_checkout_session_id ?? null };
}

export async function storeCheckoutSessionId(
  admin: Client,
  userId: string,
  sessionId: string
): Promise<void> {
  const { error } = await admin
    .from("memberships")
    .update({ pending_checkout_session_id: sessionId })
    .eq("user_id", userId);
  if (error) throw error;
}

// Webhook write path — matched by stripe_customer_id (unique-indexed), using
// the admin (service-role) client since there's no Supabase session on a
// Stripe-initiated request.
//
// Both guards below are enforced as part of the SAME SQL UPDATE's WHERE
// clause (via .or()), not as a separate read-then-write check in JavaScript
// — the database itself atomically verifies the condition at write time, so
// there's no window between a check and a write for another event to land
// in and invalidate the premise.
//
// allowSubscriptionReassign controls whether this call is allowed to change
// which subscription the row tracks:
// - true: from checkout.session.completed, the one place a NEW subscription
//   is intentionally attached to a creator's row (first signup or a
//   reactivation after cancellation). Even here, a subscription can only
//   replace the one on file if it isn't OLDER (by Stripe's own `created`
//   timestamp) than what's already tracked — protects against a delayed or
//   out-of-order completion event for an earlier, superseded checkout
//   attempt reassigning the row backwards.
// - false: from customer.subscription.updated/deleted. These fire per
//   subscription, and a customer can have more than one subscription object
//   over their lifetime. A delayed/retried event for an OLD subscription
//   must never overwrite a row that has since moved on to tracking a NEWER
//   one, so these calls only apply if the event's subscription id still
//   matches what the row currently has on file (or none is set yet).
//
// Returns whether the write actually applied (false means the atomic guard
// rejected it — expected/safe, not an error).
export async function syncMembershipFromSubscription(
  admin: Client,
  stripeCustomerId: string,
  subscription: Stripe.Subscription,
  { allowSubscriptionReassign }: { allowSubscriptionReassign: boolean }
): Promise<boolean> {
  if (!SUBSCRIPTION_ID_PATTERN.test(subscription.id)) {
    throw new Error(`Unexpected subscription id shape: ${subscription.id}`);
  }

  const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
  const subscriptionCreatedAt = new Date(subscription.created * 1000).toISOString();

  let query = admin
    .from("memberships")
    .update({
      stripe_subscription_id: subscription.id,
      stripe_subscription_created_at: subscriptionCreatedAt,
      status: subscription.status,
      current_period_end: currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq("stripe_customer_id", stripeCustomerId);

  query = allowSubscriptionReassign
    ? query.or(
        `stripe_subscription_created_at.is.null,stripe_subscription_created_at.lte.${subscriptionCreatedAt}`
      )
    : query.or(
        `stripe_subscription_id.is.null,stripe_subscription_id.eq.${subscription.id}`
      );

  const { data, error } = await query.select("user_id");
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

// Only ever called after checkout.session.completed has confirmed
// payment_status === "paid" (see the webhook route) — guarded so it only
// fires once per creator regardless of how many times it's invoked.
export async function markIntroOfferUsed(
  admin: Client,
  stripeCustomerId: string
): Promise<void> {
  const { error } = await admin
    .from("memberships")
    .update({ intro_offer_used_at: new Date().toISOString() })
    .eq("stripe_customer_id", stripeCustomerId)
    .is("intro_offer_used_at", null);

  if (error) throw error;
}

// Recovery path for a missed webhook: re-fetches the creator's subscription
// directly from Stripe and re-syncs it, so a creator who's actually current
// on payment isn't stuck locked out by is_membership_active's
// current_period_end expiry just because a webhook delivery failed. Called
// from /board/profile on load (an authenticated, low-traffic page — not run
// on the customer-facing public pages, to keep those fast and because only
// the creator themselves has a reason to trigger a resync of their own
// billing state). A no-op if the creator has never subscribed.
export async function reconcileMembership(
  admin: Client,
  stripe: Stripe,
  userId: string
): Promise<Membership | null> {
  const existing = await getMembership(admin, userId);
  if (!existing?.stripeSubscriptionId) return existing;

  const subscription = await stripe.subscriptions.retrieve(
    existing.stripeSubscriptionId
  );
  await syncMembershipFromSubscription(
    admin,
    existing.stripeCustomerId,
    subscription,
    { allowSubscriptionReassign: false }
  );

  return getMembership(admin, userId);
}
