"use client";

import { useState } from "react";

export function RequestPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="btn-primary w-full"
      >
        {open ? "Hide preview" : "Request this Spread (preview only)"}
      </button>

      {open && (
        <div className="mt-4 rounded-input border border-line2 bg-surface p-4">
          <p className="text-xs text-soft">
            This is a simulated preview — nothing here sends anything. A
            real request page asks for a delivery address and any
            instructions, lets you copy a clean summary, and sends you to
            the creator&rsquo;s own DM to confirm. Nothing is charged, and
            the request isn&rsquo;t confirmed until the creator replies.
          </p>

          <label className="mb-1.5 mt-4 block text-sm font-semibold text-soft">
            Delivery address
          </label>
          <div className="input-field cursor-not-allowed select-none text-soft">
            123 Example St, Apt 4
          </div>
          <label className="mb-1.5 mt-3 block text-sm font-semibold text-soft">
            Delivery instructions
          </label>
          <div className="input-field cursor-not-allowed select-none text-soft">
            Leave at the door
          </div>

          <div
            aria-disabled="true"
            className="mt-4 w-full cursor-not-allowed rounded-input border border-line2 bg-bg px-5 py-3 text-center font-display text-[15px] font-semibold text-soft"
          >
            Copy request details (disabled in this preview)
          </div>
        </div>
      )}
    </div>
  );
}
