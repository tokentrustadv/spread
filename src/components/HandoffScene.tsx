// A simple, close-cropped illustration of the handoff moment — the
// insulated bag, held out by the creator's hand — for the small "You
// control the flow" band. Deliberately simple (not a full scene) since
// the box is small and wide; the surrounding copy carries the rest of
// the story.
import { LogoMark } from "./Logo";

export function HandoffScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 330 220"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="handoff-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3DDC2" />
          <stop offset="100%" stopColor="#E9CDAE" />
        </linearGradient>
      </defs>
      <rect width="330" height="220" fill="url(#handoff-bg)" />

      <ellipse cx="175" cy="172" rx="86" ry="14" fill="#26231F" opacity="0.08" />

      {/* creator's arm and hand, reaching in from the left, holding the bag up */}
      <path
        d="M-10 190 Q50 184 92 150 L112 128 Q120 120 128 128 Q136 136 128 144 L108 166"
        fill="#C4472D"
        stroke="#26231F"
        strokeWidth="1.6"
      />
      <circle cx="113" cy="131" r="8" fill="#F3DDC2" stroke="#26231F" strokeWidth="1.3" />

      {/* the insulated bag, brand clearly visible */}
      <g transform="translate(118, 70)">
        <path
          d="M14 6 Q14 -10 28 -10 L50 -10 Q64 -10 64 6"
          stroke="#26231F"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        <rect
          x="4"
          y="6"
          width="74"
          height="54"
          rx="9"
          fill="#C4472D"
          stroke="#26231F"
          strokeWidth="2"
        />
        <rect x="4" y="6" width="74" height="16" rx="9" fill="#FFFFFF" opacity="0.12" />
        <g transform="translate(21, 15)">
          <LogoMark size={36} />
        </g>
      </g>
    </svg>
  );
}
