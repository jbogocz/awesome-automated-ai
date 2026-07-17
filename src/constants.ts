// Project health thresholds, consumed only by src/status.ts.
// Life sign = newest of: default-branch commit, release, tag.
export const MAINTAINED_DAYS = 180; // life sign fresher than this -> candidate for active
export const STALE_DAYS = 365; // life sign older than this -> dead
export const STALE_MONTHS = 12;

// Stable shipping (release or stable tag) older than this caps a repo at
// quiet; repos that never shipped are not judged on it.
export const RELEASE_STALE_DAYS = 730;
export const RELEASE_STALE_MONTHS = 24;

// Active needs a pulse: PULSE_MIN_COMMITS mainline commits within
// PULSE_WINDOW_DAYS, or a stable ship within SHIPPED_FRESH_DAYS.
export const PULSE_MIN_COMMITS = 3;
export const PULSE_WINDOW_DAYS = 90;
export const SHIPPED_FRESH_DAYS = 180;

// Minimum absolute star delta to render as a trend indicator (noise filter)
export const TREND_DISPLAY_MIN = 10;
