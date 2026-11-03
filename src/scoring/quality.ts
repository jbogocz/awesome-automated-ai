import { MAINTAINED_DAYS } from "../constants.ts";
import { clamp } from "./utils.ts";

export interface QualityInput {
  stars: number;
  starsPrevious: number | null;
  trend7d?: number | null;
  trend30d?: number | null;
  /** Days trend7d / trend30d actually span (src/scoring/trends.ts); nominal 7 / 30 when unknown. */
  trend7dDays?: number | null;
  trend30dDays?: number | null;
  /**
   * Newest life sign — mainline commit, release or tag (src/status.ts).
   * Deliberately NOT pushedAt: that updates on pushes to any branch, so bot
   * and PR-head traffic would make an abandoned repo look fresh.
   */
  lastLifeSign: string | null;
  license: string | null;
  archived: boolean;
  /**
   * Momentum assumed for an entry with no measured growth yet: the median
   * measured momentum across the catalog (see medianMomentum). A newly listed
   * repo is assumed to grow like a typical listed repo until its own
   * snapshots exist.
   */
  peerMomentum: number;
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
  const freshnessScore = computeFreshnessScore(input.lastLifeSign);
  const licenseScore = computeLicenseScore(input.license);

  // Real momentum signal if snapshots allow it, otherwise the catalog median.
  // A fixed 50 (zero growth) penalised every newly listed entry; imputing from
  // the entry's own stars, freshness and license over-rewarded them instead:
  // an active MIT repo imputed ~88 against a measured median of 56, so on
  // 2026-11-03 the 49 repos added that day took first place in 14 categories.
  const momentumScore = computeMomentumScore(input) ?? input.peerMomentum;

  const raw = starsScore * 0.5 + momentumScore * 0.25 + freshnessScore * 0.15 + licenseScore * 0.1;
  return clamp(Math.round(raw), 0, 100);
}

// log10 saturating at 1M stars so the top end stays differentiated:
// 1k -> 50, 100k -> 83, 1M -> 100.
function computeStarsScore(stars: number): number {
  return clamp((Math.log10(Math.max(stars, 1)) / 6) * 100, 0, 100);
}

// Full marks while the entry counts as maintained under the status rule
// (src/status.ts: a life sign within MAINTAINED_DAYS), then exponential decay:
// 180d=100, 270d=61, 365d=22. Decaying from day 0 ranked a mature library that
// commits every few months below any repo pushed yesterday: tsfresh (9.5k
// stars, last commit 120 days earlier) scored under skrub (1.7k) on freshness
// alone, although both are maintained by the list's own definition.
function computeFreshnessScore(lastLifeSign: string | null): number {
  if (!lastLifeSign) return 0;
  const days = (Date.now() - new Date(lastLifeSign).getTime()) / (24 * 60 * 60 * 1000);
  if (Number.isNaN(days)) return 0;
  if (days <= MAINTAINED_DAYS) return 100;
  return clamp(100 * Math.exp(-(days - MAINTAINED_DAYS) / 180), 0, 100);
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
// Deltas are normalised by the window they actually span: weekly snapshots
// put the "30d" anchor at t-28 as often as not, and dividing by a fixed 30
// understated that growth.
export function computeMomentumScore(
  input: Pick<QualityInput, "stars" | "starsPrevious" | "trend7d" | "trend30d" | "trend7dDays" | "trend30dDays">,
): number | null {
  let weeklyPct: number | null = null;
  if (input.trend30d != null && input.stars > 0) {
    weeklyPct = (((input.trend30d / (input.trend30dDays ?? 30)) * 7) / input.stars) * 100;
  } else if (input.trend7d != null && input.stars > 0) {
    weeklyPct = (((input.trend7d / (input.trend7dDays ?? 7)) * 7) / input.stars) * 100;
  } else if (input.starsPrevious != null && input.starsPrevious > 0) {
    weeklyPct = ((input.stars - input.starsPrevious) / input.starsPrevious) * 100;
  }
  if (weeklyPct === null) return null;
  // 0% weekly -> 50, 1% -> 80, 1.67% -> 100; negative growth penalised symmetrically.
  return clamp(50 + weeklyPct * 30, 0, 100);
}

/**
 * Median of the measured momentum scores, the value an entry without its own
 * history is scored with. With nothing measured at all (a fresh fork) every
 * entry takes the same value, so the constant cannot change any ranking; 50 is
 * the score for zero growth.
 */
export function medianMomentum(measured: number[]): number {
  if (measured.length === 0) return 50;
  const sorted = [...measured].sort((a, b) => a - b);
  const upper = sorted[Math.floor(sorted.length / 2)] as number;
  const lower = sorted[Math.ceil(sorted.length / 2) - 1] as number;
  return (lower + upper) / 2;
}
