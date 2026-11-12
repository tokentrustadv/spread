"use client";

import { useDemoResult } from "./DemoResultContext";

const DEFAULT_EXAMPLE = {
  title: "The Orange Chicken Favorite",
};

export function SampleRequestCard() {
  const { demoResult } = useDemoResult();
  const title = demoResult?.title || DEFAULT_EXAMPLE.title;

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
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled
          className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-90"
        >
          Accept
        </button>
        <button
          type="button"
          disabled
          className="btn-secondary flex-1 disabled:cursor-not-allowed disabled:opacity-90"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
