/**
 * Both formatters below take a date-only string ("YYYY-MM-DD") and parse
 * it at local midnight. They also accept a full ISO datetime string
 * (e.g. `someDate.toISOString()`, which includes a "T...Z" already) by
 * taking just its date portion first — callers reach for `.toISOString()`
 * on a Prisma `Date` often enough that silently mishandling it produced
 * an "Invalid Date" bug more than once; this makes that mistake inert.
 */
function toDateOnly(iso: string): string {
  return iso.slice(0, 10);
}

export function formatLongDate(iso: string): string {
  const d = new Date(toDateOnly(iso) + "T00:00:00");
  return d
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export function formatShortDate(iso: string): string {
  const d = new Date(toDateOnly(iso) + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Common IANA timezones for the Studio's scheduling UI. */
export const COMMON_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "UTC",
  "Europe/London",
  "Europe/Paris",
  "Africa/Lagos",
  "Asia/Jerusalem",
  "Asia/Manila",
  "Australia/Sydney",
];

/**
 * Today's date ("YYYY-MM-DD") as it currently reads in a given IANA
 * timezone — used for the homepage's "today" label, which must advance
 * with the calendar even on days nobody has published a new Word yet,
 * rather than freezing on whichever devotional happens to be featured.
 */
export function getTodayInTimezone(timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${lookup.year}-${lookup.month}-${lookup.day}`;
}

/**
 * Converts a wall-clock date/time in a specific IANA timezone to the
 * correct UTC instant — scheduling must never assume the admin's own
 * device timezone (brief section 7), so the chosen zone is applied
 * explicitly rather than relying on the browser's local interpretation.
 */
export function zonedTimeToUtc(dateStr: string, timeStr: string, timeZone: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const asIfUtc = new Date(Date.UTC(year, month - 1, day, hour, minute));

  // What does that same instant display as, in the target zone?
  const partsInZone = new Date(asIfUtc.toLocaleString("en-US", { timeZone }));
  const offsetMs = asIfUtc.getTime() - partsInZone.getTime();

  return new Date(asIfUtc.getTime() + offsetMs);
}
