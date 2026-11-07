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

// Works with any client (own-row RLS or admin) — used by the creator's own
// dashboard and by server routes acting on the authenticated creator's behalf.
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
// memberships row exists, using the creator's OWN session client — allowed by
// the memberships_insert_own/update_own RLS policies, no service role needed.
export async function ensureStripeCustomer(
  supabase: Client,
  stripe: Stripe,
  userId: string,
  displayName: string
): Promise<Membership> {
  const existing = await getMembership(supabase, userId);
  if (existing) return existing;

  const customer = await stripe.customers.create({
    name: displayName,
    metadata: { supabase_user_id: userId },
  });

  const { data, error } = await supabase
    .from("memberships")
    .insert({
      user_id: userId,
      stripe_customer_id: customer.id,
      status: "none",
    })
    .select("*")
    .single();

  if (error) throw error;
  return toMembership(data);
}

// Webhook write path — matched by stripe_customer_id (unique-indexed), using
// the admin (service-role) client since there's no Supabase session on a
// Stripe-initiated request.
export async function syncMembershipFromSubscription(
  admin: Client,
  stripeCustomerId: string,
  subscription: Stripe.Subscription
): Promise<void> {
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
