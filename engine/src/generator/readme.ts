import { parse as parseYaml } from "yaml";

export interface ApiRepoData {
  stars: number;
  pushed: string;
  archived: boolean;
  license: string | null;
  trend: number | null;
  score: number;
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
}
interface Category {
  name: string;
  description?: string;
  entries?: Entry[];
}

const MEDAL = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];
const SLEEPING = "\u{1F4A4}";
const HISTORICAL = "\u{1F5C4}\uFE0F";
const LEGEND =
  "> \u{1F947}\u{1F948}\u{1F949} quality score (top 3) | \u2197\uFE0F stars/30d | \u2194\uFE0F stable | \u{1F4A4} unmaintained | \u{1F5C4}\uFE0F historical";

export function generateReadme(opts: GenerateOptions): string {
  const { yamlContent, header, footer, apiData } = opts;
  const doc = parseYaml(yamlContent) as { categories: Category[] };
  const categories = doc.categories;

  const parts: string[] = [];
  parts.push(replaceHeaderBadges(header, apiData).trimEnd(), "");

  for (const cat of categories) {
    parts.push(`## ${cat.name}`, "");
    if (cat.description) parts.push(`*${cat.description}*`, "");
    const entries = cat.entries ?? [];
    if (entries.length > 0) {
      parts.push("| Project | Stars | Updated | License | Description |");
      parts.push("|:--------|------:|:--------|:--------|:------------|");
      for (const row of buildTable(entries, apiData)) parts.push(row);
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

function buildTable(entries: Entry[], apiData: ApiData): string[] {
  const scored: ScoredEntry[] = entries.map((entry) => {
    const repo = entry.repo ?? "";
    const rd = apiData[repo] ?? {
      stars: 0,
      pushed: "",
      archived: false,
      license: null,
      trend: null,
      score: 0,
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

  scored.sort((a, b) => b.rd.stars - a.rd.stars);

  return scored.map((s) => {
    const { entry, rd, note, isDead, isHistorical } = s;
    const repo = entry.repo ?? "";
    const url = entry.url ?? `https://github.com/${repo}`;
    const desc = entry.description ?? "";
    const fullDesc = note ? `${desc} **${note}**` : desc;

    let badge = "";
    if (isDead && isHistorical) badge = ` ${HISTORICAL}`;
    else if (isDead) badge = ` ${SLEEPING}`;
    else if (medals.has(s)) badge = ` ${medals.get(s)}`;

    const trendText = !isDead ? formatTrend(rd.trend) : "";
    const projectCol = isDead
      ? `*[${entry.name}](${url})*${badge}`
      : `[${entry.name}](${url})${badge}${trendText}`;

    const starsText = repo ? formatStars(rd.stars) : "-";
    const commitText = repo ? formatDate(rd.pushed) : "-";
    const licenseText = rd.license ? `\`${rd.license}\`` : "-";

    if (isDead) {
      return `| ${projectCol} | *${starsText}* | *${commitText}* | ${licenseText} | *${fullDesc}* |`;
    }
    return `| ${projectCol} | ${starsText} | ${commitText} | ${licenseText} | ${fullDesc} |`;
  });
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

function formatTrend(trend: number | null): string {
  if (trend === null) return "";
  if (trend >= 10) return ` <sup>\u2197\uFE0F ${trend}</sup>`;
  if (trend <= -10) return ` <sup>\u2198\uFE0F ${Math.abs(trend)}</sup>`;
  return ` <sup>\u2194\uFE0F</sup>`;
}

function isUnmaintained(pushed: string, months = 12): boolean {
  if (!pushed) return true;
  try {
    return (
      Date.now() - new Date(pushed).getTime() > months * 30 * 24 * 60 * 60 * 1000
    );
  } catch {
    return false;
  }
}

function replaceHeaderBadges(header: string, apiData: ApiData): string {
  return header
    .replace(
      /!\[\]\(https:\/\/img\.shields\.io\/github\/stars\/([^?]+)\?[^)]+\)/g,
      (_match, repo) => {
        const rd = apiData[repo];
        return rd ? formatStars(rd.stars) : "-";
      },
    )
    .replace(
      /!\[\]\(https:\/\/img\.shields\.io\/github\/last-commit\/([^?]+)\?[^)]+\)/g,
      (_match, repo) => {
        const rd = apiData[repo];
        return rd ? formatDate(rd.pushed) : "-";
      },
    );
}

function formatStars(n: number): string {
  return n.toLocaleString("en-US");
}

function formatDate(pushed: string): string {
  if (!pushed) return "-";
  try {
    const d = new Date(pushed);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  } catch {
    return "-";
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
