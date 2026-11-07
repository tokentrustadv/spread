-- Spread v0.9 — catch-up migration
--
-- Discovered while testing v0.8's membership migration: this production
-- database is missing columns from THREE earlier migrations that were
-- believed to already be live — migration_v0.3_public_menu.sql,
-- migration_v0.4_terms.sql, and migration_v0.6_terms_version.sql. Confirmed
-- directly against the database (not inferred): spreads.is_paused,
-- profiles.bio, profiles.agreed_terms_at, and profiles.terms_version all
-- returned a genuine "column does not exist" error, while every column from
-- the v0.1 base schema and all four v0.2 sub-migrations is present. The
-- memberships table from v0.8 is also confirmed present and complete.
--
-- Practical impact right now, before this runs: WelcomeForm's signup flow
-- (services/profile.ts createProfile) explicitly inserts agreed_terms_at
-- and terms_version — that insert fails outright against a database
-- missing those columns, so new creator signups do not work. Per-spread
-- pausing (is_paused) silently has no effect either, since the column it
-- would read/write doesn't exist.
--
-- Run this in the Supabase SQL editor. Additive only; safe to run more than
-- once.

alter table profiles add column if not exists bio text;
alter table spreads add column if not exists is_paused boolean not null default false;
alter table profiles add column if not exists agreed_terms_at timestamptz;
alter table profiles add column if not exists terms_version text;

-- Added NOT VALID rather than exactly as migration_v0.6 originally wrote it:
-- every existing profile row in this database predates these columns
-- entirely (any signup attempt that ran after this constraint's application
-- code shipped would have hard-failed on the missing-column error above,
-- rather than creating a row with these fields null), so there is no
-- honest timestamp to backfill them with — writing one in now would be
-- recording consent that didn't actually happen. NOT VALID enforces the
-- constraint on every future insert/update immediately, without validating
-- it against the existing rows; Chip can decide separately, per row,
-- whether/how to handle those pre-existing profiles (e.g. re-confirm terms
-- with those specific creators, or validate the constraint once satisfied
-- there's nothing to reconcile).
alter table profiles drop constraint if exists profiles_agreed_terms_required;
alter table profiles
  add constraint profiles_agreed_terms_required
  check (agreed_terms_at is not null and terms_version is not null)
  not valid;
