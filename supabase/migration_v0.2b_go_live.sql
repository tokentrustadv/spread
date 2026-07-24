-- Spread v0.2b — creator delivery profile + go-live toggle
-- Run this in the Supabase SQL editor against the existing project
-- (after migration_v0.2_how_to_order.sql). Additive only.

alter table profiles add column if not exists area text;
alter table profiles add column if not exists payment_note text;
alter table profiles add column if not exists is_live boolean not null default false;
