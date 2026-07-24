export function cashAppLink(handle: string, amount?: number | null): string {
  const base = `https://cash.app/$${handle}`;
  return amount != null ? `${base}/${amount.toFixed(2)}` : base;
}

export function venmoLink(
  handle: string,
  amount?: number | null,
  note?: string
): string {
  const base = `https://venmo.com/${handle}`;
  if (amount == null) return base;
  const params = new URLSearchParams({ txn: "pay", amount: amount.toFixed(2) });
  if (note) params.set("note", note);
  return `${base}?${params.toString()}`;
}
