// Vercel's edge network sets x-forwarded-for from the real connecting
// client and overwrites anything the client itself sent when it reaches
// Vercel directly — a trustworthy source for a Vercel-hosted app, but only
// there (not behind an arbitrary/untrusted proxy). The first entry in the
// list is the original client.
export function getTrustedClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) return null;
  const first = forwarded.split(",")[0]?.trim();
  return first || null;
}
