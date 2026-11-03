import { describe, expect, it } from "vitest";
import {
  computeMaintenanceScore,
  computeQualityScore,
  medianMomentum,
  type QualityInput,
} from "../../src/scoring/quality.ts";

describe("computeQualityScore", () => {
  it("scores a healthy active project high", () => {
    const input: QualityInput = {
      stars: 10000,
      starsPrevious: 9700,
      lastStableShip: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
      commits90d: null,
    };
    const score = computeQualityScore(input);
    expect(score).toBeGreaterThanOrEqual(70);
    expect(score).toBeLessThanOrEqual(100);
  });

  // Regression guard: freshness used to be computed from pushedAt, which
  // updates on pushes to ANY branch. auto-sklearn (dead since 2023, but with
  // recent bot traffic on its pushed_at) scored 67 that way and outranked
  // live projects under the dashboard's default sort.
  it("scores a repo with a stale life sign low even when bot pushes are recent", () => {
    const abandoned: QualityInput = {
      stars: 8000,
      starsPrevious: 8000,
      lastStableShip: new Date(Date.now() - 1215 * 24 * 60 * 60 * 1000).toISOString(),
      license: "BSD-3-Clause",
      archived: false,
      peerMomentum: 56,
      commits90d: null,
    };
    const live: QualityInput = { ...abandoned, lastStableShip: new Date(Date.now() - 46 * 86400000).toISOString() };
    expect(computeQualityScore(abandoned)).toBeLessThan(computeQualityScore(live));
    expect(computeQualityScore(abandoned)).toBeLessThan(60);
  });

  it("treats a missing life sign as zero freshness rather than throwing", () => {
    const input: QualityInput = {
      stars: 1000,
      starsPrevious: 1000,
      lastStableShip: null,
      license: "MIT",
      archived: false,
      peerMomentum: 56,
      commits90d: null,
    };
    expect(computeQualityScore(input)).toBeGreaterThanOrEqual(0);
    expect(computeQualityScore(input)).toBeLessThan(
      computeQualityScore({ ...input, lastStableShip: new Date().toISOString() }),
    );
  });

  // Regression guard: freshness decayed from day 0, so tsfresh (9.5k stars,
  // no commit in 90 days but a stable release 157 days earlier) ranked below
  // skrub (1.7k stars, 92 commits in 90 days) on recency alone.
  it("keeps a mature library that still ships above a much smaller busy one", () => {
    const day = 86400000;
    const mature: QualityInput = {
      stars: 9486,
      starsPrevious: null,
      trend30d: 51,
      trend30dDays: 28,
      commits90d: 0,
      lastStableShip: new Date(Date.now() - 157 * day).toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
    };
    const young: QualityInput = {
      ...mature,
      stars: 1666,
      trend30d: null,
      trend30dDays: null,
      commits90d: 92,
      lastStableShip: new Date(Date.now() - 34 * day).toISOString(),
      license: "BSD-3-Clause",
    };
    expect(computeQualityScore(mature)).toBeGreaterThan(computeQualityScore(young));
  });

  // Regression guard: a flat 180-day plateau let 15 quiet repos outrank active
  // peers of similar size, e.g. Portkey Gateway (13.3k stars, no commit in 90
  // days, last release 296 days earlier) above agentgateway (5.9k, busy).
  it("ranks a quiet repo below an active peer of similar size", () => {
    const day = 86400000;
    const quiet: QualityInput = {
      stars: 13301,
      starsPrevious: null,
      commits90d: 0,
      lastStableShip: new Date(Date.now() - 296 * day).toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
    };
    const active: QualityInput = {
      ...quiet,
      stars: 5883,
      commits90d: 60,
      lastStableShip: new Date(Date.now() - 10 * day).toISOString(),
      license: "Apache-2.0",
    };
    expect(computeQualityScore(active)).toBeGreaterThan(computeQualityScore(quiet));
  });

  it("scores an unmaintained project low", () => {
    const input: QualityInput = {
      stars: 500,
      starsPrevious: 510,
      lastStableShip: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      license: null,
      archived: false,
      peerMomentum: 56,
      commits90d: null,
    };
    const score = computeQualityScore(input);
    expect(score).toBeLessThan(45);
  });

  it("gives neutral trend when no previous data", () => {
    const input: QualityInput = {
      stars: 5000,
      starsPrevious: null,
      lastStableShip: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      license: "Apache-2.0",
      archived: false,
      peerMomentum: 56,
      commits90d: null,
    };
    const score = computeQualityScore(input);
    expect(score).toBeGreaterThanOrEqual(50);
  });

  it("penalizes archived projects", () => {
    const active: QualityInput = {
      stars: 5000,
      starsPrevious: 4900,
      lastStableShip: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
      commits90d: null,
    };
    const archived: QualityInput = { ...active, archived: true };
    expect(computeQualityScore(active)).toBeGreaterThan(computeQualityScore(archived));
  });

  it("clamps score between 0 and 100", () => {
    const extreme: QualityInput = {
      stars: 999999,
      starsPrevious: 1,
      lastStableShip: new Date().toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
      commits90d: null,
    };
    expect(computeQualityScore(extreme)).toBeLessThanOrEqual(100);
    expect(computeQualityScore(extreme)).toBeGreaterThanOrEqual(0);
  });

  it("distinguishes mega-repos instead of saturating at 100K stars", () => {
    const base: QualityInput = {
      stars: 0,
      starsPrevious: null,
      lastStableShip: new Date().toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
      commits90d: null,
    };
    const hundredK = computeQualityScore({ ...base, stars: 100_000 });
    const hundredFortyK = computeQualityScore({ ...base, stars: 145_000 });
    const millionStar = computeQualityScore({ ...base, stars: 1_000_000 });
    expect(hundredFortyK).toBeGreaterThan(hundredK);
    expect(millionStar).toBeGreaterThan(hundredFortyK);
  });

  it("tiers license: permissive > copyleft > NOASSERTION > null/proprietary", () => {
    const base: QualityInput = {
      stars: 10000,
      starsPrevious: null,
      lastStableShip: new Date().toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
      commits90d: null,
    };
    const mit = computeQualityScore(base);
    const gpl = computeQualityScore({ ...base, license: "GPL-3.0" });
    const noassert = computeQualityScore({ ...base, license: "NOASSERTION" });
    const proprietary = computeQualityScore({ ...base, license: null });
    expect(mit).toBeGreaterThan(gpl);
    expect(gpl).toBeGreaterThan(noassert);
    expect(noassert).toBeGreaterThan(proprietary);
  });

  // Regression guard: momentum used to be imputed from the entry's own stars,
  // freshness and license, which put every active newcomer near 88 against a
  // measured catalog median of 56; the 49 repos added on 2026-11-03 took first
  // place in 14 categories with a fraction of their neighbours' stars.
  it("scores an entry without history at the catalog's median momentum", () => {
    const base: QualityInput = {
      stars: 6400,
      starsPrevious: null,
      lastStableShip: new Date().toISOString(),
      license: "Apache-2.0",
      archived: false,
      peerMomentum: 56,
      commits90d: null,
    };
    // An established peer four times larger, growing at exactly the median rate
    // (momentum 56 = 0.2% a week over the 30-day window).
    const peer: QualityInput = {
      ...base,
      stars: 22000,
      trend30d: Math.round(((22000 * 0.2) / 100 / 7) * 30),
      trend30dDays: 30,
    };
    expect(computeQualityScore(base)).toBeLessThan(computeQualityScore(peer));
    // Without history the score equals that of the same repo measured at the median.
    const measuredAtMedian: QualityInput = { ...base, trend30d: ((6400 * 0.2) / 100 / 7) * 30, trend30dDays: 30 };
    expect(computeQualityScore(base)).toBe(computeQualityScore(measuredAtMedian));
  });

  it("still separates healthy from poor entries that both lack history", () => {
    const healthy: QualityInput = {
      stars: 145000,
      starsPrevious: null,
      lastStableShip: new Date().toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
      commits90d: null,
    };
    const poor: QualityInput = {
      ...healthy,
      lastStableShip: new Date(Date.now() - 400 * 86400000).toISOString(),
      license: null,
    };
    expect(computeQualityScore(healthy)).toBeGreaterThan(computeQualityScore(poor));
  });

  it("prefers trend30d over trend7d over legacy starsPrevious", () => {
    const base: QualityInput = {
      stars: 10000,
      starsPrevious: 9500, // legacy -> +500
      trend30d: 0, // 30d -> 0 (flat)
      trend7d: 500, // 7d -> +500 (hot)
      lastStableShip: new Date().toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
      commits90d: null,
    };
    // trend30d=0 wins, momentum should be neutral 50
    const score30d = computeQualityScore(base);
    // With trend30d omitted, falls back to trend7d (hot) -> higher score
    const score7d = computeQualityScore({ ...base, trend30d: null });
    expect(score7d).toBeGreaterThan(score30d);
  });

  // Weekly snapshots put the "30d" anchor at t-28 as often as not; the same
  // delta over fewer days is faster growth and must score as such.
  it("normalises momentum by the window the delta actually spans", () => {
    const base: QualityInput = {
      stars: 10000,
      starsPrevious: null,
      trend30d: 300,
      lastStableShip: new Date().toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
      commits90d: null,
    };
    const nominal = computeQualityScore(base);
    expect(computeQualityScore({ ...base, trend30dDays: 30 })).toBe(nominal);
    expect(computeQualityScore({ ...base, trend30dDays: 14 })).toBeGreaterThan(nominal);
  });
});

describe("medianMomentum", () => {
  it("takes the middle measured value, averaging the two middle ones for an even count", () => {
    expect(medianMomentum([70, 50, 56])).toBe(56);
    expect(medianMomentum([50, 52, 60, 80])).toBe(56);
  });

  it("returns the zero-growth score when nothing is measured, which ranks every entry alike", () => {
    expect(medianMomentum([])).toBe(50);
  });
});

describe("computeMaintenanceScore", () => {
  const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
  it("gives full marks for a weekly commit pulse or a stable ship within 60 days", () => {
    expect(computeMaintenanceScore(13, null)).toBe(100);
    expect(computeMaintenanceScore(0, daysAgo(59))).toBe(100);
  });
  it("fades shipping credit linearly to zero at twelve months", () => {
    const mid = computeMaintenanceScore(0, daysAgo(212));
    expect(mid).toBeGreaterThan(45);
    expect(mid).toBeLessThan(55);
    expect(computeMaintenanceScore(0, daysAgo(366))).toBe(0);
  });
  it("scores no commits and no stable ship as zero", () => {
    expect(computeMaintenanceScore(0, null)).toBe(0);
    expect(computeMaintenanceScore(null, null)).toBe(0);
  });
});
