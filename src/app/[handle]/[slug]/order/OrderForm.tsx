"use client";

import { useState } from "react";
import Link from "next/link";
import type { SpreadWithOwner } from "@/types/spread";
import { cashAppLink, venmoLink } from "@/lib/payLinks";

export function OrderForm({ spread }: { spread: SpreadWithOwner }) {
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [copied, setCopied] = useState(false);

  const summary = [
    `Request: ${spread.title}`,
    spread.price != null
      ? `Listed price: $${spread.price.toFixed(2)} (subject to confirmation)`
      : null,
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
          {copied ? "Copied. Open the conversation and paste your request." : "Copy request details"}
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
        Paste your copied request once the conversation is open.
      </p>

      <p className="rounded-input bg-tomato-tint p-3 text-xs text-hot">
        Your request isn&rsquo;t confirmed until {spread.ownerDisplayName}{" "}
        replies with a total and delivery time.
      </p>

      {(spread.ownerCashappHandle || spread.ownerVenmoHandle) && (
        <div className="card p-4">
          <p className="font-display text-sm font-bold text-hot">
            Pay only after {spread.ownerDisplayName} confirms
          </p>
          <p className="mt-1 text-xs text-soft">
            These buttons are pre-filled with the listed price. If the
            confirmed total is different, change the amount before you send
            it.
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
        Copy your request details above, open the chat to send them to{" "}
        {spread.ownerDisplayName}, then pay once they&rsquo;ve confirmed the
        total and delivery address.
      </p>
    </div>
  );
}
