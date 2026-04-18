import { parse as parseYaml } from "yaml";
import { STALE_MONTHS, TREND_DISPLAY_MIN } from "../constants.js";
import { activityDot, formatDateMonth, formatStarsShort, generateTagline } from "./formatters.js";

export interface ApiRepoData {
  stars: number;
  pushed: string;
  archived: boolean;
  license: string | null;
  trend: number | null;
  score: number;
  topics: string[];
  tagline: string | null;
}
export type ApiData = Record<string, ApiRepoData>;

interface GenerateOptions {
  yamlContent: string;
  header: string;
  footer: string;
  apiData: ApiData;
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
}
interface Category {
  name: string;
  description?: string;
  entries?: Entry[];
}

export function generateReadme(opts: GenerateOptions): string {
  const { yamlContent, header, footer, apiData } = opts;
  const doc = parseYaml(yamlContent) as { categories: Category[] };
  const categories = doc.categories;

  const parts: string[] = [];
  parts.push(header.trimEnd(), "");

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
  let readme = parts.join("\n");

  for (const cat of categories) {
    const count = (cat.entries ?? []).length;
    const name = cat.name;
    const anchor = name.toLowerCase().replace(/ /g, "-").replace(/\//g, "").replace(/&/g, "and");
    readme = readme.replace(
      new RegExp(`(\\[${escapeRegex(name)}\\]\\(#${escapeRegex(anchor)}\\)) \\(\\d+\\)`),
      `$1 (${count})`,
    );
  }
  return readme;
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
  for (let i = 0; i < active.length; i++) {
    lines.push(...buildOneCard(active[i], i + 1));
    lines.push("");
  }
  if (dead.length > 0) {
    lines.push("---", "");
    for (const s of dead) {
      lines.push(...buildOneCard(s, null));
      lines.push("");
    }
  }
  for (const entry of externalEntries) {
    lines.push(...buildExternalCard(entry));
    lines.push("");
  }
  return lines;
}

function buildExternalCard(entry: Entry): string[] {
  const url = entry.url ?? "#";
  const icon = entry.authors ? "\u{1F4C4}" : entry.vendor ? "\u{1F4BC}" : "\u{1F517}";
  const nameHtml = `<b><a href="${url}">${entry.name}</a></b>`;
  const tagline = entry.tagline || generateTagline(entry.description ?? "");
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
  const dot = activityDot(rd.pushed, rd.archived);
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

  const tagline = rd.tagline || entry.tagline || generateTagline(entry.description ?? "");
  const taglinePart = tagline ? ` ${tagline}` : "";

  const summary = `<details><summary>${dot}${rankLabel} ${nameHtml} ${starsBadge}${trendBadge}${licenseBadge}${taglinePart}</summary>`;

  const desc = entry.description ?? "";
  const fullDesc = note ? `${desc} **${note}**` : desc;
  const displayDesc = isDead ? `*${fullDesc}*` : fullDesc;

  const starsExact = rd.stars.toLocaleString("en-US");
  const trendDetail = isDead
    ? "(n/a)"
    : rd.trend !== null
      ? `(${rd.trend > 0 ? "+" : ""}${rd.trend} last 30d)`
      : "(n/a)";

  const actDate = formatDateMonth(rd.pushed);
  let actSuffix = "";
  if (rd.archived) actSuffix = " - archived";
  else if (isHistorical) actSuffix = " - historical";
  else if (isDead) actSuffix = ` - unmaintained ${STALE_MONTHS}+ months`;

  const allTags = entry.tags && entry.tags.length > 0 ? entry.tags : (rd.topics ?? []);
  const tags = allTags.slice(0, 5);
  const tagsLine = tags.length > 0 ? `\n  Tags      ${tags.join(" \u00B7 ")}` : "";

  const dashboard = [
    "```",
    `  Score     ${score}/100`,
    `  Stars     \u2B50 ${starsExact} ${trendDetail}`,
    `  Activity  ${dot} ${actDate}${actSuffix}`,
    `  License   ${rd.license ?? "-"}${tagsLine}`,
    "```",
  ];

  return [summary, "", "<br>", "", displayDesc, "", ...dashboard, "", "</details>"];
}

function isUnmaintained(pushed: string, months = STALE_MONTHS): boolean {
  if (!pushed) return true;
  try {
    return Date.now() - new Date(pushed).getTime() > months * 30 * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
