-- Spread v0.2d — Cash App / Venmo prefilled pay links
-- Run this in the Supabase SQL editor against the existing project
-- (after migration_v0.2c_pricing.sql). Additive only.

alter table profiles add column if not exists cashapp_handle text;
alter table profiles add column if not exists venmo_handle text;
