import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { syncMembershipFromSubscription, markIntroOfferUsed } from "@/services/membership";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription" || !session.subscription) break;

      const subscription = await stripe.subscriptions.retrieve(
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id
      );
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;
      if (!customerId) break;

      // checkout.session.completed is the one place a NEW subscription is
      // intentionally attached to a creator's row (first signup, or a
      // reactivation after an earlier cancellation) — always allowed to
      // (re)assign which subscription the row tracks.
      await syncMembershipFromSubscription(admin, customerId, subscription, {
        allowSubscriptionReassign: true,
      });

      if (session.metadata?.intro_offer === "true") {
        await markIntroOfferUsed(admin, customerId);
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      // Re-fetch rather than trust event.data.object directly: Stripe does
      // not guarantee webhook delivery order, so an older event processed
      // after a newer one could otherwise overwrite current state with
      // stale data (e.g. incorrectly restoring or reverting access). Always
      // reading Stripe's current canonical state makes the result converge
      // to the truth regardless of delivery order.
      const eventSubscription = event.data.object as Stripe.Subscription;
      const subscription = await stripe.subscriptions.retrieve(
        eventSubscription.id
      );
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;
      // Not allowed to reassign which subscription the row tracks — a
      // delayed/retried event about a subscription the row has since moved
      // on from (e.g. an old one, superseded by a reactivation) is dropped
      // rather than applied. See syncMembershipFromSubscription.
      await syncMembershipFromSubscription(admin, customerId, subscription, {
        allowSubscriptionReassign: false,
      });
      break;
    }

    // Stripe sends customer.subscription.updated alongside a failed invoice
    // (status moves to past_due/unpaid), which the case above already syncs —
    // no separate handling needed here. Stripe's own Smart Retries handle
    // dunning; Spread just reflects whatever status results.
    case "invoice.payment_failed":
      break;

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
