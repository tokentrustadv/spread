import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile";
import { WelcomeForm } from "./WelcomeForm";

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const profile = await getProfile(supabase, user.id);
  if (profile) redirect("/board");

  return (
    <main className="frame flex min-h-screen flex-col justify-center py-16">
      <h1 className="font-display text-3xl font-extrabold">Welcome to Spread</h1>
      <p className="mt-2 text-[15px] text-soft">
        Set your name and handle. Your handle is your permanent share link.
      </p>
      <div className="mt-8">
        <WelcomeForm userId={user.id} />
      </div>
    </main>
  );
}
