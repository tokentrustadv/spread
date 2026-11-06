export function FoodOnlyBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-line2 bg-surface ${
        compact ? "px-2.5 py-1" : "px-3.5 py-2"
      }`}
    >
      <svg
        width={compact ? 14 : 18}
        height={compact ? 14 : 18}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M6 3h10l-1 11a4 4 0 0 1-4 3.6A4 4 0 0 1 7 14L6 3Z"
          stroke="#7A746C"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M6.5 7.5h9" stroke="#7A746C" strokeWidth="1.6" />
        <line
          x1="3.5"
          y1="20.5"
          x2="20.5"
          y2="3.5"
          stroke="#C4472D"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`font-semibold text-soft ${compact ? "text-[11px]" : "text-xs"}`}
      >
        Food only — no drinks, ice cream, or cold items
      </span>
    </div>
  );
}
