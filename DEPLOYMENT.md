# Deployment checklist

Run this before and after every deploy that touches the database, billing,
or any customer-facing flow. It exists so a round of changes doesn't ship
with an unrun migration, a stale env var, or a broken end-to-end flow —
each of those has happened once already in this project.

## 1. Before you deploy

- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Any new `supabase/migration_v*.sql` file has been run, in order, in
      the Supabase SQL editor against the **same project the live app
      uses** — confirm this isn't a second/staging project if there's ever
      doubt. Confirm each statement reports success before running the
      next migration file.
- [ ] Any new env var (new Stripe price ID, new secret, etc.) is set in
      **Vercel → Project → Settings → Environment Variables** for
      Production, not just `.env.local`.
- [ ] Stripe is still pointed at the **Spread Development** sandbox
      (test-mode keys) unless a live-mode cutover was explicitly decided
      and asked for. Check `STRIPE_SECRET_KEY` starts with `sk_test_`.
- [ ] `CRON_SECRET` and `REQUEST_IP_HASH_SECRET` are set in Vercel with
      their own randomly-generated values (`openssl rand -hex 32` or
      similar) — **not** copied from `.env.local`. These are app-internal
      secrets, not third-party credentials, so there's no dashboard to
      cross-check them against; generating fresh ones per environment is
      the only thing that keeps local/dev values from leaking into
      production.

## 2. Deploy

- Merge to `main` (or push directly if that's the deploy branch) and let
  Vercel build.
- If the webhook route (`src/app/api/stripe/webhook/route.ts`) changed in
  a way that could affect signature verification or event handling,
  re-check the registered webhook endpoint in the Stripe Dashboard
  (Developers → Webhooks) still points at the deployed URL and that
  `STRIPE_WEBHOOK_SECRET` in Vercel matches the endpoint's signing secret.
- If `vercel.json`'s cron entry is new or changed, confirm it registered:
  Vercel → Project → Settings → Cron Jobs should list
  `/api/cron/cleanup-requests`. Don't assume it's wired up from a manual
  `curl` test alone — check that an actual scheduled invocation happened
  (the Cron Jobs tab shows last-run time) after the next scheduled time
  passes, not just that the route works when called by hand.

## 3. After you deploy — explicit test list

Run these against the live (or just-deployed) app, not local dev, since
env vars and the real webhook endpoint only apply there.

**Creator journey**
- [ ] Sign up with a fresh email, confirm the magic-link flow works
- [ ] Build a Spread from the homepage demo, confirm it carries through to
      the signup → new-spread form pre-filled correctly
- [ ] Create a spread manually from `/board/new`
- [ ] Edit a spread, confirm nav back to `/board` works
- [ ] Edit profile (bio, payment handles, agree-to-terms gate if unset)

**Membership / billing** (test-mode card `4242 4242 4242 4242`, declined
card `4000 0000 0000 0341`)
- [ ] Activate membership from `/board/profile`, confirm Checkout redirect
      and return
- [ ] Confirm `memberships.status` lands on `trialing` and the $12 intro
      charge posts
- [ ] "Manage billing" opens the Stripe portal without error
- [ ] Cancel via the portal, confirm `cancel_at_period_end` is set and
      access/request-accepting continues until `current_period_end`
- [ ] Confirm a lapsed/canceled membership turns off request-accepting on
      the public pages (`/[handle]`, `/[handle]/[slug]`,
      `/[handle]/[slug]/order`) even if `is_live` is still checked
- [ ] Trigger a failed payment and confirm the webhook flips status and
      access follows

**Public pages**
- [ ] `/[handle]` shows "Accepting requests" only when `is_live` AND
      membership are both active
- [ ] `/[handle]/[slug]` three-way state (accepting / paused / not live)
      is correct
- [ ] `/[handle]/[slug]/order` redirects away when it shouldn't be
      reachable
- [ ] `/example` — sample-data notice is visible, request preview toggle
      works and is clearly non-functional

**Request queue**
- [ ] Submit a request from `/[handle]/[slug]/order`, confirm the "saved,
      not yet accepted" confirmation and reference code appear
- [ ] Request shows up on `/board/requests`, and the New count on `/board`
      increments
- [ ] Accept, then Complete a request — confirm `/board` counts update
- [ ] Submitting while the creator isn't live/paused/unmembered is
      rejected with a clear message, not silently queued
- [ ] Hit the per-IP rate limit (a handful of quick submissions to the
      same spread) and confirm the 6th within an hour is rejected, not
      silently accepted
- [ ] `GET /api/cron/cleanup-requests` without the `Authorization` header
      returns 401

**Responsive / accessibility spot check**
- [ ] Homepage at ~360px, ~390px, ~768px, and desktop width
- [ ] Demo: selection count updates, checkmarks show, long meal name
      doesn't break layout
- [ ] Tab through the homepage once — focus is visible somewhere, nothing
      is silently unreachable by keyboard

## 4. If something's wrong

- A failed migration mid-file: check which statements already applied
  (most are `IF NOT EXISTS` / idempotent) before re-running — don't assume
  a failure means nothing happened.
- A webhook not firing: check Stripe Dashboard → Developers → Webhooks →
  the endpoint's recent deliveries before assuming the app code is wrong.
- Never disable raw-card API access restrictions or Stripe security
  settings to work around a test failure — use documented test
  PaymentMethod IDs or Stripe-hosted Checkout instead.
