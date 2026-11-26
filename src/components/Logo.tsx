// The Spread mark: one bold, continuous S-shaped path suggesting a
// creator choosing their own route -- not enclosed in a circle, no
// gradients. Terracotta by default; pass `color` to override for
// contexts on a matching-color surface (the delivery bag, a colored
// favicon tile).
export function LogoMark({
  size = 24,
  className,
  color = "#C4472D",
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M50,10 A40,40 0 0,1 50,90 A22,22 0 0,1 50,46 A18,18 0 0,0 50,10 Z"
        fill={color}
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
      <LogoMark size={size * 0.56} color="#FFF7ED" />
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
      className={`inline-flex items-center gap-1.5 font-wordmark font-bold ${className ?? ""}`}
      style={{ fontSize: size }}
    >
      <LogoMark size={size} />
      Spread
    </span>
  );
}
