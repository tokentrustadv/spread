// A small illustrated scene for the "You control the flow" band — the
// same car from CarMark, now joined by a courier (the creator) carrying
// a bag up to a customer's door, connected by a dashed path echoing the
// SpreadDemo route line. Thin-line, single-tone (currentColor), with
// just the bag's squiggle-S tag in the brand accent color, matching the
// visual language already established by CarMark and RouteIcons.
export function DeliveryScene({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 330 130"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* dashed ground path */}
      <line
        x1="8"
        y1="118"
        x2="322"
        y2="118"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="1 8"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* parked car */}
      <path
        d="M14 108 L14 98 Q14 93 19 92 L30 90 Q36 80 48 80 L66 80 Q74 80 78 86 L83 90 Q94 91 94 98 L94 108"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="14"
        y1="108"
        x2="94"
        y2="108"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="30" cy="108" r="7" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="78" cy="108" r="7" stroke="currentColor" strokeWidth="1.6" />

      {/* courier, mid-stride — a tapered torso silhouette and a bent
          carrying arm read as an actual person rather than a stick
          figure, with small feet to ground the stride */}
      <circle cx="166" cy="66" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M159 75 Q157 82 159 90 Q161 97 159 103 L175 103 Q177 96 175 89 Q173 82 175 75 Q167 72 159 75 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M174 80 Q183 84 187 92"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M160 80 L147 90"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M162 103 L152 120"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M171 103 L183 118"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M147 120 L157 120"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M179 118 L189 118"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* delivery bag, with the brand squiggle as its tag */}
      <rect
        x="183"
        y="90"
        width="22"
        height="20"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M188 90 Q188 82 194 82 Q200 82 200 90"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="194" cy="100" r="5.5" fill="#C4472D" opacity="0.12" />
      <path
        d="M197 96 C 195 94, 192 94, 191 96 C 190 98, 191 100, 193 101 C 195 102, 198 101, 199 103 C 200 105, 198 106, 196 107"
        stroke="#C4472D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* customer's door */}
      <path
        d="M270 118 L270 85 Q270 72 283 72 L297 72 Q310 72 310 85 L310 118"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="258"
        y1="118"
        x2="322"
        y2="118"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="303" cy="96" r="1.6" fill="currentColor" />
    </svg>
  );
}
