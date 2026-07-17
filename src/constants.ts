// Project health thresholds — consumed ONLY by src/status.ts (the single
// source of truth for repo status; README dots and the site's data.json
// both derive from it).
// Life sign = newest of: default-branch commit, release, tag.
// < MAINTAINED_DAYS  -> candidate for active (green dot)
// < STALE_DAYS       -> quiet (yellow dot)
// >= STALE_DAYS      -> dead (red dot, "N+ months" note)
export const MAINTAINED_DAYS = 180;
export const STALE_DAYS = 365;
export const STALE_MONTHS = 12;

// A repo that ships releases or tags but hasn't shipped in over 2 years is
// capped at yellow even when commits are recent — docs/CI churn can keep a
// stalled project looking green. Repos that never shipped either are not
// judged on this (curated lists and research repos have no release process).
export const RELEASE_STALE_DAYS = 730;
export const RELEASE_STALE_MONTHS = 24;

// Green additionally needs a real pulse: at least PULSE_MIN_COMMITS mainline
// commits in the last 90 days (OpenSSF Scorecard's "Maintained" window), OR
// a release/tag within SHIPPED_FRESH_DAYS — a repo that just shipped is not
// "coasting" even if its commit count is low.
export const PULSE_MIN_COMMITS = 3;
export const PULSE_WINDOW_DAYS = 90;
export const SHIPPED_FRESH_DAYS = 180;

// Minimum absolute star delta to render as a trend indicator (noise filter)
export const TREND_DISPLAY_MIN = 10;
