import { MAINTAINED_DAYS, PULSE_MIN_COMMITS, RELEASE_STALE_DAYS, SHIPPED_FRESH_DAYS, STALE_DAYS } from "./constants.js";

/**
 * Single source of truth for repository health status.
 *
 * The README generator derives the activity dot from it, and site-data
 * bakes the result into docs/data.json as a `status` field that
 * docs/lib.js reads verbatim. Never duplicate this rule elsewhere.
 *
 * The rule (commit window per OpenSSF Scorecard's "Maintained" check):
 *   dead   — archived, or newest life sign (mainline commit, release,
 *            tag) is 12+ months old
 *   quiet  — life sign 6-12 months old; stable shipping stalled 2+
 *            years; or coasting: under 3 mainline commits in 90 days
 *            with nothing stable shipped in 6 months
 *   active — recent mainline work and healthy stable shipping
 *
 * pushedAt is deliberately not a signal — it updates on pushes to any
 * branch (bots, PR heads). Stable releases and stable-named tags count
 * as shipping; prerelease tags only prove the project is alive.
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
  /** Latest GitHub release publishedAt (ISO); excludes prereleases and drafts. */
  lastRelease: string | null | undefined;
  /** Newest tag's commit/tagger date (ISO), prereleases included. */
  lastTag: string | null | undefined;
  /** Newest tag whose name does not look like a prerelease (ISO). */
  lastStableTag?: string | null | undefined;
  /** Commits on the default branch in the last 90 days; null = unknown (pulse check skipped). */
  commits90d: number | null | undefined;
}

// PEP 440 + semver prerelease names: a digit followed by an
// a/alpha/b/beta/rc/pre/preview/dev suffix, or a bare channel name.
// The digit prefix keeps build-number tags like "b10056" stable.
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

  // Shipping health is judged on the stable channel only; repos that
  // never stable-shipped (curated lists, research code) are not judged.
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
