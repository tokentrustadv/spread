import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMembership } from "@/services/membership";
import { getStripe } from "@/lib/stripe";
import { siteUrl } from "@/lib/site";

const PORTAL_CONFIG_METADATA_KEY = "managed_by";
const PORTAL_CONFIG_METADATA_VALUE = "spread-app";

async function ensurePortalConfiguration(
  stripe: ReturnType<typeof getStripe>
): Promise<string> {
  const existing = await stripe.billingPortal.configurations.list({
    limit: 100,
  });
  const found = existing.data.find(
    (c) => c.metadata?.[PORTAL_CONFIG_METADATA_KEY] === PORTAL_CONFIG_METADATA_VALUE
  );
  if (found) return found.id;

  const created = await stripe.billingPortal.configurations.create({
    metadata: { [PORTAL_CONFIG_METADATA_KEY]: PORTAL_CONFIG_METADATA_VALUE },
    business_profile: {
      headline: "Spread Membership",
    },
    features: {
      customer_update: {
        enabled: true,
        allowed_updates: ["email", "address"],
      },
      payment_method_update: { enabled: true },
      invoice_history: { enabled: true },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
        // Stripe requires a non-empty options list even with collection
        // disabled — this list is simply never shown to the customer since
        // enabled is false.
        cancellation_reason: {
          enabled: false,
          options: ["too_expensive", "missing_features", "unused", "other"],
        },
      },
    },
  });
  return created.id;
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const membership = await getMembership(supabase, user.id);
  if (!membership) {
    return NextResponse.json(
      { error: "No membership yet." },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  const configuration = await ensurePortalConfiguration(stripe);

  const session = await stripe.billingPortal.sessions.create({
    customer: membership.stripeCustomerId,
    configuration,
    return_url: `${siteUrl}/board/profile`,
  });

  return NextResponse.json({ url: session.url });
}
