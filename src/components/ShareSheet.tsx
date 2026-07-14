"use client";

import { useState } from "react";
import { Tile } from "./Tile";
import { Node } from "./Node";
import type { SpreadColor } from "@/lib/colors";

export function ShareSheet({
  title,
  color,
  restaurantA,
  restaurantB,
  url,
}: {
  title: string;
  color: SpreadColor;
  restaurantA: string;
  restaurantB: string;
  url: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: `A meal ${title} swears by.`, url });
        return;
      } catch {
        // user cancelled; fall through to sheet
      }
    }
    setOpen(true);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <button onClick={handleShare} className="btn-primary w-full">
        Share this with people who&rsquo;ll love it.
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[420px] rounded-t-card bg-surface p-6 sm:rounded-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-card bg-bg p-6">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl"
                style={{ background: "linear-gradient(135deg,#FF4A2E,#FF8A3D)" }}
              />
              <p className="font-display text-sm font-semibold text-hot">Spread +</p>
              <h3 className="mt-2 font-display text-2xl font-extrabold">{title}</h3>
              <div className="mt-3 flex items-center gap-2 text-sm text-soft">
                <Tile letter={restaurantA} color={color} size="sm" />
                <Node size="sm" />
                <Tile letter={restaurantB} color={color} size="sm" />
              </div>
              <p className="mt-4 text-sm text-soft">A meal {title} swears by.</p>
            </div>

            <button onClick={handleCopy} className="btn-secondary mt-4 w-full">
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
