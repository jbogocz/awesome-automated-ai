import { MAINTAINED_DAYS, PULSE_MIN_COMMITS, RELEASE_STALE_DAYS, SHIPPED_FRESH_DAYS, STALE_DAYS } from "./constants.js";

/**
 * Single source of truth for repository health status.
 *
 * Consumed by the README generator (dot colour + notes) and baked into
 * docs/data.json as a precomputed `status` field that docs/lib.js reads
 * verbatim. Nothing else may reimplement this rule — the July 2026
 * README/site drift came from two hand-synced copies of it.
 *
 * The rule (commit window modelled on OpenSSF Scorecard's 90-day
 * "Maintained" check):
 *   dead   — archived, or newest life sign (mainline commit, release or
 *            tag) is 12+ months old
 *   quiet  — life sign 6-12 months old; OR ships releases/tags but the
 *            newest is 2+ years old; OR coasting: under 3 mainline
 *            commits in 90 days with nothing shipped in 6 months
 *   active — recent mainline work AND healthy shipping
 *
 * Why not pushedAt: it updates on pushes to ANY branch (bots, PR heads) —
 * in the July 2026 audit 8 of 249 listed repos looked alive on pushes
 * alone while their mainline had been dormant for 200-1200 days.
 * Why stable tags count as shipping: GitHub Releases alone is unreliable —
 * some projects tag + publish to PyPI/npm without touching the Releases
 * feed. But prerelease tags (v4.0.0a2, -rc1, -beta, nightly) are NOT
 * shipping: PyCaret cut 4.0 alphas through 2026 while its last stable
 * release stayed at Apr 2024 — users still cannot install anything new.
 * Prereleases only prove the project is not dead (life sign).
 */

export type RepoStatus = "active" | "quiet" | "dead";

export type StatusReason =
  | "archived" // repo is archived on GitHub
  | "no-signals" // no commit, release or tag date available
  | "stale" // newest life sign 12+ months old
  | "aging" // newest life sign 6-12 months old
  | "shipping-stalled" // ships releases/tags, but newest is 2+ years old
  | "coasting"; // fresh-ish mainline but <3 commits/90d and no recent ship

export interface StatusSignals {
  archived: boolean;
  /** Default-branch HEAD commit date (ISO). */
  lastCommit: string | null | undefined;
  /** Latest GitHub release publishedAt (ISO) — GitHub's latestRelease
   * already excludes prereleases and drafts, so this is a STABLE signal. */
  lastRelease: string | null | undefined;
  /** Newest tag's commit/tagger date (ISO), prereleases included. */
  lastTag: string | null | undefined;
  /** Newest tag whose name does not look like a prerelease (ISO). */
  lastStableTag?: string | null | undefined;
  /** Commits on the default branch in the last 90 days; null = unknown
   * (pre-migration snapshot) — the pulse check is skipped, never guessed. */
  commits90d: number | null | undefined;
}

// Prerelease tag names, PEP 440 + semver conventions: a digit followed by
// a/alpha/b/beta/rc/pre/preview/dev suffix ("v4.0.0a2", "1.0.0-rc.1",
// "3.7.9.dev3", "0.8-alpha"), or a bare channel name ("nightly", "canary").
// Requires the digit prefix so build-number schemes like llama.cpp's
// "b10056" are NOT misread as betas.
const PRERELEASE_TAG =
  /(\d[-._]?(a(lpha)?|b(eta)?|rc|c|pre(view)?|dev|nightly|snapshot|canary|next|unstable)[-._]?\d*(\.\d+)?|^(nightly|canary|dev|snapshot|edge|latest|unstable|beta|alpha)$)/i;

/** True when a tag name denotes a prerelease/dev build rather than a stable cut. */
export function isPrereleaseTag(name: string): boolean {
  return PRERELEASE_TAG.test(name.trim());
}

const DAY_MS = 86_400_000;

function isDate(d: string | null | undefined): d is string {
  return typeof d === "string" && d.length > 0 && !Number.isNaN(new Date(d).getTime());
}

/** ISO-8601 sorts lexicographically, so max string = newest timestamp. */
function newest(dates: (string | null | undefined)[]): string | null {
  const valid = dates.filter(isDate);
  return valid.length > 0 ? valid.reduce((a, b) => (a > b ? a : b)) : null;
}

/**
 * Newest STABLE shipping signal — a real release users can install:
 * GitHub latestRelease (non-prerelease by definition) or the newest
 * stable-named tag. Prerelease tags never count here.
 */
export function stableShippedAt(s: StatusSignals): string | null {
  return newest([s.lastRelease, s.lastStableTag]);
}

/** Newest shipping signal of ANY kind, prereleases included. */
export function anyShippedAt(s: StatusSignals): string | null {
  return newest([s.lastRelease, s.lastTag, s.lastStableTag]);
}

/** Newest life sign of any kind — mainline commit, release or any tag. */
export function lastLifeSign(s: StatusSignals): string | null {
  return newest([s.lastCommit, anyShippedAt(s)]);
}

export function assessRepo(
  s: StatusSignals,
  now: number = Date.now(),
): { status: RepoStatus; reason: StatusReason | null } {
  if (s.archived) return { status: "dead", reason: "archived" };

  const life = lastLifeSign(s);
  if (!life) return { status: "dead", reason: "no-signals" };
  const lifeDays = (now - new Date(life).getTime()) / DAY_MS;
  if (lifeDays >= STALE_DAYS) return { status: "dead", reason: "stale" };
  if (lifeDays >= MAINTAINED_DAYS) return { status: "quiet", reason: "aging" };

  // Shipping health is judged on STABLE ships only. A project that once
  // shipped stable releases and has served nothing installable for 2+
  // years is stalled, no matter how many alphas it tags (PyCaret: 4.0
  // prereleases through 2026, last stable Apr 2024). Repos that never
  // stable-shipped (curated lists, research code) are not judged on this.
  const stable = stableShippedAt(s);
  const stableDays = stable ? (now - new Date(stable).getTime()) / DAY_MS : null;
  if (stableDays !== null && stableDays >= RELEASE_STALE_DAYS) {
    return { status: "quiet", reason: "shipping-stalled" };
  }

  const shippedRecently = stableDays !== null && stableDays < SHIPPED_FRESH_DAYS;
  if (typeof s.commits90d === "number" && s.commits90d < PULSE_MIN_COMMITS && !shippedRecently) {
    return { status: "quiet", reason: "coasting" };
  }

  return { status: "active", reason: null };
}

export function repoStatus(s: StatusSignals, now: number = Date.now()): RepoStatus {
  return assessRepo(s, now).status;
}

export const STATUS_DOT: Record<RepoStatus, string> = {
  active: "\u{1F7E2}", // green
  quiet: "\u{1F7E1}", // yellow
  dead: "\u{1F534}", // red
};

export function statusDot(s: StatusSignals, now?: number): string {
  return STATUS_DOT[repoStatus(s, now ?? Date.now())];
}
