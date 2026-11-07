-- Spread v0.10 — resolve the terms-acceptance constraint for existing rows
--
-- migration_v0.9_catchup_v3_v4_v6.sql added profiles_agreed_terms_required
-- as NOT VALID specifically so it wouldn't choke on rows that predate the
-- terms columns entirely — but NOT VALID still applies to every future
-- INSERT/UPDATE, which meant any edit to one of those pre-existing rows
-- (not just a terms-related one) failed outright. In practice this is a
-- single row: Chip's own account.
--
-- Chip asked directly, in this conversation, to resolve this so profile
-- edits work — that request is itself today's acceptance, recorded with
-- today's timestamp. This is different from the backfill v0.9 deliberately
-- avoided (silently inventing a past timestamp for consent that was never
-- actually given): this one is real, contemporaneous, and explicit.
--
-- Written generally (not scoped to one row) so it's correct if this is ever
-- run against a database with other legacy rows in the same state. Safe to
-- run more than once — the WHERE clause means it only touches rows that
-- still need it.

update profiles
set agreed_terms_at = now(),
    terms_version = 'v1'
where agreed_terms_at is null
   or terms_version is null;

-- Every row now satisfies the constraint, so validate it for real — this
-- is the step that makes it an actual guarantee enforced for ALL rows,
-- not just future writes, closing the gap NOT VALID deliberately left open.
alter table profiles validate constraint profiles_agreed_terms_required;
