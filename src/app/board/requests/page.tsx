import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile";
import { listActiveRequestsForCreator } from "@/services/requests";
import { Logo } from "@/components/Logo";
import { RequestList } from "./RequestList";

export default async function RequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const profile = await getProfile(supabase, user.id);
  if (!profile) redirect("/welcome");

  const requests = await listActiveRequestsForCreator(supabase, user.id);

  return (
    <main className="frame py-10">
      <div className="flex items-center justify-between">
        <div>
          <Logo size={16} />
          <h1 className="mt-1 font-display text-2xl font-extrabold">Requests</h1>
        </div>
        <Link href="/board" className="text-sm font-medium text-soft hover:text-ink">
          ← Back to board
        </Link>
      </div>

      <p className="mt-2 text-xs text-soft">
        Accepting a request doesn&rsquo;t change your Spread or your area
        &mdash; it&rsquo;s your call every time.
      </p>

      <p className="mt-2 text-xs text-soft">
        Accepting starts the conversation, not a payment. After you accept:
        your customer pays you directly, you confirm you received it, then
        you buy the item at the restaurant and deliver it yourself. Spread
        only ever collects your membership fee &mdash; never a customer&rsquo;s
        meal payment.
      </p>

      <p className="mt-2 text-xs text-soft">
        Newest first. Requests expire after seven days if you haven&rsquo;t
        responded. Finished requests are deleted 30 days after you close
        them. Spread removes a deleted request from its active database
        right away; routine backups may retain a copy for some time after
        that.
      </p>

      <div className="mt-6">
        <RequestList initialRequests={requests} />
      </div>
    </main>
  );
}
