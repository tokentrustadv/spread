"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SpreadRequest } from "@/types/spread";
import {
  formatPriceEstimate,
  formatRequestedWindow,
  CONTACT_CHANNEL_LABELS,
  STATUS_LABELS,
} from "@/lib/requestFormat";

async function postStatus(id: string, expectedStatus: string, newStatus: string) {
  const res = await fetch(`/api/requests/${id}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expectedStatus, newStatus }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong.");
  }
  return data;
}

function secondaryButtonClass() {
  return "flex-1 rounded-input border border-line2 bg-surface px-5 py-3 font-display text-[15px] font-semibold text-hot transition-colors hover:bg-tomato-tint disabled:cursor-not-allowed disabled:opacity-50";
}

function RequestCard({
  request,
  onActed,
}: {
  request: SpreadRequest;
  onActed: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(newStatus: string, confirmMessage?: string) {
    if (confirmMessage && !confirm(confirmMessage)) return;
    setPending(true);
    setError(null);
    try {
      await postStatus(request.id, request.status, newStatus);
      onActed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPending(false);
    }
  }

  const isNew = request.status === "new";
  const isAccepted = request.status === "accepted";

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-sm font-bold">{request.spreadTitle}</p>
          <p className="text-xs text-soft">
            {new Date(request.requestedAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-tomato-tint px-2.5 py-1 text-[11px] font-semibold text-hot">
          {STATUS_LABELS[request.status] ?? request.status}
        </span>
      </div>

      <div className="mt-3 text-sm text-soft">
        {request.items.map((item, i) => (
          <p key={i}>
            {item.restaurant}: {item.item}
            {item.note ? ` (${item.note})` : ""}
          </p>
        ))}
      </div>

      <p className="mt-2 text-sm">
        Qty {request.quantity} ·{" "}
        {formatPriceEstimate(request.listedPriceCents, request.quantity)}
      </p>

      <p className="mt-2 text-sm">
        {formatRequestedWindow(
          request.requestedWindowStart,
          request.requestedWindowEnd,
          request.requestedWindowTz
        )}
      </p>

      <div className="mt-3 rounded-input bg-bg p-3 text-sm">
        <p className="font-semibold">{request.customerDisplayName}</p>
        <p className="text-soft">
          {CONTACT_CHANNEL_LABELS[request.contactChannel] ?? request.contactChannel}:{" "}
          {request.socialHandle}
        </p>
      </div>

      {error && <p className="mt-2 text-xs text-hot">{error}</p>}

      {(isNew || isAccepted) && (
        <div className="mt-4 flex gap-2">
          {isNew && (
            <>
              <button
                type="button"
                onClick={() => handleAction("accepted")}
                disabled={pending}
                className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAction(
                    "declined",
                    "Decline this request? The customer won't be notified automatically."
                  )
                }
                disabled={pending}
                className={secondaryButtonClass()}
              >
                Decline
              </button>
            </>
          )}
          {isAccepted && (
            <>
              <button
                type="button"
                onClick={() => handleAction("completed")}
                disabled={pending}
                className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Complete
              </button>
              <button
                type="button"
                onClick={() =>
                  handleAction(
                    "cancelled",
                    "Cancel this request? The customer won't be notified automatically."
                  )
                }
                disabled={pending}
                className={secondaryButtonClass()}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function RequestList({
  initialRequests,
}: {
  initialRequests: SpreadRequest[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleActed() {
    startTransition(() => {
      router.refresh();
    });
  }

  if (initialRequests.length === 0) {
    return <p className="text-center text-sm text-soft">No requests yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {initialRequests.map((r) => (
        <RequestCard key={r.id} request={r} onActed={handleActed} />
      ))}
    </div>
  );
}
