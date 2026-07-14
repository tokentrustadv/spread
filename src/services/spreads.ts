import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { Spread, SpreadWithOwner } from "@/types/spread";
import type { SpreadInput } from "@/lib/validation";
import type { SpreadColor } from "@/lib/colors";
import { slugify, dedupeSlug } from "@/lib/slug";
import { getProfileByHandle } from "@/services/profile";

type Client = SupabaseClient<Database>;

const SPREAD_SELECT =
  "*, spread_restaurants(*, spread_items(*))";

type RawSpread = Database["public"]["Tables"]["spreads"]["Row"] & {
  spread_restaurants: (Database["public"]["Tables"]["spread_restaurants"]["Row"] & {
    spread_items: Database["public"]["Tables"]["spread_items"]["Row"][];
  })[];
};

function toSpread(row: RawSpread): Spread {
  const restaurants = [...row.spread_restaurants]
    .sort((a, b) => a.position - b.position)
    .map((r) => ({
      id: r.id,
      name: r.name,
      position: r.position,
      items: [...r.spread_items]
        .sort((a, b) => a.position - b.position)
        .map((i) => ({
          id: i.id,
          name: i.name,
          note: i.note,
          position: i.position,
        })),
    }));

  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    title: row.title,
    color: row.color as SpreadColor,
    notes: row.notes,
    isPublic: row.is_public,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    restaurants,
  };
}

export async function listSpreads(
  supabase: Client,
  userId: string
): Promise<Spread[]> {
  const { data, error } = await supabase
    .from("spreads")
    .select(SPREAD_SELECT)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as unknown as RawSpread[]).map(toSpread);
}

export async function getSpreadById(
  supabase: Client,
  id: string,
  userId: string
): Promise<Spread | null> {
  const { data, error } = await supabase
    .from("spreads")
    .select(SPREAD_SELECT)
    .eq("id", id)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data ? toSpread(data as unknown as RawSpread) : null;
}

export async function getPublicSpread(
  supabase: Client,
  handle: string,
  slug: string
): Promise<SpreadWithOwner | null> {
  const profile = await getProfileByHandle(supabase, handle);
  if (!profile) return null;

  const { data, error } = await supabase
    .from("spreads")
    .select(SPREAD_SELECT)
    .eq("user_id", profile.id)
    .eq("slug", slug)
    .eq("is_public", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...toSpread(data as unknown as RawSpread),
    ownerHandle: profile.handle,
    ownerDisplayName: profile.displayName,
  };
}

async function userSlugs(supabase: Client, userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("spreads")
    .select("slug")
    .eq("user_id", userId);

  if (error) throw error;
  return data.map((r) => r.slug);
}

async function insertRestaurantsAndItems(
  supabase: Client,
  spreadId: string,
  restaurants: SpreadInput["restaurants"]
) {
  for (let i = 0; i < restaurants.length; i += 1) {
    const restaurant = restaurants[i];
    const { data: restaurantRow, error: restaurantError } = await supabase
      .from("spread_restaurants")
      .insert({
        spread_id: spreadId,
        name: restaurant.name,
        position: i + 1,
      })
      .select("*")
      .single();

    if (restaurantError) throw restaurantError;

    const itemsPayload = restaurant.items.map((item, j) => ({
      restaurant_id: restaurantRow.id,
      name: item.name,
      note: item.note ? item.note : null,
      position: j + 1,
    }));

    const { error: itemsError } = await supabase
      .from("spread_items")
      .insert(itemsPayload);

    if (itemsError) throw itemsError;
  }
}

export async function createSpread(
  supabase: Client,
  userId: string,
  input: SpreadInput
): Promise<Spread> {
  const existingSlugs = await userSlugs(supabase, userId);
  const slug = dedupeSlug(slugify(input.title), existingSlugs);

  const { data: spreadRow, error: spreadError } = await supabase
    .from("spreads")
    .insert({
      user_id: userId,
      slug,
      title: input.title,
      color: input.color,
      notes: input.notes ? input.notes : null,
      is_public: input.isPublic,
    })
    .select("*")
    .single();

  if (spreadError) throw spreadError;

  try {
    await insertRestaurantsAndItems(supabase, spreadRow.id, input.restaurants);
  } catch (err) {
    await supabase.from("spreads").delete().eq("id", spreadRow.id);
    throw err;
  }

  const created = await getSpreadById(supabase, spreadRow.id, userId);
  if (!created) throw new Error("Failed to load created spread");
  return created;
}

export async function updateSpread(
  supabase: Client,
  id: string,
  userId: string,
  input: SpreadInput
): Promise<Spread> {
  const existing = await getSpreadById(supabase, id, userId);
  if (!existing) throw new Error("Spread not found");

  let slug = existing.slug;
  if (slugify(input.title) !== slugify(existing.title)) {
    const existingSlugs = (await userSlugs(supabase, userId)).filter(
      (s) => s !== existing.slug
    );
    slug = dedupeSlug(slugify(input.title), existingSlugs);
  }

  const { error: updateError } = await supabase
    .from("spreads")
    .update({
      title: input.title,
      slug,
      color: input.color,
      notes: input.notes ? input.notes : null,
      is_public: input.isPublic,
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (updateError) throw updateError;

  const { error: deleteError } = await supabase
    .from("spread_restaurants")
    .delete()
    .eq("spread_id", id);

  if (deleteError) throw deleteError;

  await insertRestaurantsAndItems(supabase, id, input.restaurants);

  const updated = await getSpreadById(supabase, id, userId);
  if (!updated) throw new Error("Failed to load updated spread");
  return updated;
}

export async function softDeleteSpread(
  supabase: Client,
  id: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("spreads")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}
