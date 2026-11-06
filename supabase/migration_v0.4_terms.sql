-- Spread v0.4 — terms acceptance
-- Run this in the Supabase SQL editor against the existing project
-- (after migration_v0.3_public_menu.sql). Additive only.

alter table profiles add column if not exists agreed_terms_at timestamptz;
