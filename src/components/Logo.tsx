// The Spread mark: the "S" set into a wheel's hub, spokes and all — the
// brand identity literally built from the thing creators deliver with.
// Fixed brand colors (tire/hub/mark), not currentColor — a finished mark
// isn't meant to be re-tinted per call site the way a plain icon is.
const SPOKE_ANGLES = [0, 60, 120, 180, 240, 300];

export function LogoMark({
  size = 24,
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
      aria-hidden="true"
      className={className}
    >
      <circle cx="50" cy="50" r="42" fill="none" stroke="#26231F" strokeWidth="11" />
      <path
        d="M20 32 A42 42 0 0 1 68 11"
        fill="none"
        stroke="#FFF7ED"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <g stroke="#D8CDBF" strokeWidth="3" strokeLinecap="round">
        {SPOKE_ANGLES.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 50 + 28 * Math.cos(rad);
          const y1 = 50 + 28 * Math.sin(rad);
          const x2 = 50 + 37 * Math.cos(rad);
          const y2 = 50 + 37 * Math.sin(rad);
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <circle cx="50" cy="50" r="27" fill="#C4472D" stroke="#FFF7ED" strokeWidth="3" />
      <svg x="26" y="26" width="48" height="48" viewBox="0 0 100 100">
        <path
          d="M71 26C64 16 48 13 36 19C24 25 20 38 29 45C38 52 55 48 64 55C73 62 69 75 57 81C45 87 29 84 22 74"
          stroke="white"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </svg>
  );
}

export function LogoTile({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-[28%] bg-surface ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <LogoMark size={size * 0.82} />
    </div>
  );
}

export function Logo({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-display font-extrabold text-hot ${className ?? ""}`}
      style={{ fontSize: size }}
    >
      <LogoMark size={size} />
      Spread
    </span>
  );
}
