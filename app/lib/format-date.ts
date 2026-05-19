// Canonical date display rules — single source of truth for every date label
// in the UI. `D MMM 'YY` is the default, with `D MMM` and `MMM 'YY` as
// context-specific variants. Apostrophe marks the abbreviated year, day has
// no leading zero, no weekday prefix, no full month names (prose copy excepted).

export type DateInput = Date | string | number;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTH_INDEX: Record<string, number> = MONTHS.reduce((acc, m, i) => {
  acc[m.toLowerCase()] = i;
  return acc;
}, {} as Record<string, number>);

// Long month names map to the same index so prose strings ("October") parse.
const LONG_MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];
LONG_MONTHS.forEach((m, i) => { MONTH_INDEX[m] = i; });

function toDate(input: DateInput): Date | null {
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  if (typeof input === "number") {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  const raw = input.trim();
  if (!raw) return null;

  // ISO-ish (YYYY-MM-DD or full ISO) — let the runtime parse.
  if (/^\d{4}-\d{1,2}(-\d{1,2})?/.test(raw)) {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d;
  }

  // Strip apostrophes so we accept any of `Jun '26`, `Jun' 26`, `Jun 26`.
  const s = raw.replace(/'/g, " ").replace(/\s+/g, " ").trim();

  // "D MMM YY", "D MMM YYYY", "DD MMM YYYY".
  let m = s.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{2,4})$/);
  if (m) {
    const day = parseInt(m[1], 10);
    const mon = MONTH_INDEX[m[2].toLowerCase()];
    let year = parseInt(m[3], 10);
    if (m[3].length === 2) year += 2000;
    if (mon != null) return new Date(year, mon, day);
  }

  // "MMM YYYY", "MMM YY", "October 2026" — month + year only.
  m = s.match(/^([A-Za-z]{3,9})\s+(\d{2,4})$/);
  if (m) {
    const mon = MONTH_INDEX[m[1].toLowerCase()];
    let year = parseInt(m[2], 10);
    if (m[2].length === 2) year += 2000;
    if (mon != null) return new Date(year, mon, 1);
  }

  // "MMM D" / "MMM DD" — month + day, year unknown (rare; fall through).
  return null;
}

function parts(input: DateInput) {
  const d = toDate(input);
  if (!d) return null;
  return {
    day: d.getDate(),
    month: MONTHS[d.getMonth()],
    year: d.getFullYear(),
    yy: String(d.getFullYear()).slice(-2),
  };
}

// `4 Jun '26` — canonical short form for specific calendar dates.
export function formatDateShort(input: DateInput): string {
  const p = parts(input);
  if (!p) return typeof input === "string" ? input : "";
  return `${p.day} ${p.month} '${p.yy}`;
}

// `4 Jun` — year-omitted variant for tight contexts where the year is
// already established by surrounding chrome.
export function formatDateDay(input: DateInput): string {
  const p = parts(input);
  if (!p) return typeof input === "string" ? input : "";
  return `${p.day} ${p.month}`;
}

// `Jun '26` — month-resolution form for timelines, goal end-dates, axes.
export function formatDateMonth(input: DateInput): string {
  const p = parts(input);
  if (!p) return typeof input === "string" ? input : "";
  return `${p.month} '${p.yy}`;
}

// Range formatter:
//   same year   → `4 Jun – 28 Jun '26` (year only on the right)
//   cross-year  → `28 Dec '25 – 4 Jan '26` (full short form on both sides)
export function formatDateRange(start: DateInput, end: DateInput): string {
  const a = parts(start);
  const b = parts(end);
  if (!a || !b) return [formatDateShort(start), formatDateShort(end)].join(" – ");
  if (a.year === b.year) {
    return `${a.day} ${a.month} – ${b.day} ${b.month} '${b.yy}`;
  }
  return `${a.day} ${a.month} '${a.yy} – ${b.day} ${b.month} '${b.yy}`;
}
