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

/** Generate a short tagline from a description: its first `maxWords` words, trailing punctuation dropped. */
export function generateTagline(description: string, maxWords = 7): string {
  const words = description.split(/\s+/).slice(0, maxWords);
  return words.join(" ").replace(/[.,;:!?]+$/, "");
}

/**
 * Escape curated text for the README's raw HTML (cards are <details> blocks).
 * Only "&" used to be escaped, so a tagline like "<model>" would have opened
 * a tag and swallowed the rest of the card; "<100µs" survived only because a
 * digit cannot start a tag name.
 */
export function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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

/**
 * License label for display. GitHub reports NOASSERTION when a license file
 * exists but matches no SPDX identifier; printed raw it reads like an error
 * code. The raw value stays in the DB because scoring tiers on it.
 */
export function displayLicense(license: string | null): string | null {
  return license === "NOASSERTION" ? "Other" : license;
}
