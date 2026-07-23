import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      `${origin}/?error=${encodeURIComponent("Missing sign-in code.")}`
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error("Auth callback: exchangeCodeForSession failed", error);
    return NextResponse.redirect(
      `${origin}/?error=${encodeURIComponent(
        error?.message ?? "Sign-in failed. Try again."
      )}`
    );
  }

  const profile = await getProfile(supabase, data.user.id);
  return NextResponse.redirect(`${origin}${profile ? "/board" : "/welcome"}`);
}
