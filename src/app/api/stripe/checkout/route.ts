import { NextResponse } from "next/server";
import { addMonths } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile";
import { ensureStripeCustomer, getMembership } from "@/services/membership";
import { getStripe } from "@/lib/stripe";
import { siteUrl } from "@/lib/site";

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
  const membership = await ensureStripeCustomer(
    supabase,
    stripe,
    user.id,
    profile.displayName
  );

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
