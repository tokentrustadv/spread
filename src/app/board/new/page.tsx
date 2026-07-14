import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile";
import { SpreadForm } from "@/components/SpreadForm";

export default async function NewSpreadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const profile = await getProfile(supabase, user.id);
  if (!profile) redirect("/welcome");

  return (
    <main className="frame py-10">
      <h1 className="font-display text-2xl font-extrabold">New spread</h1>
      <p className="mt-1 text-sm text-soft">
        Two restaurants, up to three items, exactly how you love them.
      </p>
      <div className="mt-8">
        <SpreadForm userId={user.id} handle={profile.handle} />
      </div>
    </main>
  );
}
