import { request } from "./client.ts";

/**
 * GitHub's own star history (GET /repos/{owner}/{repo}/stargazers/history,
 * September 2026): stars grouped by week, newest first, with a per-day
 * breakdown starting on Sunday. The first page spans 30 weeks.
 *
 * It counts stars *given*, so it cannot see stars removed. Measured against
 * this catalog on 2026-10-28, our net 30-day change was a median 0.89 of it,
 * and eight repositories that were losing stars showed growth there. That is
 * why it is not a trend source here, only an independent upper bound to check
 * our own measurements against (see the audit).
 */
export interface StarWeek {
  /** Unix seconds at the start of the week. */
  week: number;
  total: number;
  days: number[];
}

export async function fetchStarHistory(repo: string): Promise<StarWeek[]> {
  return (await request<StarWeek[]>(`/repos/${repo}/stargazers/history`)).data;
}

/**
 * Stars GitHub records as given from `from` through `to`, both days included.
 *
 * Inclusive on purpose: our measurements are taken partway through a day, so
 * the net change between two of them can contain stars from either end day.
 * GitHub also notes its week and day boundaries are not guaranteed to align
 * with UTC, which the audit absorbs with a small tolerance.
 */
export function starsGivenBetween(weeks: StarWeek[], from: string, to: string): number {
  let sum = 0;
  for (const w of weeks) {
    w.days.forEach((count, i) => {
      const day = new Date(w.week * 1000 + i * 86_400_000).toISOString().slice(0, 10);
      if (day >= from && day <= to) sum += count;
    });
  }
  return sum;
}
