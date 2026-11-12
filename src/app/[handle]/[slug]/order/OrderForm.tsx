"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SpreadWithOwner } from "@/types/spread";
import { cashAppLink, venmoLink } from "@/lib/payLinks";
import { requestSubmitSchema } from "@/lib/validation";

type Confirmation = { reference: string; requestedAt: string };

const CHANNEL_OPTIONS: { value: "instagram" | "messenger" | "other"; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "messenger", label: "Messenger" },
  { value: "other", label: "Other" },
];

export function OrderForm({ spread }: { spread: SpreadWithOwner }) {
  // One id per form load — the server treats a retry carrying the same id
  // as the original submission rather than a new one, so a double-click
  // or a retry-after-network-error can never create a duplicate request.
  const [clientSubmissionId] = useState(() => crypto.randomUUID());
  const [detectedTz, setDetectedTz] = useState<string | null>(null);

  useEffect(() => {
    try {
      setDetectedTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setDetectedTz(null);
    }
  }, []);

  const [customerDisplayName, setCustomerDisplayName] = useState("");
  const [contactChannel, setContactChannel] = useState<"instagram" | "messenger" | "other">(
    "instagram"
  );
  const [socialHandle, setSocialHandle] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wantsWindow, setWantsWindow] = useState(false);
  const [windowLocal, setWindowLocal] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const payload = {
      spreadId: spread.id,
      clientSubmissionId,
      quantity,
      customerDisplayName: customerDisplayName.trim(),
      contactChannel,
      socialHandle: socialHandle.trim(),
      requestedWindowStart: wantsWindow ? windowLocal : "",
      requestedWindowEnd: "",
      requestedWindowTz: wantsWindow ? detectedTz ?? "" : "",
    };

    const parsed = requestSubmitSchema.safeParse(payload);
    if (!parsed.success) {
      setSubmitError("Please fill in your name and how to reach you.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/requests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data.error || "Couldn't save your request. Try again.");
        setSubmitting(false);
        return;
      }
      setConfirmation({ reference: data.reference, requestedAt: data.requestedAt });
    } catch {
      setSubmitError("Couldn't reach Spread. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  const summary = [
    confirmation ? `Request ref: ${confirmation.reference}` : null,
    `Request: ${spread.title}`,
    spread.price != null
      ? `Listed price: $${spread.price.toFixed(2)} × ${quantity} (subject to confirmation)`
      : null,
    `Name: ${customerDisplayName}`,
    address ? `Deliver to: ${address}` : null,
    instructions ? `Instructions: ${instructions}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  async function handleCopy() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/@${spread.ownerHandle}/${spread.slug}`}
        className="text-sm text-soft hover:text-ink"
      >
        ← Back to {spread.title}
      </Link>

      <div>
        <h1 className="font-display text-2xl font-extrabold">{spread.title}</h1>
        {spread.price != null && (
          <>
            <p className="mt-1 font-display text-xl font-bold text-hot">
              ${spread.price.toFixed(2)}
            </p>
            <p className="text-xs text-soft">
              For this meal and delivery in {spread.ownerDisplayName}&rsquo;s
              area — subject to the creator&rsquo;s confirmation.
            </p>
          </>
        )}
        {spread.ownerArea && (
          <p className="mt-2 text-sm text-soft">{spread.ownerArea}</p>
        )}
        {spread.ownerAvailability && (
          <p className="text-sm text-soft">{spread.ownerAvailability}</p>
        )}
        {spread.ownerPaymentNote && (
          <p className="text-sm text-soft">{spread.ownerPaymentNote}</p>
        )}
        <p className="mt-2 text-xs text-soft">
          Delivery location and timing confirmed by the creator.
        </p>
      </div>

      {!confirmation ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="font-display text-sm font-bold">Request this Spread</p>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-soft">
              Your name
            </label>
            <input
              className="input-field"
              value={customerDisplayName}
              maxLength={80}
              placeholder="Jordan"
              onChange={(e) => setCustomerDisplayName(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-semibold text-soft">
                Reach you on
              </label>
              <select
                className="input-field"
                value={contactChannel}
                onChange={(e) =>
                  setContactChannel(e.target.value as typeof contactChannel)
                }
              >
                {CHANNEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-[2]">
              <label className="mb-1.5 block text-sm font-semibold text-soft">
                Your handle
              </label>
              <input
                className="input-field"
                value={socialHandle}
                maxLength={80}
                placeholder="@yourhandle"
                onChange={(e) => setSocialHandle(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-soft">
              Quantity <span className="font-normal text-soft">(up to 3 of the same item)</span>
            </label>
            <input
              type="number"
              min={1}
              max={3}
              className="input-field"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.min(3, Math.max(1, Number(e.target.value) || 1)))
              }
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-soft">
              <input
                type="checkbox"
                checked={wantsWindow}
                disabled={!detectedTz}
                onChange={(e) => setWantsWindow(e.target.checked)}
              />
              Request a delivery time (optional)
            </label>
            {wantsWindow && detectedTz && (
              <div className="mt-2">
                <input
                  type="datetime-local"
                  className="input-field"
                  value={windowLocal}
                  onChange={(e) => setWindowLocal(e.target.value)}
                />
                <p className="mt-1 text-xs text-soft">Times shown in {detectedTz}.</p>
              </div>
            )}
          </div>

          <p className="rounded-input bg-bg p-3 text-xs text-soft">
            Spread stores your name, social handle, and request details so
            the creator can respond. Please share your delivery address and
            payment information directly with the creator.
          </p>

          {submitError && <p className="text-xs text-hot">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Request this Spread"}
          </button>
        </form>
      ) : (
        <>
          <div className="rounded-input bg-tomato-tint p-3 text-sm text-hot">
            Request saved to {spread.ownerDisplayName}&rsquo;s board (ref{" "}
            {confirmation.reference}). It isn&rsquo;t accepted until they
            confirm with you.
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-soft">
              Delivery address
            </label>
            <input
              className="input-field"
              value={address}
              maxLength={200}
              placeholder="123 Main St, Apt 4"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-soft">
              Delivery instructions (optional)
            </label>
            <input
              className="input-field"
              value={instructions}
              maxLength={200}
              placeholder="Gate code, leave at door, text on arrival…"
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!address}
              className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied
                ? "Copied. Open the conversation and paste your request."
                : "Copy request summary"}
            </button>

            {spread.ownerSocialLink ? (
              <a
                href={spread.ownerSocialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                Open chat with @{spread.ownerHandle}
              </a>
            ) : (
              <p className="text-sm text-soft">
                This creator hasn&rsquo;t added a way to reach them yet.
              </p>
            )}
          </div>

          <p className="text-xs text-soft">
            Paste your copied summary once the conversation is open.
          </p>

          {(spread.ownerCashappHandle || spread.ownerVenmoHandle) && (
            <div className="card p-4">
              <p className="font-display text-sm font-bold text-hot">
                Pay only after {spread.ownerDisplayName} confirms
              </p>
              <p className="mt-1 text-xs text-soft">
                These buttons are pre-filled with the listed price. If the
                confirmed total is different, change the amount before you
                send it.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {spread.ownerCashappHandle && (
                  <a
                    href={cashAppLink(spread.ownerCashappHandle, spread.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full"
                  >
                    Pay with Cash App (after confirmation)
                  </a>
                )}
                {spread.ownerVenmoHandle && (
                  <a
                    href={venmoLink(spread.ownerVenmoHandle, spread.price, spread.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full"
                  >
                    Pay with Venmo (after confirmation)
                  </a>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-soft">
            Copy your summary above, open the chat to send it to{" "}
            {spread.ownerDisplayName}, then pay once they&rsquo;ve confirmed
            the total and delivery address.
          </p>
        </>
      )}
    </div>
  );
}
