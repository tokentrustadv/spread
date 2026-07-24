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
    `Order: ${spread.title}`,
    spread.price != null ? `Price: $${spread.price.toFixed(2)}` : null,
    address ? `Deliver to: ${address}` : null,
    instructions ? `Instructions: ${instructions}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  async function handleCopy() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
          <p className="mt-1 font-display text-xl font-bold text-hot">
            ${spread.price.toFixed(2)}
          </p>
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

      <button
        type="button"
        onClick={handleCopy}
        disabled={!address}
        className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {copied ? "Copied!" : "Copy order details"}
      </button>

      {(spread.ownerCashappHandle || spread.ownerVenmoHandle) && (
        <div className="card p-4">
          <p className="font-display text-sm font-bold text-hot">
            Pay {spread.ownerDisplayName}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {spread.ownerCashappHandle && (
              <a
                href={cashAppLink(spread.ownerCashappHandle, spread.price)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full"
              >
                Pay with Cash App
              </a>
            )}
            {spread.ownerVenmoHandle && (
              <a
                href={venmoLink(spread.ownerVenmoHandle, spread.price, spread.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full"
              >
                Pay with Venmo
              </a>
            )}
          </div>
        </div>
      )}

      {spread.ownerSocialLink ? (
        <a
          href={spread.ownerSocialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full"
        >
          Message @{spread.ownerHandle} to order
        </a>
      ) : (
        <p className="text-sm text-soft">
          This creator hasn&rsquo;t added an order link yet.
        </p>
      )}

      <p className="text-xs text-soft">
        Copy your order details above, then paste them into your message —
        that&rsquo;s how you&rsquo;ll confirm and arrange delivery with{" "}
        {spread.ownerDisplayName}.
      </p>
    </div>
  );
}
