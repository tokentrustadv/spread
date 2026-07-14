-- Spread v0.1 schema
-- Run this in the Supabase SQL editor for a fresh project.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  handle        text not null unique,
  display_name  text not null,
  created_at    timestamptz not null default now()
);

create table if not exists spreads (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  slug        text not null,
  title       text not null,
  color       text not null default 'tomato',
  notes       text,
  is_public   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz,
  unique (user_id, slug)
);

create table if not exists spread_restaurants (
  id         uuid primary key default gen_random_uuid(),
  spread_id  uuid not null references spreads(id) on delete cascade,
  name       text not null,
  position   int not null
);

create table if not exists spread_items (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references spread_restaurants(id) on delete cascade,
  name           text not null,
  note           text,
  position       int not null default 0
);

create index if not exists spreads_user_id_idx on spreads(user_id);
create index if not exists spread_restaurants_spread_id_idx on spread_restaurants(spread_id);
create index if not exists spread_items_restaurant_id_idx on spread_items(restaurant_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists spreads_touch_updated_at on spreads;
create trigger spreads_touch_updated_at
  before update on spreads
  for each row
  execute function touch_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table profiles enable row level security;
alter table spreads enable row level security;
alter table spread_restaurants enable row level security;
alter table spread_items enable row level security;

-- profiles: readable by anyone (resolves @handle publicly), writable only by owner
create policy "profiles_select_all" on profiles
  for select using (true);

create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- spreads: owner has full access; public can select live public spreads
create policy "spreads_owner_all" on spreads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "spreads_public_select" on spreads
  for select using (is_public and deleted_at is null);

-- spread_restaurants: inherit access from parent spread
create policy "spread_restaurants_owner_all" on spread_restaurants
  for all using (
    exists (
      select 1 from spreads
      where spreads.id = spread_restaurants.spread_id
        and spreads.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from spreads
      where spreads.id = spread_restaurants.spread_id
        and spreads.user_id = auth.uid()
    )
  );

create policy "spread_restaurants_public_select" on spread_restaurants
  for select using (
    exists (
      select 1 from spreads
      where spreads.id = spread_restaurants.spread_id
        and spreads.is_public
        and spreads.deleted_at is null
    )
  );

-- spread_items: inherit access from parent spread via restaurant
create policy "spread_items_owner_all" on spread_items
  for all using (
    exists (
      select 1 from spread_restaurants
      join spreads on spreads.id = spread_restaurants.spread_id
      where spread_restaurants.id = spread_items.restaurant_id
        and spreads.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from spread_restaurants
      join spreads on spreads.id = spread_restaurants.spread_id
      where spread_restaurants.id = spread_items.restaurant_id
        and spreads.user_id = auth.uid()
    )
  );

create policy "spread_items_public_select" on spread_items
  for select using (
    exists (
      select 1 from spread_restaurants
      join spreads on spreads.id = spread_restaurants.spread_id
      where spread_restaurants.id = spread_items.restaurant_id
        and spreads.is_public
        and spreads.deleted_at is null
    )
  );
