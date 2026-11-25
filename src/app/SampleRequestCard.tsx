"use client";

import { useEffect, useState } from "react";
import { useDemoResult } from "./DemoResultContext";

const DEFAULT_EXAMPLE = {
  title: "The Orange Chicken Favorite",
};

type SampleStatus = "new" | "accepted" | "declined";

export function SampleRequestCard() {
  const { demoResult } = useDemoResult();
  const title = demoResult?.title || DEFAULT_EXAMPLE.title;
  const [status, setStatus] = useState<SampleStatus>("new");

  // A fresh demo build should present as a fresh, un-actioned sample again.
  useEffect(() => {
    setStatus("new");
  }, [demoResult]);

  return (
    <div className="card mt-6 p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-sm font-bold">
            {title}
            {demoResult && demoResult.quantity > 1 && (
              <span className="text-soft"> &times; {demoResult.quantity}</span>
            )}
          </p>
          <p className="text-xs text-soft">
            Sample request &mdash; not a real customer
            {!demoResult && " (build one above to see it here)"}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-tomato-tint px-2.5 py-1 text-[11px] font-semibold text-hot">
          New
        </span>
      </div>
      <div className="mt-3 rounded-input bg-bg p-3 text-sm">
        <p className="font-semibold">Jordan</p>
        <p className="text-soft">Instagram: @jordan_example</p>
      </div>

      {status === "new" ? (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setStatus("accepted")}
            className="btn-primary flex-1"
          >
            Accept (sample)
          </button>
          <button
            type="button"
            onClick={() => setStatus("declined")}
            className="btn-secondary flex-1"
          >
            Decline (sample)
          </button>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between gap-2 rounded-input bg-bg p-3">
          <p className="text-sm font-semibold text-soft">
            {status === "accepted"
              ? "✓ Accepted — sample only, nothing sent"
              : "Declined — sample only, nothing sent"}
          </p>
          <button
            type="button"
            onClick={() => setStatus("new")}
            className="shrink-0 text-xs font-semibold text-hot hover:underline"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
