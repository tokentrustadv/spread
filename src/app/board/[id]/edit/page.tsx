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
      <h1 className="font-display text-2xl font-extrabold">Edit spread</h1>
      <div className="mt-8">
        <SpreadForm userId={user.id} handle={profile.handle} spread={spread} />
      </div>
    </main>
  );
}
