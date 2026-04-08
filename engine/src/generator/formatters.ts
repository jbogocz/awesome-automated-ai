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
 * Render a 10-character Unicode progress bar for a score 0-100.
 * - filled chars:  Math.floor(score / 10)  using U+2588 (FULL BLOCK)
 * - partial char:  (score % 10 >= 5) ? 1 : 0  using U+2593 (DARK SHADE)
 * - empty chars:   remainder  using U+2591 (LIGHT SHADE)
 */
export function progressBar(score: number): string {
  const filled = Math.floor(score / 10);
  const partial = score % 10 >= 5 ? 1 : 0;
  const empty = 10 - filled - partial;
  return "\u2588".repeat(filled) + "\u2593".repeat(partial) + "\u2591".repeat(empty);
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
 * Generate a short tagline from a description.
 * - Takes text up to first "." or "," followed by a space
 * - If no match, uses full description
 * - Caps at maxLen chars, truncates with "..." if over
 * - Replaces "&" with "&amp;"
 */
export function generateTagline(description: string, maxLen = 80): string {
  const match = description.match(/^(.+?)[.,]\s/);
  let text = match ? match[1] : description;
  if (text.length > maxLen) {
    text = text.slice(0, maxLen) + "...";
  }
  return text.replace(/&/g, "&amp;");
}

/**
 * Format an ISO date string as "Mon YYYY" (e.g. "Apr 2026").
 * Returns "-" for empty string or parse error.
 */
export function formatDateMonth(pushed: string): string {
  if (!pushed) return "-";
  try {
    const date = new Date(pushed);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return "-";
  }
}
