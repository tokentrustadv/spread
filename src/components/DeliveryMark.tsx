// A small flat line-art delivery bike, carrying the Spread mark as its
// front wheel's hub — literally the brand mark woven into the delivery
// vehicle, echoing "this is delivered by a person, not a gig app."
// Matches LogoMark's stroke-based, single-color style (see Logo.tsx).
export function DeliveryMark({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="26" cy="72" r="15" stroke="currentColor" strokeWidth="5" />
      <path
        d="M40 38 L50 72 M50 72 L26 72 M50 72 L76 34 M40 38 L76 34"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M33 36 L47 36"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M76 28 L85 25"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="76" cy="72" r="15" stroke="currentColor" strokeWidth="5" />
      <path
        d="M65 61 A15 15 0 0 1 83 55"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <g stroke="#D8CDBF" strokeWidth="1.4" strokeLinecap="round">
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 76 + 10 * Math.cos(rad);
          const y1 = 72 + 10 * Math.sin(rad);
          const x2 = 76 + 13 * Math.cos(rad);
          const y2 = 72 + 13 * Math.sin(rad);
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <circle cx="76" cy="72" r="10" className="fill-hot" stroke="#FFF7ED" strokeWidth="1.5" />
      <svg x="68" y="64" width="16" height="16" viewBox="0 0 100 100">
        <path
          d="M71 26C64 16 48 13 36 19C24 25 20 38 29 45C38 52 55 48 64 55C73 62 69 75 57 81C45 87 29 84 22 74"
          stroke="white"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </svg>
  );
}
