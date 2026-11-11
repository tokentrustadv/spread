// The car glyph — a filled, dimensional shape (charcoal body, cream
// window band, cream hubcaps) rather than a thin outline, so it reads
// consistently with the storefront/bag/doorstep in DeliveryScene. Drawn
// in its own local box (x: 0-79, y: 0 roofline to 32 wheel-center) so it
// can be positioned anywhere via a wrapping <g transform="translate(...)">.
export function CarGlyph() {
  return (
    <>
      <path
        d="M0 32 L0 20 Q0 14 6 13 L18 10 Q26 0 38 0 L54 0 Q63 0 68 9 L71 13 Q79 14 79 20 L79 32 Z"
        fill="#26231F"
        stroke="#26231F"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M20 10 Q27 2 38 2 L52 2 Q59 2 64 8 L67 10 Z"
        fill="#E8E5DA"
        opacity="0.9"
      />
      <line
        x1="0"
        y1="32"
        x2="79"
        y2="32"
        stroke="#26231F"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="17" cy="32" r="7.5" fill="#26231F" />
      <circle cx="17" cy="32" r="3" fill="#E8E5DA" />
      <circle cx="63" cy="32" r="7.5" fill="#26231F" />
      <circle cx="63" cy="32" r="3" fill="#E8E5DA" />
    </>
  );
}

// A small, dimensional car illustration — the same glyph used inside
// DeliveryScene, standalone for the homepage's closing flourish.
export function CarMark({
  size = 120,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 0.42}
      viewBox="-6 -4 92 44"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="40" cy="38" rx="36" ry="3.5" fill="#26231F" opacity="0.08" />
      <CarGlyph />
    </svg>
  );
}
