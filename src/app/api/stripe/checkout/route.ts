import { NextResponse } from "next/server";
import { addMonths } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProfile } from "@/services/profile";
import {
  ensureStripeCustomer,
  claimCheckoutReservation,
  storeCheckoutSessionId,
} from "@/services/membership";
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

  // Atomically claim the right to start a checkout for this creator. This is
  // a single conditional database UPDATE (see claimCheckoutReservation), not
  // a read-then-decide check here in JS, so two genuinely simultaneous
  // requests (two tabs, a double click) cannot both proceed — Postgres
  // serializes the competing UPDATEs and only one can match.
  const claim = await claimCheckoutReservation(admin, user.id);
  if (!claim.won) {
    if (claim.reusableSessionId) {
      const existing = await stripe.checkout.sessions.retrieve(
        claim.reusableSessionId
      );
      if (existing.status === "open" && existing.url) {
        return NextResponse.json({ url: existing.url });
      }
    }
    return NextResponse.json(
      { error: "A checkout is already starting. Try again in a moment." },
      { status: 409 }
    );
  }

  // Separate from the reservation above (which only protects against truly
  // concurrent requests): a creator who is already subscribed, visiting
  // "Activate" again later with no concurrency involved, shouldn't be able
  // to start a second subscription either. Checked against Stripe directly,
  // not just our own row, since it's the authoritative source.
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
    // Restricted to card: the only method this flow has been tested with.
    // Several of Stripe's other default methods (Klarna, Cash App, Amazon
    // Pay) settle asynchronously — checkout.session.completed can fire for
    // those with payment_status still "unpaid", which would need handling
    // checkout.session.async_payment_succeeded/failed separately. Until
    // that's built and tested, card keeps the payment-confirmation logic in
    // the webhook (a single synchronous payment_status check) actually
    // correct for every session this route can create.
    allowed_payment_method_types: ["card"],
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

  await storeCheckoutSessionId(admin, user.id, session.id);

  return NextResponse.json({ url: session.url });
}
