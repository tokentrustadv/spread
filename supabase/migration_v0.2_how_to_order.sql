-- Spread v0.2 — "How to order" layer
-- Run this in the Supabase SQL editor against the existing v0.1 project.
-- Additive only: two nullable columns on profiles, no changes to RLS,
-- no new tables.

alter table profiles add column if not exists social_link text;
alter table profiles add column if not exists availability text;
