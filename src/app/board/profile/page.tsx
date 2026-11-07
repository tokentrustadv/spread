import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProfile } from "@/services/profile";
import { getMembership, reconcileMembership } from "@/services/membership";
import { getStripe } from "@/lib/stripe";
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

  // Recovery path for a missed webhook: re-syncs this creator's billing
  // state straight from Stripe on every visit to their own profile page, so
  // a paying creator can't stay stuck locked out by a delivery failure they
  // have no way to trigger a retry of themselves. Cheap and safe to always
  // run here — this page is low-traffic and authenticated, unlike the
  // public pages, which stay fast and don't call Stripe at all.
  let membership;
  try {
    membership = await reconcileMembership(createAdminClient(), getStripe(), user.id);
  } catch {
    // If Stripe or the reconciliation call itself is unavailable, fall back
    // to whatever's already on file rather than breaking the whole page.
    membership = await getMembership(supabase, user.id);
  }

  return (
    <main className="frame py-10">
      <Link href="/board" className="text-sm text-soft hover:text-ink">
        ← Back to board
      </Link>
      <h1 className="mt-4 font-display text-2xl font-extrabold">Edit profile</h1>
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
