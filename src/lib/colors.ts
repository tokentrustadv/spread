export const SPREAD_COLORS = ["tomato", "amber", "herb", "plum", "teal"] as const;

export type SpreadColor = (typeof SPREAD_COLORS)[number];

export const COLOR_TOKENS: Record<SpreadColor, { text: string; tint: string }> = {
  tomato: { text: "#FF4A2E", tint: "#FFEBE5" },
  amber: { text: "#E07E12", tint: "#FFF1DC" },
  herb: { text: "#3E8F52", tint: "#E5F3E8" },
  plum: { text: "#9A4467", tint: "#F7E9EF" },
  teal: { text: "#1F8C86", tint: "#DFF2F0" },
};

export function isSpreadColor(value: string): value is SpreadColor {
  return (SPREAD_COLORS as readonly string[]).includes(value);
}
