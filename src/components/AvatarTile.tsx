// A plain letter avatar for a creator's identity (profile header, example
// page) — distinct from Tile, which now represents an item's food style.
export function AvatarTile({
  letter,
  size = "md",
}: {
  letter: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-10 w-10 rounded-[10px] text-lg",
    md: "h-14 w-14 rounded-[14px] text-2xl",
    lg: "h-20 w-20 rounded-[18px] text-4xl",
  }[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-[#F6DDD0] font-display font-bold text-[#C4472D] ${sizeClasses}`}
    >
      {letter.slice(0, 1).toUpperCase()}
    </div>
  );
}
