import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile";
import { listSpreads } from "@/services/spreads";
import { SpreadCard } from "@/components/SpreadCard";
import { SignOut } from "@/components/SignOut";

export default async function BoardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const profile = await getProfile(supabase, user.id);
  if (!profile) redirect("/welcome");

  const spreads = await listSpreads(supabase, user.id);

  return (
    <main className="frame py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-sm font-bold text-hot">Spread +</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold">
            @{profile.handle}
          </h1>
        </div>
        <SignOut />
      </div>

      <Link href="/board/new" className="btn-primary mt-6 w-full">
        + New spread
      </Link>

      <div className="mt-8 flex flex-col gap-3">
        {spreads.length === 0 ? (
          <p className="mt-8 text-center text-sm text-soft">
            No spreads yet. Build your first one.
          </p>
        ) : (
          spreads.map((spread) => (
            <SpreadCard key={spread.id} spread={spread} handle={profile.handle} />
          ))
        )}
      </div>
    </main>
  );
}
