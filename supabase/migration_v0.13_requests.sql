-- Spread v0.13 — request queue
-- Run this in the Supabase SQL editor against the existing project
-- (after migration_v0.10_backfill_terms_acceptance.sql). Additive relative
-- to the rest of the schema — never touches profiles, spreads, or
-- memberships. Safe to paste in more than once: every statement below
-- drops and recreates requests' own policies/functions identically each
-- time, so edits to this file take effect on a second paste.

create table if not exists requests (
  id         uuid primary key default gen_random_uuid(),
  creator_id uuid not null references profiles(id) on delete cascade,
  spread_id  uuid not null references spreads(id) on delete cascade,

  -- Snapshot of the spread as it actually was at request time, built
  -- SERVER-SIDE from the live spread_restaurants/spread_items rows (see
  -- services/requests.ts) — never accepted as client input. Editing the
  -- spread later never changes what a past request shows.
  spread_title text not null,
  -- [{ restaurant: text, item: text, note: text|null }, ...], 1-3 entries,
  -- mirroring spreads' own "2 restaurants, 1-3 items total" shape. The
  -- array-shape check below is a backstop only — the real validation is
  -- that this column is only ever written by submit_request() with a
  -- payload this app's own server code built from the live spread, so
  -- there's no adversarial path into this column to defend against.
  items jsonb not null
    check (jsonb_typeof(items) = 'array'
           and jsonb_array_length(items) between 1 and 3),
  currency text not null default 'USD' check (currency = 'USD'),
  -- Snapshot of spreads.price in cents. NULL (not 0) when the spread had
  -- no price set — spreads.price is itself nullable, and this preserves
  -- that rather than inventing a $0.00 that was never true.
  listed_price_cents integer check (listed_price_cents is null or listed_price_cents >= 0),
  quantity integer not null default 1 check (quantity between 1 and 10),

  -- Structured contact fields only — no free-text notes field. The
  -- customer is told directly (in the UI, not enforced here) to share an
  -- address or payment details with the creator, not through this form.
  customer_display_name text not null
    check (char_length(customer_display_name) between 1 and 80),
  contact_channel text not null
    check (contact_channel in ('instagram', 'messenger', 'other')),
  social_handle text not null
    check (char_length(social_handle) between 1 and 80),

  -- Optional delivery window. requested_window_tz is the IANA zone the
  -- customer's wall-clock input was interpreted in (validated server-side
  -- before this insert) — stored alongside the UTC timestamps so the
  -- creator's queue always displays the window in the zone the customer
  -- meant, never silently reinterpreted in the creator's or server's zone.
  requested_window_start timestamptz,
  requested_window_end   timestamptz,
  requested_window_tz    text,
  check (
    (requested_window_start is null and requested_window_end is null and requested_window_tz is null)
    or (requested_window_start is not null and requested_window_tz is not null
        and (requested_window_end is null or requested_window_end >= requested_window_start))
  ),

  -- 'archived' = the system closed this out after 30 days of no action on
  -- an accepted request — an honest "outcome not recorded" label, not a
  -- fabricated cancellation. See update_request_status() and the cron
  -- cleanup route.
  status text not null default 'new'
    check (status in ('new', 'accepted', 'completed', 'declined', 'cancelled', 'archived')),

  -- Client-generated idempotency key (one per form load). The unique
  -- constraint is the hard backstop; submit_request() also serializes on
  -- this value via an advisory lock so a genuinely concurrent duplicate
  -- submit can never create two rows.
  client_submission_id uuid not null unique,

  requested_at timestamptz not null default now(),
  -- Set the moment status flips new -> accepted.
  accepted_at  timestamptz,
  -- Set the moment status reaches any terminal state (completed, declined,
  -- cancelled, archived). Distinct from accepted_at so "when did this
  -- close" is never ambiguous with "when was it accepted".
  closed_at    timestamptz,
  -- 7 days from creation. The active-queue query filters on this directly
  -- (see services/requests.ts) so an expired 'new' request stops appearing
  -- immediately even if the cleanup cron hasn't run yet — the cron's job
  -- is strictly physical deletion for storage/privacy, never the thing the
  -- UI depends on for correctness.
  expires_at timestamptz not null default (now() + interval '7 days')
);

create index if not exists requests_creator_status_idx
  on requests(creator_id, status);
create index if not exists requests_creator_requested_idx
  on requests(creator_id, requested_at desc);
create index if not exists requests_closed_at_idx
  on requests(status, closed_at) where closed_at is not null;
create index if not exists requests_expires_at_idx
  on requests(status, expires_at) where status = 'new';

alter table requests enable row level security;

-- Same zero-write-policy pattern as memberships: the creator can read
-- their own requests, nothing else. Every write (submit, status change)
-- goes through submit_request()/update_request_status() below, called
-- only by the service-role client, which bypasses RLS by design.
drop policy if exists "requests_select_own" on requests;
create policy "requests_select_own" on requests
  for select using (auth.uid() = creator_id);

-- ---------------------------------------------------------------------------
-- Rate-limit ledger
-- ---------------------------------------------------------------------------
-- One row per accepted submission attempt, keyed by a salted HMAC of the
-- submitter's IP (REQUEST_IP_HASH_SECRET, server-only) — never the raw IP.
-- Durable and shared across every Vercel instance (unlike an in-process
-- counter), which is the only way a rate limit means anything when the app
-- runs as multiple concurrent instances. No RLS policy at all: there is no
-- legitimate client reader for this table, only the service-role client via
-- submit_request().
create table if not exists request_rate_limit_events (
  id         bigint generated always as identity primary key,
  creator_id uuid not null references profiles(id) on delete cascade,
  ip_hash    text not null,
  created_at timestamptz not null default now()
);

create index if not exists request_rate_limit_events_creator_idx
  on request_rate_limit_events(creator_id, created_at);
create index if not exists request_rate_limit_events_iphash_idx
  on request_rate_limit_events(ip_hash, created_at);

alter table request_rate_limit_events enable row level security;

-- ---------------------------------------------------------------------------
-- submit_request() — the one and only write path for creating a request
-- ---------------------------------------------------------------------------
-- Atomically: (a) treats a repeated client_submission_id as a no-op that
-- returns the original row rather than creating a duplicate, (b) enforces
-- two rate limits — 5/hour per (ip_hash, creator) and 20/hour per ip_hash
-- globally — and (c) records the attempt and inserts the row, all within
-- one transaction, serialized by two advisory locks so concurrent calls
-- can't race past the count-then-insert checks:
--   1. A lock keyed on client_submission_id, held for the whole call, so no
--      two calls carrying the same id can ever both decide "this is new".
--   2. A lock keyed on ip_hash, held only once past the idempotency
--      check, so the rate-limit count-then-insert is race-safe per
--      submitter without serializing unrelated submitters against each
--      other.
-- A successful retry of the same submission never consumes rate-limit
-- quota, because the idempotency check returns before either limit is
-- even read.
--
-- Deliberately does NOT re-check spread/creator eligibility (is_live,
-- is_paused, membership) — that happens in the calling route using the
-- existing TypeScript services, a few milliseconds before this call. The
-- gap that leaves is a benign, non-adversarial race (a creator's status
-- flips in the instant between the route's check and this insert), not a
-- security boundary — the same shape of gap the checkout route's own
-- existing-subscription check already accepts.
create or replace function public.submit_request(
  p_client_submission_id   uuid,
  p_creator_id             uuid,
  p_spread_id              uuid,
  p_ip_hash                text,
  p_spread_title           text,
  p_items                  jsonb,
  p_listed_price_cents     integer,
  p_quantity               integer,
  p_customer_display_name  text,
  p_contact_channel        text,
  p_social_handle          text,
  p_requested_window_start timestamptz,
  p_requested_window_end   timestamptz,
  p_requested_window_tz    text
)
returns requests
language plpgsql
as $$
declare
  v_existing requests;
  v_new requests;
  v_per_creator_count integer;
  v_global_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_client_submission_id::text, 1));

  -- Error signaling uses plain RAISE EXCEPTION message text, matched
  -- exactly by the caller (services/requests.ts) — not a custom SQLSTATE
  -- via `using errcode`, since the easy-to-reach-for P0xxx range is
  -- already reserved by plpgsql itself (P0001 is literally the default
  -- code every bare RAISE EXCEPTION gets), so a hand-picked code there
  -- would collide rather than distinguish anything.
  select * into v_existing from requests where client_submission_id = p_client_submission_id;
  if found then
    if v_existing.spread_id <> p_spread_id then
      raise exception 'submission_mismatch';
    end if;
    return v_existing;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_ip_hash, 0));

  select count(*) into v_per_creator_count
    from request_rate_limit_events
    where ip_hash = p_ip_hash and creator_id = p_creator_id
      and created_at > now() - interval '1 hour';

  if v_per_creator_count >= 5 then
    raise exception 'rate_limited_creator';
  end if;

  select count(*) into v_global_count
    from request_rate_limit_events
    where ip_hash = p_ip_hash
      and created_at > now() - interval '1 hour';

  if v_global_count >= 20 then
    raise exception 'rate_limited_global';
  end if;

  insert into requests (
    creator_id, spread_id, spread_title, items, listed_price_cents, quantity,
    customer_display_name, contact_channel, social_handle,
    requested_window_start, requested_window_end, requested_window_tz,
    client_submission_id
  ) values (
    p_creator_id, p_spread_id, p_spread_title, p_items, p_listed_price_cents, p_quantity,
    p_customer_display_name, p_contact_channel, p_social_handle,
    p_requested_window_start, p_requested_window_end, p_requested_window_tz,
    p_client_submission_id
  )
  returning * into v_new;

  insert into request_rate_limit_events (creator_id, ip_hash)
  values (p_creator_id, p_ip_hash);

  return v_new;
end;
$$;

revoke all on function public.submit_request from public;
grant execute on function public.submit_request to service_role;

-- ---------------------------------------------------------------------------
-- update_request_status() — the one and only write path for status changes
-- ---------------------------------------------------------------------------
-- Ownership and "this is still the status I think it is" are both enforced
-- inside the UPDATE's own WHERE clause, not as a separate read-then-write
-- check — so two concurrent actions on the same request (two tabs, a
-- double click on Accept/Decline) can never both succeed: whichever
-- transaction commits first moves the row off p_expected_status, and the
-- second's WHERE clause then matches zero rows and raises status_conflict.
-- Also used by the cleanup cron to archive a stale accepted request, which
-- gets the same atomicity against a creator acting on it at the same
-- moment the cron runs.
create or replace function public.update_request_status(
  p_request_id     uuid,
  p_creator_id     uuid,
  p_expected_status text,
  p_new_status      text
)
returns requests
language plpgsql
as $$
declare
  v_row requests;
begin
  update requests
  set status = p_new_status,
      accepted_at = case when p_new_status = 'accepted' then now() else accepted_at end,
      closed_at = case
        when p_new_status in ('completed', 'declined', 'cancelled', 'archived') then now()
        else closed_at
      end
  where id = p_request_id
    and creator_id = p_creator_id
    and status = p_expected_status
  returning * into v_row;

  if not found then
    raise exception 'status_conflict';
  end if;

  return v_row;
end;
$$;

revoke all on function public.update_request_status from public;
grant execute on function public.update_request_status to service_role;
