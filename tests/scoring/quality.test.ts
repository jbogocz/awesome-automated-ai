import { describe, expect, it } from "vitest";
import { computeQualityScore, medianMomentum, type QualityInput } from "../../src/scoring/quality.ts";

describe("computeQualityScore", () => {
  it("scores a healthy active project high", () => {
    const input: QualityInput = {
      stars: 10000,
      starsPrevious: 9700,
      lastLifeSign: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
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
      lastLifeSign: new Date(Date.now() - 1215 * 24 * 60 * 60 * 1000).toISOString(),
      license: "BSD-3-Clause",
      archived: false,
      peerMomentum: 56,
    };
    const live: QualityInput = { ...abandoned, lastLifeSign: new Date(Date.now() - 46 * 86400000).toISOString() };
    expect(computeQualityScore(abandoned)).toBeLessThan(computeQualityScore(live));
    expect(computeQualityScore(abandoned)).toBeLessThan(60);
  });

  it("treats a missing life sign as zero freshness rather than throwing", () => {
    const input: QualityInput = {
      stars: 1000,
      starsPrevious: 1000,
      lastLifeSign: null,
      license: "MIT",
      archived: false,
      peerMomentum: 56,
    };
    expect(computeQualityScore(input)).toBeGreaterThanOrEqual(0);
    expect(computeQualityScore(input)).toBeLessThan(
      computeQualityScore({ ...input, lastLifeSign: new Date().toISOString() }),
    );
  });

  // Regression guard: freshness decayed from day 0, so tsfresh (9.5k stars,
  // last commit 120 days earlier, growing) ranked below skrub (1.7k stars,
  // pushed the day before) although the status rule calls both maintained.
  it("does not let a recent push outweigh stars while both repos are maintained", () => {
    const day = 86400000;
    const mature: QualityInput = {
      stars: 9486,
      starsPrevious: null,
      trend30d: 51,
      trend30dDays: 28,
      lastLifeSign: new Date(Date.now() - 120 * day).toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
    };
    const young: QualityInput = {
      ...mature,
      stars: 1666,
      trend30d: null,
      trend30dDays: null,
      lastLifeSign: new Date(Date.now() - day).toISOString(),
      license: "BSD-3-Clause",
    };
    expect(computeQualityScore(mature)).toBeGreaterThan(computeQualityScore(young));
    // Past the maintained window freshness still decays.
    expect(
      computeQualityScore({ ...mature, lastLifeSign: new Date(Date.now() - 300 * day).toISOString() }),
    ).toBeLessThan(computeQualityScore(mature));
  });

  it("scores an unmaintained project low", () => {
    const input: QualityInput = {
      stars: 500,
      starsPrevious: 510,
      lastLifeSign: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      license: null,
      archived: false,
      peerMomentum: 56,
    };
    const score = computeQualityScore(input);
    expect(score).toBeLessThan(45);
  });

  it("gives neutral trend when no previous data", () => {
    const input: QualityInput = {
      stars: 5000,
      starsPrevious: null,
      lastLifeSign: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      license: "Apache-2.0",
      archived: false,
      peerMomentum: 56,
    };
    const score = computeQualityScore(input);
    expect(score).toBeGreaterThanOrEqual(50);
  });

  it("penalizes archived projects", () => {
    const active: QualityInput = {
      stars: 5000,
      starsPrevious: 4900,
      lastLifeSign: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
    };
    const archived: QualityInput = { ...active, archived: true };
    expect(computeQualityScore(active)).toBeGreaterThan(computeQualityScore(archived));
  });

  it("clamps score between 0 and 100", () => {
    const extreme: QualityInput = {
      stars: 999999,
      starsPrevious: 1,
      lastLifeSign: new Date().toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
    };
    expect(computeQualityScore(extreme)).toBeLessThanOrEqual(100);
    expect(computeQualityScore(extreme)).toBeGreaterThanOrEqual(0);
  });

  it("distinguishes mega-repos instead of saturating at 100K stars", () => {
    const base: QualityInput = {
      stars: 0,
      starsPrevious: null,
      lastLifeSign: new Date().toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
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
      lastLifeSign: new Date().toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
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
      lastLifeSign: new Date().toISOString(),
      license: "Apache-2.0",
      archived: false,
      peerMomentum: 56,
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
      lastLifeSign: new Date().toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
    };
    const poor: QualityInput = {
      ...healthy,
      lastLifeSign: new Date(Date.now() - 400 * 86400000).toISOString(),
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
      lastLifeSign: new Date().toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
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
      lastLifeSign: new Date().toISOString(),
      license: "MIT",
      archived: false,
      peerMomentum: 56,
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
