import { parse as parseYaml } from "yaml";
import { activityDot, formatDateMonth, formatStarsShort, generateTagline, progressBar } from "./formatters.js";

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
    const anchor = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/\//g, "")
      .replace(/&/g, "and");
    readme = readme.replace(
      new RegExp(
        `(\\[${escapeRegex(name)}\\]\\(#${escapeRegex(anchor)}\\)) \\(\\d+\\)`,
      ),
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
  const scored: ScoredEntry[] = entries.map((entry) => {
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
    if (rd.archived && !note.includes("Archived"))
      note = `Archived. ${note}`.trim();
    else if (!note && isUnmaintained(rd.pushed))
      note = "Unmaintained - no commits for 12+ months.";
    const isHistorical = /historical/i.test(note);
    const isDead =
      rd.archived || isUnmaintained(rd.pushed) || /unmaintained|deprecated/i.test(note);
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
  return lines;
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
    !isDead && rd.trend !== null && Math.abs(rd.trend) >= 10
      ? ` <code>${rd.trend > 0 ? "\u2197\uFE0F" : "\u2198\uFE0F"} ${rd.trend > 0 ? "+" : ""}${rd.trend}</code>`
      : "";
  const licenseBadge = rd.license ? ` <code>${rd.license}</code>` : "";

  const tagline = rd.tagline || entry.tagline || generateTagline(entry.description ?? "");
  const taglinePart = tagline ? ` ${tagline}` : "";

  const summary = `<details><summary>${dot}${rankLabel} ${nameHtml} ${starsBadge}${trendBadge}${licenseBadge}${taglinePart}</summary>`;

  // Details content
  const desc = entry.description ?? "";
  const fullDesc = note ? `${desc} **${note}**` : desc;
  const displayDesc = isDead ? `*${fullDesc}*` : fullDesc;

  // Dashboard
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
  else if (isDead) actSuffix = " - unmaintained 12+ months";

  const allTags = entry.tags && entry.tags.length > 0 ? entry.tags : rd.topics ?? [];
  const tags = allTags.slice(0, 5);
  const tagsLine = tags.length > 0 ? `\n  Tags      ${tags.join(" \u00B7 ")}` : "";

  const dashboard = [
    "```",
    `  Quality   ${score}/100`,
    `  Stars     \u2B50 ${starsExact} ${trendDetail}`,
    `  Activity  ${dot} ${actDate}${actSuffix}`,
    `  License   ${rd.license ?? "-"}${tagsLine}`,
    "```",
  ];

  return [summary, "", "<br>", "", displayDesc, "", ...dashboard, "", "</details>"];
}

function isUnmaintained(pushed: string, months = 12): boolean {
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
