import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile";
import { getMembership } from "@/services/membership";
import { EditProfileForm } from "./EditProfileForm";
import { MembershipStatus } from "@/components/MembershipStatus";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const profile = await getProfile(supabase, user.id);
  if (!profile) redirect("/welcome");

  const membership = await getMembership(supabase, user.id);

  return (
    <main className="frame py-10">
      <h1 className="font-display text-2xl font-extrabold">Edit profile</h1>
      <p className="mt-1 text-sm text-soft">
        @{profile.handle} — how people find you to order.
      </p>
      <div className="mt-6">
        <MembershipStatus membership={membership} />
      </div>
      <div className="mt-8">
        <EditProfileForm userId={user.id} profile={profile} />
      </div>
    </main>
  );
}
