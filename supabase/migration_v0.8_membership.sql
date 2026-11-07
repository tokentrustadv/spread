-- Spread v0.8 — membership billing (Stripe)
-- Run this in the Supabase SQL editor against the existing project
-- (after migration_v0.6_terms_version.sql). Additive only.

create table if not exists memberships (
  user_id uuid primary key references profiles(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  -- Mirrors Stripe's own subscription.status values directly (trialing, active,
  -- past_due, canceled, unpaid, incomplete, incomplete_expired), or 'none' before
  -- the creator's first checkout. Kept in sync by the Stripe webhook handler.
  status text not null default 'none',
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  -- Set once on first checkout, never cleared — gates eligibility for the
  -- "first three months for $12" offer so it can only be used once per creator.
  intro_offer_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

-- A creator can read and write only their own row (used by the checkout/portal
-- routes and the membership status block on /board/profile, all running as the
-- authenticated creator — no service-role key needed for these).
create policy "memberships_select_own" on memberships
  for select using (auth.uid() = user_id);

create policy "memberships_insert_own" on memberships
  for insert with check (auth.uid() = user_id);

create policy "memberships_update_own" on memberships
  for update using (auth.uid() = user_id);

-- No delete policy: membership rows are never deleted by the app, only
-- transitioned through Stripe's statuses.

-- ---------------------------------------------------------------------------
-- Public "is this creator currently able to accept requests" check
-- ---------------------------------------------------------------------------
-- A customer viewing a creator's public menu/order page needs to know whether
-- THAT creator (not themselves) has an active membership. Rather than opening
-- a public RLS policy on the whole memberships table (which would expose
-- Stripe customer/subscription IDs and billing dates to anyone), this exposes
-- only a boolean through a SECURITY DEFINER function, callable with the plain
-- anon key — no service-role key needed for this read path either.
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
  );
$$;

grant execute on function public.is_membership_active(uuid) to anon, authenticated;
