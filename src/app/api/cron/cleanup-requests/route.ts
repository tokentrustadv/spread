import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateRequestStatus } from "@/services/requests";

export const dynamic = "force-dynamic";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
const ARCHIVE_BATCH_LIMIT = 500;

// Vercel Cron sends a GET request with an Authorization: Bearer
// <CRON_SECRET> header matching the project's configured secret — verified
// here before anything else runs. Anyone else hitting this URL without the
// secret gets a bare 401, no information about what the route does.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - THIRTY_DAYS_MS).toISOString();
  const fortyEightHoursAgo = new Date(now.getTime() - FORTY_EIGHT_HOURS_MS).toISOString();
  const nowIso = now.toISOString();

  // 1. Bound "accepted" from staying open forever: a request accepted more
  // than 30 days ago with no further action is archived — labeled "outcome
  // not recorded", not auto-claimed as cancelled by anyone — which then
  // follows the normal terminal-status deletion rule below. Worst case, an
  // abandoned accepted request is gone in 60 days total, never
  // indefinitely. Uses the same atomic expected-status guard as a
  // creator's own Accept/Decline click, so a creator acting on a request
  // at the same moment the cron runs can't race with it.
  const { data: staleAccepted, error: staleAcceptedError } = await admin
    .from("requests")
    .select("id, creator_id")
    .eq("status", "accepted")
    .lt("accepted_at", thirtyDaysAgo)
    .limit(ARCHIVE_BATCH_LIMIT);
  if (staleAcceptedError) throw staleAcceptedError;

  let archivedCount = 0;
  for (const row of staleAccepted ?? []) {
    const result = await updateRequestStatus(admin, {
      requestId: row.id,
      creatorId: row.creator_id,
      expectedStatus: "accepted",
      newStatus: "archived",
    });
    if (result.ok) archivedCount += 1;
  }

  // 2. Terminal requests (completed/declined/cancelled/archived), 30 days
  // after they closed.
  const { data: deletedTerminal, error: terminalError } = await admin
    .from("requests")
    .delete()
    .in("status", ["completed", "declined", "cancelled", "archived"])
    .lt("closed_at", thirtyDaysAgo)
    .select("id");
  if (terminalError) throw terminalError;

  // 3. Unanswered ("new") requests past their 7-day expiry. These already
  // stopped appearing in the active queue the moment they expired (the
  // queue query filters on expires_at directly) — this is strictly the
  // physical deletion, for storage/privacy, not something the UI depends
  // on for correctness.
  const { data: deletedExpired, error: expiredError } = await admin
    .from("requests")
    .delete()
    .eq("status", "new")
    .lt("expires_at", nowIso)
    .select("id");
  if (expiredError) throw expiredError;

  // 4. Rate-limit ledger only needs to cover a rolling 1-hour window —
  // purge anything older than 48 hours as a comfortable margin.
  const { data: deletedRateLimitEvents, error: rateLimitError } = await admin
    .from("request_rate_limit_events")
    .delete()
    .lt("created_at", fortyEightHoursAgo)
    .select("id");
  if (rateLimitError) throw rateLimitError;

  return NextResponse.json({
    archived: archivedCount,
    deletedTerminal: deletedTerminal?.length ?? 0,
    deletedExpired: deletedExpired?.length ?? 0,
    deletedRateLimitEvents: deletedRateLimitEvents?.length ?? 0,
  });
}
