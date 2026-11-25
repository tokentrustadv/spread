"use client";

import { useState } from "react";
import { Tile } from "./Tile";
import { Node } from "./Node";
import { LogoMark } from "./Logo";
import type { SpreadStyle } from "@/lib/spreadStyle";

export function ShareSheet({
  title,
  style,
  restaurantA,
  restaurantB,
  url,
}: {
  title: string;
  style: SpreadStyle;
  restaurantA: string;
  restaurantB?: string | null;
  url: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const homeUrl = (() => {
    try {
      return new URL(url).origin;
    } catch {
      return url;
    }
  })();

  const intro =
    "Hungry? A Spread Creator can deliver one of their favorite items to your door — no pictures, no tipping, just personal convenience in your area. Spread makes delivery personal, and each creator offers an item they love.";

  const caption = `${intro}\n\n${title} — request yours here: ${url}\n\nHave a meal you love? Create your own Spread and deliver it today: ${homeUrl}`;

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: caption, url });
        return;
      } catch {
        // user cancelled; fall through to sheet
      }
    }
    setOpen(true);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(caption);
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
                style={{ background: "linear-gradient(135deg,#C4472D,#D9836D)" }}
              />
              <LogoMark size={18} className="text-hot" />
              <p className="mt-1.5 font-display text-sm font-semibold text-hot">
                Spread
              </p>
              <h3 className="mt-2 font-display text-2xl font-extrabold">{title}</h3>
              <div className="mt-3 flex items-center gap-2 text-sm text-soft">
                <Tile style={style} size="sm" />
                <span className="truncate">{restaurantA}</span>
                {restaurantB && (
                  <>
                    <Node size="sm" />
                    <Tile style={style} size="sm" />
                    <span className="truncate">{restaurantB}</span>
                  </>
                )}
              </div>
              <p className="mt-4 text-sm text-soft">{intro}</p>
              <p className="mt-2 text-xs text-soft">
                Have a meal you love? Create your own Spread and deliver it
                today.
              </p>
            </div>

            <button onClick={handleCopy} className="btn-secondary mt-4 w-full">
              {copied ? "Caption copied!" : "Copy caption"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
