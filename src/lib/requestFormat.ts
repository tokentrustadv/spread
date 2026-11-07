export function formatPriceEstimate(
  listedPriceCents: number | null,
  quantity: number
): string {
  if (listedPriceCents == null) {
    return "Price not listed — confirm the total directly.";
  }
  const unit = listedPriceCents / 100;
  const total = (listedPriceCents * quantity) / 100;
  const totalStr = `$${total.toFixed(2)}`;
  return quantity > 1
    ? `$${unit.toFixed(2)} × ${quantity} = ${totalStr} estimated — confirm the final total directly.`
    : `${totalStr} estimated — confirm the final total directly.`;
}

// Always formatted in the zone the customer's input was interpreted in
// (requestedWindowTz), never silently converted to the viewer's own zone —
// that's the whole point of storing it.
export function formatRequestedWindow(
  start: string | null,
  end: string | null,
  tz: string | null
): string {
  if (!start || !tz) return "No time requested — reach out to ask.";

  const startFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const startLabel = `${startFmt.format(new Date(start))} (${tz})`;
  if (!end) return startLabel;

  const endFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
  });
  return `${startFmt.format(new Date(start))}–${endFmt.format(new Date(end))} (${tz})`;
}

export const CONTACT_CHANNEL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  messenger: "Messenger",
  other: "Other",
};

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  accepted: "Accepted",
  completed: "Completed",
  declined: "Declined",
  cancelled: "Cancelled",
  archived: "Archived — outcome not recorded",
};
