-- Spread v0.8 — membership billing (Stripe)
-- Run this in the Supabase SQL editor against the existing project
-- (after migration_v0.6_terms_version.sql). Additive relative to the rest
-- of the schema — it never touches profiles, spreads, or any of their
-- existing rows, columns, or policies. It is safe to paste in more than
-- once, but rerunning it is NOT a no-op against itself: every statement
-- below drops and recreates memberships' own index/trigger/policies/
-- function identically each time, so edits to this file take effect on a
-- second paste. Nothing about that touches any other table.

create table if not exists memberships (
  user_id uuid primary key references profiles(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  -- The tracked subscription's own Stripe-assigned creation time. Used to
  -- atomically reject a reassignment from a delayed/out-of-order
  -- checkout.session.completed event for an OLDER, superseded checkout
  -- attempt — a newer subscription already on file can never be replaced by
  -- one created earlier, no matter what order webhooks arrive in.
  stripe_subscription_created_at timestamptz,
  -- Mirrors Stripe's own subscription.status values directly (trialing, active,
  -- past_due, canceled, unpaid, incomplete, incomplete_expired), or 'none' before
  -- the creator's first checkout. Kept in sync by the Stripe webhook handler.
  status text not null default 'none',
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  -- Set once on first checkout, never cleared — gates eligibility for the
  -- "first three months for $12" offer so it can only be used once per creator.
  intro_offer_used_at timestamptz,
  -- A durable, atomically-claimed reservation that serializes checkout
  -- attempts per creator: the checkout route can only create a new Checkout
  -- Session if it wins this slot via a single conditional UPDATE (not a
  -- read-then-decide check), which Postgres's row-level locking makes
  -- genuinely race-proof under concurrent requests. A short expiry (not a
  -- manual release) means a crashed or abandoned attempt can't permanently
  -- wedge a creator out of checking out again.
  pending_checkout_session_id text,
  pending_checkout_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table memberships add column if not exists stripe_subscription_created_at timestamptz;
alter table memberships add column if not exists pending_checkout_session_id text;
alter table memberships add column if not exists pending_checkout_expires_at timestamptz;

create unique index if not exists memberships_stripe_customer_id_idx
  on memberships(stripe_customer_id);
create index if not exists memberships_stripe_subscription_id_idx
  on memberships(stripe_subscription_id);

drop trigger if exists memberships_touch_updated_at on memberships;
create trigger memberships_touch_updated_at
  before update on memberships
  for each row
  execute function touch_updated_at();

alter table memberships enable row level security;

-- A creator can read their own row (the membership status block on
-- /board/profile) — nothing else. The row is created and every field on it
-- updated exclusively by trusted server-side code using the service-role
-- client (ensureStripeCustomer for the initial row, the Stripe webhook for
-- every billing-state change after), never by a client-authenticated
-- request, so there is deliberately no insert, update, or delete policy
-- for the authenticated/anon roles here. An insert-own policy would have
-- let a creator insert their own row with status='active' and a
-- self-chosen stripe_customer_id directly from the browser — granting
-- themselves membership without paying, since nothing in an insert-own
-- check constrains which VALUES go into the other columns, only which
-- user_id. Likewise an update-own policy would let them rewrite status on
-- an existing row. With zero insert/update/delete policies, Postgres RLS
-- denies those operations outright for authenticated/anon roles; only a
-- role that bypasses RLS (service_role, via the admin client) can write.
drop policy if exists "memberships_select_own" on memberships;
create policy "memberships_select_own" on memberships
  for select using (auth.uid() = user_id);

-- Drop policies from earlier drafts of this migration that granted direct
-- client writes — both were security bugs, not an intentional later
-- restriction, so there's nothing to preserve by keeping them around.
drop policy if exists "memberships_insert_own" on memberships;
drop policy if exists "memberships_update_own" on memberships;

-- ---------------------------------------------------------------------------
-- Public "is this creator currently able to accept requests" check
-- ---------------------------------------------------------------------------
-- A customer viewing a creator's public menu/order page needs to know whether
-- THAT creator (not themselves) has an active membership. Rather than opening
-- a public RLS policy on the whole memberships table (which would expose
-- Stripe customer/subscription IDs and billing dates to anyone), this exposes
-- only a boolean through a SECURITY DEFINER function, callable with the plain
-- anon key — no service-role key needed for this read path either.
--
-- Requiring current_period_end > now() alongside status, rather than trusting
-- status alone, bounds how long a missed or delayed webhook (a cancellation
-- Stripe failed to deliver, an outage, etc.) can leave access granted: even
-- in the worst case where every subsequent webhook for a subscription is
-- lost, access expires on its own at the end of the last period we actually
-- heard about, instead of indefinitely. During the trialing status this is
-- exactly trial_end (verified directly against Stripe: current_period_end
-- equals trial_end for the whole trial), so this doesn't cut the three
-- included months short — it only ever fails closed, never early.
create or replace function public.is_membership_active(target_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from memberships
    where user_id = target_user_id
      and status in ('trialing', 'active')
      and current_period_end > now()
  );
$$;

grant execute on function public.is_membership_active(uuid) to anon, authenticated;
