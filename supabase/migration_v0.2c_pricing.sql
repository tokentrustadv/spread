-- Spread v0.2c — per-spread pricing
-- Run this in the Supabase SQL editor against the existing project
-- (after migration_v0.2b_go_live.sql). Additive only.

alter table spreads add column if not exists food_cost numeric(10, 2);
alter table spreads add column if not exists price numeric(10, 2);
