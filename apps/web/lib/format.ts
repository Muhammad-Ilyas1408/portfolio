const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function parts(date: string) {
  const [year, month, day] = date.split("-");
  return { year, month: months[Number(month) - 1], day: day && Number(day) };
}

/** "2025-01" → "Jan 2025". */
export function formatYearMonth(date: string) {
  const { year, month } = parts(date);
  return `${month} ${year}`;
}

/** "2025-01", "2025-04" → "Jan 2025 – Apr 2025". */
export function formatMonthRange(start: string, end?: string) {
  if (!end || end === start) return formatYearMonth(start);
  return `${formatYearMonth(start)} – ${formatYearMonth(end)}`;
}

/** Years only: "2023-09", "2024-05" → "2023–24"; same year → "2023". */
export function formatYearSpan(start: string, end?: string) {
  const from = start.slice(0, 4);
  const to = end?.slice(0, 4);
  if (!to || to === from) return from;
  return from.slice(0, 2) === to.slice(0, 2)
    ? `${from}–${to.slice(2)}`
    : `${from}–${to}`;
}

function formatEventDate(date: string, withYear = true) {
  const { year, month, day } = parts(date);
  const text = day ? `${day} ${month}` : month;
  return withYear ? `${text} ${year}` : text;
}

/**
 * "YYYY-MM-DD" or "YYYY-MM", optionally a range.
 * "2026-10-22" → "22 Oct 2026"; "2026-07-04", "2026-09-20" → "4 Jul – 20 Sep 2026".
 */
export function formatEventRange(start: string, end?: string) {
  if (!end || end === start) return formatEventDate(start);
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  return `${formatEventDate(start, !sameYear)} – ${formatEventDate(end)}`;
}

/** Whole months from start to end, inclusive: "2024-01", "2024-08" → 8. */
export function monthsInRange(start: string, end: string) {
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);
  return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
}

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

/**
 * The length of a role, from its "YYYY-MM" dates, months counted inclusive:
 * "2025-01", "2025-04" → "4 months"; "2025-10", "2026-09" → "1 year";
 * "2024-12", "2026-02" → "1 year 3 months". No end (ongoing) → undefined,
 * because a static build can't know today's month.
 */
export function formatDuration(start: string, end?: string) {
  if (!end) return undefined;
  const total = monthsInRange(start, end);
  if (total < 1) return undefined;
  const years = Math.floor(total / 12);
  const months = total % 12;
  if (years === 0) return plural(months, "month");
  return months === 0
    ? plural(years, "year")
    : `${plural(years, "year")} ${plural(months, "month")}`;
}
