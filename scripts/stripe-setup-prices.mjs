// Idempotent: creates (or finds) the two test-mode Prices Spread's
// membership checkout needs, then prints the IDs to paste into env vars.
// Safe to rerun — matches existing Prices by lookup_key instead of
// creating duplicates.
//
// Usage: STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup-prices.mjs

import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  console.error("Set STRIPE_SECRET_KEY first.");
  process.exit(1);
}

const stripe = new Stripe(secretKey, { apiVersion: "2026-10-28.endive" });

const INTRO_LOOKUP_KEY = "spread_membership_intro";
const MONTHLY_LOOKUP_KEY = "spread_membership_monthly";
const PRODUCT_NAME = "Spread Membership";

async function findOrCreateProduct() {
  const existing = await stripe.products.search({
    query: `name:'${PRODUCT_NAME}' AND active:'true'`,
  });
  if (existing.data[0]) return existing.data[0];

  return stripe.products.create({
    name: PRODUCT_NAME,
    description: "Spread creator membership — build, share, and accept requests.",
  });
}

async function findOrCreatePrice(lookupKey, params) {
  const existing = await stripe.prices.list({
    lookup_keys: [lookupKey],
    limit: 1,
  });
  if (existing.data[0]) return existing.data[0];

  return stripe.prices.create({ ...params, lookup_key: lookupKey });
}

async function main() {
  const product = await findOrCreateProduct();

  const introPrice = await findOrCreatePrice(INTRO_LOOKUP_KEY, {
    product: product.id,
    currency: "usd",
    unit_amount: 1200,
    nickname: "Intro — first charge",
  });

  const monthlyPrice = await findOrCreatePrice(MONTHLY_LOOKUP_KEY, {
    product: product.id,
    currency: "usd",
    unit_amount: 1200,
    recurring: { interval: "month" },
    nickname: "Monthly membership",
  });

  console.log("Product:", product.id);
  console.log("STRIPE_PRICE_INTRO_ID=" + introPrice.id);
  console.log("STRIPE_PRICE_MONTHLY_ID=" + monthlyPrice.id);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
