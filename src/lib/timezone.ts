// Delivery-window helpers. No new dependency (no date-fns-tz/Temporal) —
// these use the standard Intl-based trick for IANA zone math, which is
// accurate enough for a "roughly this evening" delivery window and not
// safety-critical to the minute around a DST transition.

export function isValidIanaTimeZone(tz: string): boolean {
  try {
    // Throws RangeError for an unrecognized zone name.
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

// Converts a wall-clock local time (as a <input type="datetime-local">
// value, "YYYY-MM-DDTHH:mm", no offset) to the UTC instant it represents
// in `timeZone`. Interprets the string as naive UTC first, then shifts by
// the difference between that and the same instant rendered in the target
// zone.
export function zonedWallClockToUtc(wallClockLocal: string, timeZone: string): Date {
  const naiveUtc = new Date(`${wallClockLocal}:00.000Z`);
  if (Number.isNaN(naiveUtc.getTime())) {
    throw new Error("Invalid date/time.");
  }
  const tzDate = new Date(naiveUtc.toLocaleString("en-US", { timeZone }));
  const offsetMs = naiveUtc.getTime() - tzDate.getTime();
  return new Date(naiveUtc.getTime() + offsetMs);
}
