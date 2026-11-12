// What a Spread's one item is — picked as a simple food-style icon instead
// of an arbitrary color, so a creator's tile actually looks like what
// they're offering (a burger, a taco, a bowl...).
export const SPREAD_STYLES = [
  "burger",
  "hotdog",
  "sandwich",
  "taco",
  "pizza",
  "chicken",
  "fries",
  "noodles",
  "bowl",
  "dessert",
] as const;

export type SpreadStyle = (typeof SPREAD_STYLES)[number];

export const STYLE_TOKENS: Record<SpreadStyle, { text: string; tint: string }> = {
  burger: { text: "#C4472D", tint: "#F6DDD0" },
  chicken: { text: "#C4472D", tint: "#F6DDD0" },
  hotdog: { text: "#E07E12", tint: "#FFF1DC" },
  fries: { text: "#E07E12", tint: "#FFF1DC" },
  sandwich: { text: "#42634B", tint: "#E8E5DA" },
  noodles: { text: "#42634B", tint: "#E8E5DA" },
  taco: { text: "#9A4467", tint: "#F7E9EF" },
  bowl: { text: "#9A4467", tint: "#F7E9EF" },
  pizza: { text: "#1F8C86", tint: "#DFF2F0" },
  dessert: { text: "#1F8C86", tint: "#DFF2F0" },
};

export function isSpreadStyle(value: string): value is SpreadStyle {
  return (SPREAD_STYLES as readonly string[]).includes(value);
}
