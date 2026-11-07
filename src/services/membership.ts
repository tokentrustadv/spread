import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import type { Database } from "@/types/database";
import type { Membership, MembershipStatus } from "@/types/spread";

type Client = SupabaseClient<Database>;

const ACTIVE_STATUSES: MembershipStatus[] = ["trialing", "active"];

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

// Webhook write path — matched by stripe_customer_id (unique-indexed), using
// the admin (service-role) client since there's no Supabase session on a
// Stripe-initiated request.
//
// allowSubscriptionReassign controls whether this call is allowed to change
// which subscription the row tracks:
// - true: only from checkout.session.completed, the one place a NEW
//   subscription is intentionally and authoritatively attached to a
//   creator's row (first signup or a reactivation after cancellation).
// - false: from customer.subscription.updated/deleted. These fire per
//   subscription, and a customer can have more than one subscription object
//   over their lifetime (an old canceled one, a newer reactivated one). A
//   delayed/retried event for an OLD subscription must never overwrite a
//   row that has since moved on to tracking a NEWER one, so these calls are
//   dropped (treated as a safe no-op) unless the event's subscription id
//   still matches what the row currently has on file.
export async function syncMembershipFromSubscription(
  admin: Client,
  stripeCustomerId: string,
  subscription: Stripe.Subscription,
  { allowSubscriptionReassign }: { allowSubscriptionReassign: boolean }
): Promise<void> {
  if (!allowSubscriptionReassign) {
    const { data: current, error: readError } = await admin
      .from("memberships")
      .select("stripe_subscription_id")
      .eq("stripe_customer_id", stripeCustomerId)
      .maybeSingle();
    if (readError) throw readError;

    const trackedId = current?.stripe_subscription_id ?? null;
    if (trackedId !== null && trackedId !== subscription.id) {
      // Event is for a subscription this row isn't (or is no longer)
      // tracking — ignore it rather than let stale/out-of-order data from a
      // superseded subscription clobber the current one.
      return;
    }
  }

  const currentPeriodEnd = subscription.items.data[0]?.current_period_end;

  const { error } = await admin
    .from("memberships")
    .update({
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_end: currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq("stripe_customer_id", stripeCustomerId);

  if (error) throw error;
}

// Only ever called after checkout.session.completed has confirmed the
// subscription (i.e. the initial payment succeeded) — see the checkout
// route and webhook handler. Guarded so it only fires once per creator.
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
