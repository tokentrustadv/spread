import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requestStatusSchema } from "@/lib/validation";
import { isValidTransition, updateRequestStatus } from "@/services/requests";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = requestStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status change." }, { status: 400 });
  }
  const { expectedStatus, newStatus } = parsed.data;

  if (!isValidTransition(expectedStatus, newStatus)) {
    return NextResponse.json(
      { error: "That status change isn't allowed." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  // Ownership (creator_id = user.id) and "this is still the status it was"
  // are both enforced atomically inside update_request_status()'s own
  // UPDATE — a request that belongs to a different creator, or one that
  // changed status between page load and this click, both come back as
  // the same status_conflict rather than a separate ownership error,
  // which is the right call here: it never reveals whether the request
  // exists at all for a creator it doesn't belong to.
  const result = await updateRequestStatus(admin, {
    requestId: id,
    creatorId: user.id,
    expectedStatus,
    newStatus,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: "This request was already updated — refresh to see its current status." },
      { status: 409 }
    );
  }

  return NextResponse.json({ status: result.request.status });
}
