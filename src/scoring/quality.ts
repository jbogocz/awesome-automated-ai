import { clamp } from "./utils.js";

export interface QualityInput {
  stars: number;
  starsPrevious: number | null;
  trend7d?: number | null;
  trend30d?: number | null;
  pushedAt: string;
  license: string | null;
  archived: boolean;
}

const PERMISSIVE_LICENSES = new Set([
  "Apache-2.0",
  "MIT",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "BSD-3-Clause-Clear",
  "ISC",
  "MPL-2.0",
  "Unlicense",
  "0BSD",
  "CC0-1.0",
  "Zlib",
  "BSL-1.0",
]);

const COPYLEFT_LICENSES = new Set(["GPL-2.0", "GPL-3.0", "AGPL-3.0", "LGPL-2.1", "LGPL-3.0", "EPL-2.0", "CDDL-1.0"]);

export function computeQualityScore(input: QualityInput): number {
  if (input.archived) return 0;

  const starsScore = computeStarsScore(input.stars);
  const freshnessScore = computeFreshnessScore(input.pushedAt);
  const licenseScore = computeLicenseScore(input.license);

  // Real momentum signal if snapshots allow it, otherwise impute neutrally from the
  // other dimensions. Using an arbitrary 50/100 baseline systematically penalised
  // any entry added recently to the list.
  const momentumRaw = computeMomentumScore(input);
  const momentumScore = momentumRaw ?? (starsScore + freshnessScore + licenseScore) / 3;

  const raw = starsScore * 0.5 + momentumScore * 0.25 + freshnessScore * 0.15 + licenseScore * 0.1;
  return clamp(Math.round(raw), 0, 100);
}

// log10 saturating at 1M stars so the top end stays differentiated.
// 1k -> 50, 100k -> 83, 1M -> 100. Previously /5 capped at 100k and
// made every mega-repo tie on the stars dimension.
function computeStarsScore(stars: number): number {
  return clamp((Math.log10(Math.max(stars, 1)) / 6) * 100, 0, 100);
}

// Continuous exponential decay so a 1-day-old push outranks a 29-day-old one.
// 0d=100, 30d=85, 90d=61, 180d=37, 365d=13.
function computeFreshnessScore(pushedAt: string): number {
  if (!pushedAt) return 0;
  try {
    const days = (Date.now() - new Date(pushedAt).getTime()) / (24 * 60 * 60 * 1000);
    if (days < 0) return 100;
    return clamp(100 * Math.exp(-days / 180), 0, 100);
  } catch {
    return 0;
  }
}

// Tiered so NOASSERTION (license file exists but not SPDX-parseable) isn't
// scored identically to MIT, and proprietary source-available repos get a
// non-zero floor rather than being treated as if they had no license file.
function computeLicenseScore(license: string | null): number {
  if (!license) return 20;
  if (PERMISSIVE_LICENSES.has(license)) return 100;
  if (COPYLEFT_LICENSES.has(license)) return 90;
  if (license === "NOASSERTION") return 60;
  return 70;
}

// Weekly star growth mapped to 0-100. Prefer the 30d window (smoother) and
// fall back to 7d then to the legacy "most recent prior snapshot" signal.
// Returns null when no signal is available so the caller can impute.
function computeMomentumScore(input: QualityInput): number | null {
  let weeklyPct: number | null = null;
  if (input.trend30d != null && input.stars > 0) {
    weeklyPct = (((input.trend30d / 30) * 7) / input.stars) * 100;
  } else if (input.trend7d != null && input.stars > 0) {
    weeklyPct = (input.trend7d / input.stars) * 100;
  } else if (input.starsPrevious != null && input.starsPrevious > 0) {
    weeklyPct = ((input.stars - input.starsPrevious) / input.starsPrevious) * 100;
  }
  if (weeklyPct === null) return null;
  // 0% weekly -> 50, 1% -> 80, 1.67% -> 100; negative growth penalised symmetrically.
  return clamp(50 + weeklyPct * 30, 0, 100);
}
