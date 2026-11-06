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
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M71 26C64 16 48 13 36 19C24 25 20 38 29 45C38 52 55 48 64 55C73 62 69 75 57 81C45 87 29 84 22 74"
        stroke="currentColor"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
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
      className={`flex shrink-0 items-center justify-center rounded-[28%] bg-hot ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <LogoMark size={size * 0.6} className="text-bg" />
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
