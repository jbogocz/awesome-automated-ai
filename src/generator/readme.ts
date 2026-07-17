import { parse as parseYaml } from "yaml";
import { STALE_MONTHS, TREND_DISPLAY_MIN } from "../constants.js";
import { activityDot, formatDateMonth, formatStarsShort, generateTagline } from "./formatters.js";

export interface ApiRepoData {
  stars: number;
  pushed: string;
  archived: boolean;
  license: string | null;
  trend: number | null;
  trend7d?: number | null;
  trend30d?: number | null;
  lastRelease?: string | null;
  lastCommit?: string | null;
  score: number;
  topics: string[];
  tagline: string | null;
}
export type ApiData = Record<string, ApiRepoData>;

export interface TocCategory {
  name: string;
  section: string;
}
export interface TocManifest {
  sections: string[];
  categories: TocCategory[];
}

interface GenerateOptions {
  yamlContent: string;
  header: string;
  footer: string;
  apiData: ApiData;
  /**
   * Category manifest (src/categories.yaml). When provided, the block between
   * the TOC markers in the header is generated from it — keeping the manifest
   * as the single source of truth for category names, order, and anchors.
   */
  manifest?: TocManifest;
}

export const TOC_BEGIN = "<!-- toc:begin -->";
export const TOC_END = "<!-- toc:end -->";

/** Anchor for a `## Category Name` heading — must match GitHub's slugging for the names we use. */
export function categoryAnchor(name: string): string {
  return name.toLowerCase().replace(/ /g, "-").replace(/\//g, "").replace(/&/g, "and");
}

export function buildToc(manifest: TocManifest, countByName: Map<string, number>): string {
  const blocks: string[] = [];
  for (const section of manifest.sections) {
    const cats = manifest.categories.filter((c) => c.section === section);
    if (cats.length === 0) continue;
    const lines = cats.map((c) => `- [${c.name}](#${categoryAnchor(c.name)}) (${countByName.get(c.name) ?? 0})`);
    blocks.push([`**${section}**`, ...lines].join("\n"));
  }
  return blocks.join("\n\n");
}

function injectToc(header: string, manifest: TocManifest, categories: Category[]): string {
  const known = new Set(manifest.categories.map((c) => c.name));
  const unknown = categories.filter((c) => !known.has(c.name)).map((c) => c.name);
  if (unknown.length > 0) {
    throw new Error(`projects.yaml categories missing from src/categories.yaml: ${unknown.join(", ")}`);
  }
  const begin = header.indexOf(TOC_BEGIN);
  const end = header.indexOf(TOC_END);
  if (begin === -1 || end === -1 || end < begin) {
    throw new Error(`header template must contain "${TOC_BEGIN}" followed by "${TOC_END}"`);
  }
  const counts = new Map(categories.map((c) => [c.name, (c.entries ?? []).length]));
  return `${header.slice(0, begin + TOC_BEGIN.length)}\n\n${buildToc(manifest, counts)}\n\n${header.slice(end)}`;
}

interface Entry {
  name: string;
  repo?: string;
  url?: string;
  description?: string;
  tagline?: string;
  note?: string;
  tags?: string[];
  vendor?: string;
  pricing?: string;
  authors?: string;
  venue?: string;
  year?: number | string;
  commercial?: boolean;
}
interface Category {
  name: string;
  description?: string;
  entries?: Entry[];
}

export function generateReadme(opts: GenerateOptions): string {
  const { yamlContent, header, footer, apiData, manifest } = opts;
  const doc = parseYaml(yamlContent) as { categories: Category[] };
  const categories = doc.categories;

  const resolvedHeader = manifest ? injectToc(header, manifest, categories) : header;

  const parts: string[] = [];
  parts.push(resolvedHeader.trimEnd(), "");

  for (const cat of categories) {
    parts.push(`## ${cat.name}`, "");
    if (cat.description) parts.push(`*${cat.description}*`, "");
    const entries = cat.entries ?? [];
    if (entries.length > 0) {
      for (const line of buildCards(entries, apiData)) parts.push(line);
    }
    parts.push("", "**[\u2b06 Back to Contents](#contents)**", "");
  }

  parts.push(footer.trimEnd(), "");
  return parts.join("\n");
}

interface ScoredEntry {
  entry: Entry;
  rd: ApiRepoData;
  note: string;
  isDead: boolean;
  isHistorical: boolean;
}

function buildCards(entries: Entry[], apiData: ApiData): string[] {
  const githubEntries = entries.filter((e) => e.repo);
  const externalEntries = entries.filter((e) => !e.repo);

  const scored: ScoredEntry[] = githubEntries.map((entry) => {
    const repo = entry.repo ?? "";
    const rd = apiData[repo] ?? {
      stars: 0,
      pushed: "",
      archived: false,
      license: null,
      trend: null,
      score: 0,
      topics: [],
      tagline: null,
    };
    let note = entry.note ?? "";
    if (rd.archived && !note.includes("Archived")) note = `Archived. ${note}`.trim();
    else if (!note && isUnmaintained(rd.pushed)) note = `Unmaintained - no commits for ${STALE_MONTHS}+ months.`;
    const isHistorical = /historical/i.test(note);
    const isDead = rd.archived || isUnmaintained(rd.pushed) || /unmaintained|deprecated/i.test(note);
    return { entry, rd, note, isDead, isHistorical };
  });

  scored.sort((a, b) => b.rd.score - a.rd.score);

  const active = scored.filter((s) => !s.isDead);
  const dead = scored.filter((s) => s.isDead);

  const lines: string[] = [];
  for (const [i, entry] of active.entries()) {
    lines.push(...buildOneCard(entry, i + 1));
    lines.push("");
  }
  if (dead.length > 0) {
    lines.push("---", "");
    for (const s of dead) {
      lines.push(...buildOneCard(s, null));
      lines.push("");
    }
  }
  if (externalEntries.length > 0 && (active.length > 0 || dead.length > 0)) {
    lines.push("---", "");
  }
  for (const entry of externalEntries) {
    lines.push(...buildExternalCard(entry));
    lines.push("");
  }
  return lines;
}

function buildExternalCard(entry: Entry): string[] {
  const url = entry.url ?? "#";
  const icon = entry.authors ? "\u{1F4C4}" : entry.vendor ? "\u{1F3E2}" : "\u{1F517}";
  const nameHtml = `<b><a href="${url}">${entry.name}</a></b>`;
  const tagline = entry.tagline ?? generateTagline(entry.description ?? "");
  const taglinePart = tagline ? ` ${tagline}` : "";
  const summary = `<details><summary>${icon} ${nameHtml}${taglinePart}</summary>`;

  const desc = entry.description ?? "";
  const note = entry.note ?? "";
  const fullDesc = note ? `${desc} **${note}**` : desc;

  const metaLines: string[] = [];
  if (entry.vendor) metaLines.push(`  Vendor    ${entry.vendor}`);
  if (entry.pricing) metaLines.push(`  Pricing   ${entry.pricing}`);
  if (entry.authors) metaLines.push(`  Authors   ${entry.authors}`);
  if (entry.venue) metaLines.push(`  Venue     ${entry.venue}`);
  if (entry.year !== undefined) metaLines.push(`  Year      ${entry.year}`);
  if (entry.tags && entry.tags.length > 0) {
    const tags = entry.tags.slice(0, 5);
    metaLines.push(`  Tags      ${tags.join(" \u00B7 ")}`);
  }
  const dashboard = metaLines.length > 0 ? ["```", ...metaLines, "```"] : [];

  return [summary, "", "<br>", "", fullDesc, "", ...dashboard, "", "</details>"];
}

const MEDAL = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

function buildOneCard(s: ScoredEntry, rank: number | null): string[] {
  const { entry, rd, note, isDead, isHistorical } = s;
  const repo = entry.repo ?? "";
  const url = entry.url ?? `https://github.com/${repo}`;
  const dot = activityDot(rd.pushed, rd.archived, rd.lastRelease);
  const score = rd.score;

  let rankLabel: string;
  if (rank === null) {
    rankLabel = "";
  } else if (rank <= 3) {
    rankLabel = ` ${MEDAL[rank - 1]}`;
  } else {
    rankLabel = ` <b>${rank}</b>`;
  }

  let nameHtml: string;
  if (isDead && isHistorical) {
    nameHtml = `\u{1F5C4}\uFE0F <i><a href="${url}">${entry.name}</a></i>`;
  } else if (isDead) {
    nameHtml = `\u{1F4A4} <i><a href="${url}">${entry.name}</a></i>`;
  } else {
    nameHtml = `<b><a href="${url}">${entry.name}</a></b>`;
  }

  const starsBadge = `<code>\u2B50 ${formatStarsShort(rd.stars)}</code>`;
  const trendBadge =
    !isDead && rd.trend !== null && Math.abs(rd.trend) >= TREND_DISPLAY_MIN
      ? ` <code>${rd.trend > 0 ? "\u2197\uFE0F" : "\u2198\uFE0F"} ${rd.trend > 0 ? "+" : ""}${rd.trend}</code>`
      : "";
  const licenseBadge = rd.license ? ` <code>${rd.license}</code>` : "";

  const tagline = rd.tagline ?? entry.tagline ?? generateTagline(entry.description ?? "");
  const taglinePart = tagline ? ` ${tagline}` : "";

  const summary = `<details><summary>${dot}${rankLabel} ${nameHtml} ${starsBadge}${trendBadge}${licenseBadge}${taglinePart}</summary>`;

  const desc = entry.description ?? "";
  const fullDesc = note ? `${desc} **${note}**` : desc;
  const displayDesc = isDead ? `*${fullDesc}*` : fullDesc;

  const starsExact = rd.stars.toLocaleString("en-US");
  const trendDetail = buildTrendDetail(rd, isDead);

  const actDate = formatDateMonth(rd.pushed);
  let actSuffix = "";
  if (rd.archived) actSuffix = " - archived";
  else if (isHistorical) actSuffix = " - historical";
  else if (isDead) actSuffix = ` - unmaintained ${STALE_MONTHS}+ months`;

  const allTags = entry.tags && entry.tags.length > 0 ? entry.tags : (rd.topics ?? []);
  const tags = allTags.slice(0, 5);
  const tagsLine = tags.length > 0 ? `\n  Tags      ${tags.join(" \u00B7 ")}` : "";

  const dashboard: string[] = [
    "```",
    `  Score     ${score}/100`,
    `  Stars     \u2B50 ${starsExact} ${trendDetail}`,
    `  Activity  ${dot} ${actDate}${actSuffix}`,
  ];
  if (rd.lastRelease) {
    dashboard.push(`  Release   \u{1F4E6} ${formatDateMonth(rd.lastRelease)}`);
  }
  dashboard.push(`  License   ${rd.license ?? "-"}${tagsLine}`);
  dashboard.push("```");

  return [summary, "", "<br>", "", displayDesc, "", ...dashboard, "", "</details>"];
}

function buildTrendDetail(rd: ApiRepoData, isDead: boolean): string {
  if (isDead) return "(n/a)";
  const parts: string[] = [];
  const t30 = rd.trend30d ?? rd.trend;
  if (t30 !== null && t30 !== undefined) parts.push(`${t30 > 0 ? "+" : ""}${t30} last 30d`);
  if (rd.trend7d !== null && rd.trend7d !== undefined) {
    parts.push(`${rd.trend7d > 0 ? "+" : ""}${rd.trend7d} last 7d`);
  }
  return parts.length > 0 ? `(${parts.join(", ")})` : "(n/a)";
}

function isUnmaintained(pushed: string, months = STALE_MONTHS): boolean {
  if (!pushed) return true;
  try {
    return Date.now() - new Date(pushed).getTime() > months * 30 * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}
