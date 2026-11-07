import { NextResponse } from "next/server";
import { addMonths } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProfile } from "@/services/profile";
import { ensureStripeCustomer } from "@/services/membership";
import { getStripe } from "@/lib/stripe";
import { siteUrl } from "@/lib/site";

// Subscription statuses that mean "there's already a membership in flight or
// active for this customer" — Stripe statuses, not our own.
const NON_TERMINAL_SUBSCRIPTION_STATUSES = [
  "trialing",
  "active",
  "past_due",
  "unpaid",
  "incomplete",
];

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const profile = await getProfile(supabase, user.id);
  if (!profile) {
    return NextResponse.json({ error: "No profile yet." }, { status: 400 });
  }

  const introPriceId = process.env.STRIPE_PRICE_INTRO_ID;
  const monthlyPriceId = process.env.STRIPE_PRICE_MONTHLY_ID;
  if (!introPriceId || !monthlyPriceId) {
    return NextResponse.json(
      { error: "Membership pricing isn't configured yet." },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  const admin = createAdminClient();
  const membership = await ensureStripeCustomer(
    admin,
    stripe,
    user.id,
    profile.displayName
  );

  // Guard against duplicate subscriptions from concurrent checkout attempts
  // (e.g. two tabs, a double click before the first redirect lands): if this
  // customer already has a subscription that isn't fully terminal, don't
  // start another one. Checked against Stripe directly (not just our own
  // row) since it's the authoritative source and catches the case where our
  // DB hasn't been synced yet either.
  const existingSubscriptions = await stripe.subscriptions.list({
    customer: membership.stripeCustomerId,
    status: "all",
    limit: 10,
  });
  const hasNonTerminalSubscription = existingSubscriptions.data.some((s) =>
    NON_TERMINAL_SUBSCRIPTION_STATUSES.includes(s.status)
  );
  if (hasNonTerminalSubscription) {
    return NextResponse.json(
      { error: "You already have a membership in progress." },
      { status: 409 }
    );
  }

  const introEligible = !membership.introOfferUsedAt;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: membership.stripeCustomerId,
    line_items: introEligible
      ? [
          { price: introPriceId, quantity: 1 },
          { price: monthlyPriceId, quantity: 1 },
        ]
      : [{ price: monthlyPriceId, quantity: 1 }],
    subscription_data: {
      metadata: { supabase_user_id: user.id },
      ...(introEligible
        ? { trial_end: Math.floor(addMonths(new Date(), 3).getTime() / 1000) }
        : {}),
    },
    metadata: {
      supabase_user_id: user.id,
      intro_offer: introEligible ? "true" : "false",
    },
    success_url: `${siteUrl}/board/profile?checkout=success`,
    cancel_url: `${siteUrl}/board/profile?checkout=cancelled`,
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Could not start checkout." },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: session.url });
}
