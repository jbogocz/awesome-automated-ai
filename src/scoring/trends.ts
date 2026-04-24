/**
 * Compute trend deltas from historical star snapshots.
 *
 * Pure function: no I/O, no side effects.
 */
export interface TrendInput {
  currentStars: number;
  stars7dAgo: number | null;
  stars30dAgo: number | null;
  starsPrevious: number | null;
}

export interface TrendResult {
  trend: number | null;
  trend7d: number | null;
  trend30d: number | null;
}

export function computeTrends(input: TrendInput): TrendResult {
  const trend7d = input.stars7dAgo !== null ? input.currentStars - input.stars7dAgo : null;
  const trend30d = input.stars30dAgo !== null ? input.currentStars - input.stars30dAgo : null;
  const trend = trend30d ?? (input.starsPrevious !== null ? input.currentStars - input.starsPrevious : null);

  return { trend, trend7d, trend30d };
}
