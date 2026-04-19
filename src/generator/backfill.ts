import type { StargazerEntry } from "../github/types.js";

export interface DailySnapshot {
  date: string; // YYYY-MM-DD
  stars: number;
}

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function endOfDayUtc(dateKey: string): Date {
  return new Date(`${dateKey}T23:59:59.999Z`);
}

/**
 * Reconstructs historical star counts for each of the 30 days ending yesterday (UTC).
 *
 * Given the current star count and a list of stargazers within the last 30 days,
 * subtracts stargazers added after the end of each day to infer that day's count.
 *
 * Semantics:
 * - `today` is interpreted via its UTC components (`getUTCFullYear/Month/Date`).
 *   Callers on non-UTC clocks passing `new Date()` may see a window shifted by ±1 day
 *   near local midnight. Pass a UTC-midnight Date if calendar-aligned output is needed.
 * - Output rows cover `today - 30 days` (inclusive) through `today - 1 day` (inclusive).
 * - A stargazer with `starredAt` exactly equal to `endOfDay(D)` is treated as same-day
 *   (strict `>` comparator): counted as present by end of D, not "after" D.
 * - Output is sorted by `date` ascending.
 * - Pure function: does not mutate inputs, performs no I/O.
 */
export function computeDailySnapshots(
  stargazers: StargazerEntry[],
  currentStars: number,
  today: Date,
): DailySnapshot[] {
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const rows: DailySnapshot[] = [];
  const starredDates = stargazers.map((s) => new Date(s.starredAt));

  for (let daysAgo = 30; daysAgo >= 1; daysAgo--) {
    const day = new Date(todayUtc);
    day.setUTCDate(day.getUTCDate() - daysAgo);
    const dateKey = toDateKey(day);
    const end = endOfDayUtc(dateKey);
    const starsAfter = starredDates.reduce((n, s) => (s > end ? n + 1 : n), 0);
    rows.push({ date: dateKey, stars: currentStars - starsAfter });
  }
  return rows;
}
