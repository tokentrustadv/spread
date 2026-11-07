import crypto from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type {
  ContactChannel,
  RequestCounts,
  RequestItemSnapshot,
  SpreadRequest,
} from "@/types/spread";
import { isMembershipActiveForUser } from "@/services/membership";

type Client = SupabaseClient<Database>;
type RequestRow = Database["public"]["Tables"]["requests"]["Row"];

function toSpreadRequest(row: RequestRow): SpreadRequest {
  return {
    id: row.id,
    creatorId: row.creator_id,
    spreadId: row.spread_id,
    spreadTitle: row.spread_title,
    items: row.items as RequestItemSnapshot[],
    currency: row.currency,
    listedPriceCents: row.listed_price_cents,
    quantity: row.quantity,
    customerDisplayName: row.customer_display_name,
    contactChannel: row.contact_channel as ContactChannel,
    socialHandle: row.social_handle,
    requestedWindowStart: row.requested_window_start,
    requestedWindowEnd: row.requested_window_end,
    requestedWindowTz: row.requested_window_tz,
    status: row.status as SpreadRequest["status"],
    requestedAt: row.requested_at,
    acceptedAt: row.accepted_at,
    closedAt: row.closed_at,
    expiresAt: row.expires_at,
  };
}

// A server-only, salted hash of the submitter's IP — never the raw IP is
// stored or logged. REQUEST_IP_HASH_SECRET is a random string generated
// once for this app (not a third-party credential), kept only in env vars.
export function hashIp(ip: string): string {
  const secret = process.env.REQUEST_IP_HASH_SECRET;
  if (!secret) throw new Error("REQUEST_IP_HASH_SECRET is not configured.");
  return crypto.createHmac("sha256", secret).update(ip).digest("hex");
}

type RawSpreadForRequest = {
  user_id: string;
  title: string;
  is_paused: boolean;
  price: number | null;
  spread_restaurants: {
    name: string;
    position: number;
    spread_items: { name: string; note: string | null; position: number }[];
  }[];
};

export type SpreadSnapshotForRequest = {
  creatorId: string;
  spreadTitle: string;
  items: RequestItemSnapshot[];
  listedPriceCents: number | null;
  // True only if the spread is public/not deleted AND the owner is live,
  // not paused, and currently has an active membership — re-verified here
  // at submission time, independent of whatever the page last rendered.
  eligible: boolean;
};

export async function loadSpreadForRequest(
  admin: Client,
  spreadId: string
): Promise<SpreadSnapshotForRequest | null> {
  const { data: spread, error } = await admin
    .from("spreads")
    .select("*, spread_restaurants(*, spread_items(*))")
    .eq("id", spreadId)
    .eq("is_public", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  if (!spread) return null;

  const row = spread as unknown as RawSpreadForRequest;

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("is_live")
    .eq("id", row.user_id)
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile) return null;

  const membershipActive = await isMembershipActiveForUser(admin, row.user_id);

  const items: RequestItemSnapshot[] = [...row.spread_restaurants]
    .sort((a, b) => a.position - b.position)
    .flatMap((r) =>
      [...r.spread_items]
        .sort((a, b) => a.position - b.position)
        .map((i) => ({ restaurant: r.name, item: i.name, note: i.note }))
    );

  return {
    creatorId: row.user_id,
    spreadTitle: row.title,
    items,
    listedPriceCents: row.price != null ? Math.round(row.price * 100) : null,
    eligible: profile.is_live && !row.is_paused && membershipActive,
  };
}

export type SubmitRequestParams = {
  clientSubmissionId: string;
  creatorId: string;
  spreadId: string;
  ipHash: string;
  spreadTitle: string;
  items: RequestItemSnapshot[];
  listedPriceCents: number | null;
  quantity: number;
  customerDisplayName: string;
  contactChannel: ContactChannel;
  socialHandle: string;
  requestedWindowStart: string | null;
  requestedWindowEnd: string | null;
  requestedWindowTz: string | null;
};

export type SubmitRequestResult =
  | { ok: true; request: SpreadRequest }
  | {
      ok: false;
      reason: "submission_mismatch" | "rate_limited_creator" | "rate_limited_global";
    };

// The one write path for creating a request — see submit_request() in
// migration_v0.13_requests.sql for the atomicity (idempotency + rate
// limiting) this delegates to. Errors are matched by the exact message
// text the SQL function raises, not a SQLSTATE code (see the migration's
// own comment on why).
export async function submitRequest(
  admin: Client,
  params: SubmitRequestParams
): Promise<SubmitRequestResult> {
  const { data, error } = await admin.rpc("submit_request", {
    p_client_submission_id: params.clientSubmissionId,
    p_creator_id: params.creatorId,
    p_spread_id: params.spreadId,
    p_ip_hash: params.ipHash,
    p_spread_title: params.spreadTitle,
    p_items: params.items,
    p_listed_price_cents: params.listedPriceCents,
    p_quantity: params.quantity,
    p_customer_display_name: params.customerDisplayName,
    p_contact_channel: params.contactChannel,
    p_social_handle: params.socialHandle,
    p_requested_window_start: params.requestedWindowStart,
    p_requested_window_end: params.requestedWindowEnd,
    p_requested_window_tz: params.requestedWindowTz,
  });

  if (error) {
    if (error.message.includes("submission_mismatch")) {
      return { ok: false, reason: "submission_mismatch" };
    }
    if (error.message.includes("rate_limited_creator")) {
      return { ok: false, reason: "rate_limited_creator" };
    }
    if (error.message.includes("rate_limited_global")) {
      return { ok: false, reason: "rate_limited_global" };
    }
    throw error;
  }

  return { ok: true, request: toSpreadRequest(data as RequestRow) };
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  new: ["accepted", "declined", "cancelled"],
  accepted: ["completed", "cancelled"],
};

export function isValidTransition(from: string, to: string): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export type UpdateStatusResult =
  | { ok: true; request: SpreadRequest }
  | { ok: false; reason: "status_conflict" };

// The one write path for status changes. Ownership (creator_id match) and
// "this is still the status the caller thinks it is" are both enforced
// inside the SQL UPDATE itself — see update_request_status() — so this is
// safe to call concurrently without a separate lock here.
export async function updateRequestStatus(
  admin: Client,
  params: {
    requestId: string;
    creatorId: string;
    expectedStatus: string;
    newStatus: string;
  }
): Promise<UpdateStatusResult> {
  const { data, error } = await admin.rpc("update_request_status", {
    p_request_id: params.requestId,
    p_creator_id: params.creatorId,
    p_expected_status: params.expectedStatus,
    p_new_status: params.newStatus,
  });

  if (error) {
    if (error.message.includes("status_conflict")) {
      return { ok: false, reason: "status_conflict" };
    }
    throw error;
  }

  return { ok: true, request: toSpreadRequest(data as RequestRow) };
}

// The creator's own session client is enough here (requests_select_own
// RLS) — no service role needed just to read. Excludes expired 'new' rows
// directly in the query (not just in the cleanup cron), so an expired
// request disappears from the queue the instant it expires.
export async function listActiveRequestsForCreator(
  supabase: Client,
  creatorId: string
): Promise<SpreadRequest[]> {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("creator_id", creatorId)
    .or(`status.neq.new,expires_at.gt.${nowIso}`)
    .order("requested_at", { ascending: false });

  if (error) throw error;
  return (data as RequestRow[]).map(toSpreadRequest);
}

export async function getRequestCounts(
  supabase: Client,
  creatorId: string
): Promise<RequestCounts> {
  const nowIso = new Date().toISOString();

  const [{ count: newCount, error: newError }, { count: activeCount, error: activeError }] =
    await Promise.all([
      supabase
        .from("requests")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", creatorId)
        .eq("status", "new")
        .gt("expires_at", nowIso),
      supabase
        .from("requests")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", creatorId)
        .eq("status", "accepted"),
    ]);

  if (newError) throw newError;
  if (activeError) throw activeError;

  return { newCount: newCount ?? 0, activeCount: activeCount ?? 0 };
}
