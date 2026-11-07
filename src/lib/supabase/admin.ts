import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Server-only. Never import this from a "use client" file.
//
// Bypasses RLS using the service-role key — used only where there's no
// Supabase user session to scope a request to (the Stripe webhook handler,
// which Stripe calls directly with no cookies/session at all).
//
// `apikey` stays the public anon key (required by Supabase's gateway for
// request routing) while `Authorization` carries the service-role secret,
// which is what actually determines the Postgres role (and RLS bypass).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceRoleKey) {
    throw new Error("Missing Supabase admin client configuration.");
  }

  return createSupabaseClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  });
}
