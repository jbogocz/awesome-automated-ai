// Project health thresholds
// < MAINTAINED_DAYS  -> active (green dot)
// < STALE_DAYS       -> stale (yellow dot)
// >= STALE_DAYS      -> unmaintained (red dot, "N+ months" note)
export const MAINTAINED_DAYS = 180;
export const STALE_DAYS = 365;
export const STALE_MONTHS = 12;

// A repo that publishes releases but hasn't shipped one in over a year is
// capped at yellow even when pushes are recent — docs/CI churn can keep a
// stalled project looking green. Repos with no releases at all are not
// judged on this (many healthy projects never use GitHub releases).
export const RELEASE_STALE_DAYS = 365;

// Minimum absolute star delta to render as a trend indicator (noise filter)
export const TREND_DISPLAY_MIN = 10;
