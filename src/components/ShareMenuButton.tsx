"use client";

import { useState } from "react";

export function ShareMenuButton({
  displayName,
  menuUrl,
}: {
  displayName: string;
  menuUrl: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied">("idle");

  const caption = `I made my own board on Spread — delivered by me. Check out what I'm offering and message me to request yours: ${menuUrl}`;

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${displayName}'s board on Spread`,
          text: caption,
          url: menuUrl,
        });
        return;
      } catch {
        // user cancelled or share failed; fall through to copy
      }
    }
    await navigator.clipboard.writeText(caption);
    setStatus("copied");
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <button type="button" onClick={handleShare} className="btn-primary w-full">
      {status === "copied" ? "Caption copied!" : "Share my board"}
    </button>
  );
}
