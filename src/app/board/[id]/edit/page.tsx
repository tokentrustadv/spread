import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile";
import { getSpreadById } from "@/services/spreads";
import { SpreadForm } from "@/components/SpreadForm";

export default async function EditSpreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const profile = await getProfile(supabase, user.id);
  if (!profile) redirect("/welcome");

  const spread = await getSpreadById(supabase, id, user.id);
  if (!spread) notFound();

  return (
    <main className="frame py-10">
      <Link href="/board" className="text-sm text-soft hover:text-ink">
        ← Back to board
      </Link>
      <h1 className="mt-4 font-display text-2xl font-extrabold">Edit spread</h1>
      <div className="mt-8">
        <SpreadForm userId={user.id} handle={profile.handle} spread={spread} />
      </div>
    </main>
  );
}
