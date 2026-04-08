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
  note?: string;
  tags?: string[];
}
interface Category {
  name: string;
  description?: string;
  entries?: Entry[];
}

const MEDAL = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

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

  const medals = assignMedals(scored);
  scored.sort((a, b) => b.rd.score - a.rd.score);

  const active = scored.filter((s) => !s.isDead);
  const dead = scored.filter((s) => s.isDead);

  const lines: string[] = [];
  for (const s of active) {
    lines.push(...buildOneCard(s, medals));
    lines.push("");
  }
  if (dead.length > 0) {
    lines.push("---", "");
    for (const s of dead) {
      lines.push(...buildOneCard(s, medals));
      lines.push("");
    }
  }
  return lines;
}

function buildOneCard(s: ScoredEntry, medals: Map<ScoredEntry, string>): string[] {
  const { entry, rd, note, isDead, isHistorical } = s;
  const repo = entry.repo ?? "";
  const url = entry.url ?? `https://github.com/${repo}`;
  const dot = activityDot(rd.pushed, rd.archived);
  const score = rd.score;

  const medal = medals.has(s) ? ` ${medals.get(s)}` : "";

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
      ? ` &nbsp; <code>${rd.trend > 0 ? "\u2197\uFE0F" : "\u2198\uFE0F"} ${rd.trend > 0 ? "+" : ""}${rd.trend}</code>`
      : "";
  const licenseBadge = rd.license ? ` &nbsp; <code>${rd.license}</code>` : "";

  const tagline = generateTagline(entry.description ?? "");
  const taglinePart = tagline ? ` &nbsp; - &nbsp; ${tagline}` : "";

  const summary = `<details><summary>${dot} <b>${score}</b> &nbsp;${medal} ${nameHtml} &nbsp; ${starsBadge}${trendBadge}${licenseBadge}${taglinePart}</summary>`;

  // Details content
  const desc = entry.description ?? "";
  const fullDesc = note ? `${desc} **${note}**` : desc;
  const displayDesc = isDead ? `*${fullDesc}*` : fullDesc;

  // Dashboard
  const bar = progressBar(score);
  const starsExact = rd.stars.toLocaleString("en-US");
  const trendDetail = isDead
    ? "(n/a)"
    : rd.trend !== null
      ? `(${rd.trend >= 0 ? "+" : ""}${rd.trend} last 30d)`
      : "(n/a)";

  const actDate = formatDateMonth(rd.pushed);
  let actSuffix = "";
  if (rd.archived) actSuffix = " - archived";
  else if (isHistorical) actSuffix = " - historical";
  else if (isDead) actSuffix = " - unmaintained 12+ months";

  const tags = entry.tags && entry.tags.length > 0 ? entry.tags : rd.topics ?? [];
  const tagsLine = tags.length > 0 ? `\n  Tags      ${tags.join(" \u00B7 ")}` : "";

  const dashboard = [
    "```",
    `  Quality   ${bar}  ${score}/100`,
    `  Stars     \u2B50 ${starsExact} ${trendDetail}`,
    `  Activity  ${dot} ${actDate}${actSuffix}`,
    `  License   ${rd.license ?? "-"}${tagsLine}`,
    "```",
  ];

  return [summary, "", "<br>", "", displayDesc, "", ...dashboard, "", "</details>"];
}

function assignMedals(scored: ScoredEntry[]): Map<ScoredEntry, string> {
  const byScore = [...scored].sort((a, b) => b.rd.score - a.rd.score);
  const medals = new Map<ScoredEntry, string>();
  let medalIdx = 0;
  for (const s of byScore) {
    if (medalIdx >= 3) break;
    if (!s.isDead && s.rd.score >= 40) {
      medals.set(s, MEDAL[medalIdx]);
      medalIdx++;
    }
  }
  return medals;
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
