import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requestSubmitSchema } from "@/lib/validation";
import { isValidIanaTimeZone, zonedWallClockToUtc } from "@/lib/timezone";
import { getTrustedClientIp } from "@/lib/clientIp";
import { loadSpreadForRequest, submitRequest, hashIp } from "@/services/requests";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const NINETY_DAYS_MS = 90 * ONE_DAY_MS;

export async function POST(request: Request) {
  const ip = getTrustedClientIp(request);
  if (!ip) {
    return NextResponse.json(
      { error: "Could not verify your connection. Try again." },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = requestSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 }
    );
  }
  const input = parsed.data;

  // An optional delivery window — validated end-to-end here (IANA zone,
  // ordering, sensible bounds) before anything is written. See
  // lib/timezone.ts for the conversion itself.
  let windowStartUtc: Date | null = null;
  let windowEndUtc: Date | null = null;
  const tz = input.requestedWindowTz || null;

  if (input.requestedWindowStart) {
    if (!tz || !isValidIanaTimeZone(tz)) {
      return NextResponse.json(
        { error: "That time zone isn't recognized." },
        { status: 400 }
      );
    }
    try {
      windowStartUtc = zonedWallClockToUtc(input.requestedWindowStart, tz);
    } catch {
      return NextResponse.json(
        { error: "That delivery time isn't valid." },
        { status: 400 }
      );
    }

    if (input.requestedWindowEnd) {
      try {
        windowEndUtc = zonedWallClockToUtc(input.requestedWindowEnd, tz);
      } catch {
        return NextResponse.json(
          { error: "That delivery time isn't valid." },
          { status: 400 }
        );
      }
      if (windowEndUtc.getTime() < windowStartUtc.getTime()) {
        return NextResponse.json(
          { error: "The delivery window's end is before its start." },
          { status: 400 }
        );
      }
    }

    const now = Date.now();
    if (
      windowStartUtc.getTime() < now - ONE_DAY_MS ||
      windowStartUtc.getTime() > now + NINETY_DAYS_MS
    ) {
      return NextResponse.json(
        { error: "Pick a delivery time within the next 90 days." },
        { status: 400 }
      );
    }
  }

  const admin = createAdminClient();

  const snapshot = await loadSpreadForRequest(admin, input.spreadId);
  if (!snapshot) {
    return NextResponse.json({ error: "This Spread isn't available." }, { status: 404 });
  }
  if (!snapshot.eligible) {
    return NextResponse.json(
      { error: "This creator isn't accepting requests right now." },
      { status: 409 }
    );
  }

  const result = await submitRequest(admin, {
    clientSubmissionId: input.clientSubmissionId,
    creatorId: snapshot.creatorId,
    spreadId: input.spreadId,
    ipHash: hashIp(ip),
    spreadTitle: snapshot.spreadTitle,
    items: snapshot.items,
    listedPriceCents: snapshot.listedPriceCents,
    quantity: input.quantity,
    customerDisplayName: input.customerDisplayName,
    contactChannel: input.contactChannel,
    socialHandle: input.socialHandle,
    requestedWindowStart: windowStartUtc ? windowStartUtc.toISOString() : null,
    requestedWindowEnd: windowEndUtc ? windowEndUtc.toISOString() : null,
    requestedWindowTz: windowStartUtc ? tz : null,
  });

  if (!result.ok) {
    if (result.reason === "submission_mismatch") {
      // Deliberately generic — never reveals anything about the request
      // this submission id already belongs to.
      return NextResponse.json(
        { error: "This submission doesn't match the original request." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Too many requests right now. Try again in a bit." },
      { status: 429 }
    );
  }

  // Minimal confirmation only — never the full row, and there is no
  // general lookup endpoint for a request by id. The creator's chat link
  // is already known to the client from the spread page it came from.
  return NextResponse.json({
    reference: `REQ-${result.request.id.slice(0, 8).toUpperCase()}`,
    requestedAt: result.request.requestedAt,
  });
}
