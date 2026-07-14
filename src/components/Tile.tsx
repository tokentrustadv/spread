import { COLOR_TOKENS, type SpreadColor } from "@/lib/colors";

export function Tile({
  letter,
  color,
  size = "md",
}: {
  letter: string;
  color: SpreadColor;
  size?: "sm" | "md" | "lg";
}) {
  const tokens = COLOR_TOKENS[color];
  const sizeClasses = {
    sm: "h-10 w-10 rounded-[10px] text-lg",
    md: "h-14 w-14 rounded-[14px] text-2xl",
    lg: "h-20 w-20 rounded-[18px] text-4xl",
  }[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center font-display font-bold ${sizeClasses}`}
      style={{ backgroundColor: tokens.tint, color: tokens.text }}
    >
      {letter.slice(0, 1).toUpperCase()}
    </div>
  );
}
