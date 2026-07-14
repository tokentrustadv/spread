export function Node({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-6 w-6 text-sm",
    md: "h-9 w-9 text-lg",
    lg: "h-14 w-14 text-2xl",
  }[size];

  return (
    <div
      className={`plus-node font-display font-bold ${sizeClasses}`}
      aria-hidden="true"
    >
      +
    </div>
  );
}
