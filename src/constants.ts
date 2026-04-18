// Project health thresholds
// < MAINTAINED_DAYS  -> active (green dot)
// < STALE_DAYS       -> stale (yellow dot)
// >= STALE_DAYS      -> unmaintained (red dot, "N+ months" note)
export const MAINTAINED_DAYS = 180;
export const STALE_DAYS = 365;
export const STALE_MONTHS = 12;

// Minimum absolute star delta to render as a trend indicator (noise filter)
export const TREND_DISPLAY_MIN = 10;
