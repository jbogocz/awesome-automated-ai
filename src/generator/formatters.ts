/**
 * Pure formatting helper functions for collapsible card generation.
 * Health status/dot logic lives in src/status.ts — the single source of truth.
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
