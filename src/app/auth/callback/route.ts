import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile";
import { siteUrl } from "@/lib/site";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const profile = await getProfile(supabase, data.user.id);
      return NextResponse.redirect(
        `${siteUrl}${profile ? "/board" : "/welcome"}`
      );
    }
  }

  return NextResponse.redirect(`${siteUrl}/`);
}
