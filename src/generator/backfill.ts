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
