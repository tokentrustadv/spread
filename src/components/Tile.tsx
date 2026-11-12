import { STYLE_TOKENS, type SpreadStyle } from "@/lib/spreadStyle";
import { SPREAD_STYLE_ICONS } from "./SpreadStyleIcons";

export function Tile({
  style,
  size = "md",
}: {
  style: SpreadStyle;
  size?: "sm" | "md" | "lg";
}) {
  const tokens = STYLE_TOKENS[style];
  const Icon = SPREAD_STYLE_ICONS[style];
  const sizeClasses = {
    sm: "h-10 w-10 rounded-[10px]",
    md: "h-14 w-14 rounded-[14px]",
    lg: "h-20 w-20 rounded-[18px]",
  }[size];
  const iconSize = { sm: 20, md: 28, lg: 42 }[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center ${sizeClasses}`}
      style={{ backgroundColor: tokens.tint, color: tokens.text }}
    >
      <Icon size={iconSize} />
    </div>
  );
}
