"use client";

import { useState } from "react";
import type { Membership } from "@/types/spread";

function formatDate(iso: string | null): string {
  if (!iso) return "soon";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MembershipStatus({
  membership,
}: {
  membership: Membership | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go(path: "/api/stripe/checkout" | "/api/stripe/portal") {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(path, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  const status = membership?.status ?? "none";

  let body: React.ReactNode;

  if (!membership || status === "none") {
    body = (
      <>
        <p className="font-display text-sm font-bold">Activate your membership</p>
        <p className="mt-1 text-sm text-soft">
          $12 to start — your first three months are included. $12/month
          after that. Cancel anytime.
        </p>
        <button
          onClick={() => go("/api/stripe/checkout")}
          disabled={loading}
          className="btn-primary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Starting…" : "Activate — $12 to start"}
        </button>
      </>
    );
  } else if (status === "trialing") {
    body = (
      <>
        <p className="font-display text-sm font-bold text-herb">
          Membership active — first three months included
        </p>
        <p className="mt-1 text-sm text-soft">
          Next charge: {formatDate(membership.currentPeriodEnd)}
          {membership.cancelAtPeriodEnd && " (cancels before then)"}
        </p>
        <button
          onClick={() => go("/api/stripe/portal")}
          disabled={loading}
          className="btn-secondary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Opening…" : "Manage billing"}
        </button>
      </>
    );
  } else if (status === "active") {
    body = (
      <>
        <p className="font-display text-sm font-bold text-herb">
          Membership active
        </p>
        <p className="mt-1 text-sm text-soft">
          {membership.cancelAtPeriodEnd
            ? `Cancels ${formatDate(membership.currentPeriodEnd)}`
            : `Renews ${formatDate(membership.currentPeriodEnd)} — $12/month`}
        </p>
        <button
          onClick={() => go("/api/stripe/portal")}
          disabled={loading}
          className="btn-secondary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Opening…" : "Manage billing"}
        </button>
      </>
    );
  } else if (status === "past_due" || status === "unpaid" || status === "incomplete") {
    body = (
      <>
        <p className="font-display text-sm font-bold text-hot">
          Membership payment issue
        </p>
        <p className="mt-1 text-sm text-soft">
          Your last payment didn&rsquo;t go through. Update your payment
          method to keep accepting requests.
        </p>
        <button
          onClick={() => go("/api/stripe/portal")}
          disabled={loading}
          className="btn-primary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Opening…" : "Update payment method"}
        </button>
      </>
    );
  } else {
    body = (
      <>
        <p className="font-display text-sm font-bold text-soft">
          Membership inactive
        </p>
        <p className="mt-1 text-sm text-soft">
          Your menu is still here — reactivate to start accepting requests
          again.
        </p>
        <button
          onClick={() => go("/api/stripe/checkout")}
          disabled={loading}
          className="btn-primary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Starting…" : "Reactivate — $12/month"}
        </button>
      </>
    );
  }

  return (
    <div className="card p-4">
      {body}
      {error && <p className="mt-2 text-sm text-hot">{error}</p>}
    </div>
  );
}
