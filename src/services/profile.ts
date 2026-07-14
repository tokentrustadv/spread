import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { Profile } from "@/types/spread";

type Client = SupabaseClient<Database>;

function toProfile(row: Database["public"]["Tables"]["profiles"]["Row"]): Profile {
  return {
    id: row.id,
    handle: row.handle,
    displayName: row.display_name,
    createdAt: row.created_at,
  };
}

export async function getProfile(
  supabase: Client,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ? toProfile(data) : null;
}

export async function getProfileByHandle(
  supabase: Client,
  handle: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("handle", handle)
    .maybeSingle();

  if (error) throw error;
  return data ? toProfile(data) : null;
}

export async function isHandleAvailable(
  supabase: Client,
  handle: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("handle", handle)
    .maybeSingle();

  if (error) throw error;
  return !data;
}

export async function createProfile(
  supabase: Client,
  input: { id: string; handle: string; displayName: string }
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: input.id,
      handle: input.handle,
      display_name: input.displayName,
    })
    .select("*")
    .single();

  if (error) throw error;
  return toProfile(data);
}
