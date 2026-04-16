/**
 * Pure formatting helper functions for collapsible card generation.
 */

/**
 * Format a star count as a short human-readable string.
 * - < 1,000: exact number (e.g. 449 -> "449")
 * - >= 1,000: one decimal K (e.g. 4320 -> "4.3K")
 * - >= 1,000,000: one decimal M (e.g. 1200000 -> "1.2M")
 */
export function formatStarsShort(n: number): string {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1)}K`;
  }
  return String(n);
}

/**
 * Return a coloured circle dot indicating repository activity.
 * - archived or empty pushed -> red
 * - pushed < 180 days ago    -> green
 * - pushed < 365 days ago    -> yellow
 * - otherwise                -> red
 * Returns red on any parse error.
 */
export function activityDot(pushed: string, archived: boolean): string {
  try {
    if (archived || !pushed) return "\uD83D\uDD34"; // red
    const pushedDate = new Date(pushed);
    const now = new Date();
    const diffDays = (now.getTime() - pushedDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays < 180) return "\uD83D\uDFE2"; // green
    if (diffDays < 365) return "\uD83D\uDFE1"; // yellow
    return "\uD83D\uDD34"; // red
  } catch {
    return "\uD83D\uDD34"; // red
  }
}

/**
 * Generate a short tagline from a description (max 7 words).
 * - Takes first 7 words of the description
 * - Replaces "&" with "&amp;"
 */
export function generateTagline(description: string, maxWords = 7): string {
  const words = description.split(/\s+/).slice(0, maxWords);
  const text = words.join(" ").replace(/[.,;:!?]+$/, "");
  return text.replace(/&/g, "&amp;");
}

/**
 * Format an ISO date string as "Mon YYYY" (e.g. "Apr 2026").
 * Returns "-" for empty string or parse error.
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDateMonth(pushed: string): string {
  if (!pushed) return "-";
  try {
    const d = new Date(pushed);
    if (Number.isNaN(d.getTime())) return "-";
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  } catch {
    return "-";
  }
}
