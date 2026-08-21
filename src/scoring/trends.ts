/**
 * Compute trend deltas from historical star snapshots.
 *
 * Pure function: no I/O, no side effects.
 */
export interface SnapshotPoint {
  stars: number;
  /** The snapshot's real date (YYYY-MM-DD), used to report the true window. */
  date: string;
}

export interface TrendInput {
  currentStars: number;
  stars7dAgo: SnapshotPoint | null;
  stars30dAgo: SnapshotPoint | null;
  /**
   * Newest earlier measurement, of unknown age. Feeds the quality score's
   * momentum term only — never the published `trend`, which must mean one
   * comparable thing across every entry.
   */
  starsPrevious: number | null;
  /** Reference date for window arithmetic; defaults to now. */
  today?: Date;
}

export interface TrendResult {
  /**
   * The published headline figure: the 30-day delta, or null when no
   * measurement sits near t-30.
   *
   * This used to fall back to `currentStars - starsPrevious`, a delta over
   * whatever gap happened to exist. A newly listed entry therefore rendered a
   * four-day jump in a column labelled "stars gained in the last 30 days",
   * sorted against real 30-day figures and, if it cleared 200, appeared in the
   * Trending lens. Reporting nothing until the window exists is the only
   * version of this number that is true for every row.
   */
  trend: number | null;
  trend7d: number | null;
  trend30d: number | null;
  /**
   * Days actually spanned by trend30d / trend7d. Snapshots are weekly, so the
   * point nearest t-30 is usually t-28 — reporting these as "30d" and "7d"
   * would overstate both windows. Null when the delta has no known window
   * (the starsPrevious fallback, whose snapshot may be any age).
   */
  trend30dDays: number | null;
  trend7dDays: number | null;
}

const DAY_MS = 86_400_000;

function spanDays(point: SnapshotPoint, today: Date): number {
  const then = new Date(`${point.date}T00:00:00Z`).getTime();
  return Math.max(1, Math.round((today.getTime() - then) / DAY_MS));
}

export function computeTrends(input: TrendInput): TrendResult {
  const today = input.today ?? new Date();
  const trend7d = input.stars7dAgo ? input.currentStars - input.stars7dAgo.stars : null;
  const trend30d = input.stars30dAgo ? input.currentStars - input.stars30dAgo.stars : null;
  const trend = trend30d;

  return {
    trend,
    trend7d,
    trend30d,
    trend30dDays: input.stars30dAgo ? spanDays(input.stars30dAgo, today) : null,
    trend7dDays: input.stars7dAgo ? spanDays(input.stars7dAgo, today) : null,
  };
}
