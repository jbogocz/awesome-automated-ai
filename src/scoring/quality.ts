import { clamp } from "./utils.js";

export interface QualityInput {
  stars: number;
  starsPrevious: number | null;
  pushedAt: string;
  license: string | null;
  archived: boolean;
}

export function computeQualityScore(input: QualityInput): number {
  const starsScore = Math.min((Math.log10(Math.max(input.stars, 1)) / 5) * 100, 100);

  let trendScore: number;
  if (input.starsPrevious === null) {
    trendScore = 50;
  } else {
    const delta = input.stars - input.starsPrevious;
    const sign = delta >= 0 ? 1 : -1;
    trendScore = 50 + sign * Math.min((Math.log10(1 + Math.abs(delta)) / 3) * 50, 50);
  }

  const freshnessScore = scoreFreshness(input.pushedAt);
  const licenseScore = input.license ? 100 : 0;
  const archivedScore = input.archived ? 0 : 100;

  const raw = starsScore * 0.4 + trendScore * 0.25 + freshnessScore * 0.15 + licenseScore * 0.1 + archivedScore * 0.1;

  return clamp(Math.round(raw), 0, 100);
}

function scoreFreshness(pushedAt: string): number {
  if (!pushedAt) return 0;
  try {
    const days = (Date.now() - new Date(pushedAt).getTime()) / (24 * 60 * 60 * 1000);
    if (days < 30) return 100;
    if (days < 90) return 80;
    if (days < 180) return 60;
    if (days < 365) return 30;
    return 0;
  } catch {
    return 0;
  }
}
