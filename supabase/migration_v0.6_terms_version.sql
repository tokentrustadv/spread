-- Spread v0.6 — terms version + server-side enforcement
-- Run this in the Supabase SQL editor against the existing project
-- (after migration_v0.4_terms.sql). Additive only.

alter table profiles add column if not exists terms_version text;

-- Backfill existing rows so the CHECK constraint below can be added safely.
update profiles
set terms_version = 'v1'
where agreed_terms_at is not null and terms_version is null;

-- A profile cannot exist without recording that terms were agreed to and
-- which version — this is enforced by Postgres itself, not just app code,
-- so it holds even if a future code path forgets to check the client-side box.
alter table profiles
  add constraint profiles_agreed_terms_required
  check (agreed_terms_at is not null and terms_version is not null);
