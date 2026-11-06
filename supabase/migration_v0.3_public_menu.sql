-- Spread v0.3 — public menu + request-flow corrections
-- Run this in the Supabase SQL editor against the existing project
-- (after migration_v0.2d_payment_handles.sql). Additive only.

alter table profiles add column if not exists bio text;
alter table spreads add column if not exists is_paused boolean not null default false;
