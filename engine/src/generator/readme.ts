import { parse as parseYaml } from "yaml";

export interface ApiRepoData {
  stars: number;
  pushed: string;
  archived: boolean;
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

const SHIELDS = "https://img.shields.io";
const BADGE_STYLE = "flat-square";

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
      parts.push("| Project | \u2b50 | Updated | Description |");
      parts.push("|:--------|:---|:--------|:------------|");
      for (const row of buildTable(entries, apiData)) parts.push(row);
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

function buildTable(entries: Entry[], apiData: ApiData): string[] {
  const rows: [number, string][] = [];
  for (const entry of entries) {
    const repo = entry.repo ?? "";
    const rd = apiData[repo] ?? { stars: 0, pushed: "", archived: false };
    const url = entry.url ?? `https://github.com/${repo}`;
    const desc = entry.description ?? "";
    let note = entry.note ?? "";
    if (rd.archived && !note.includes("Archived")) note = `Archived. ${note}`.trim();
    else if (!note && isUnmaintained(rd.pushed)) note = "Unmaintained \u2014 no commits for 12+ months.";
    const fullDesc = note ? `${desc} **${note}**` : desc;
    const starsBadge = repo ? `![](${SHIELDS}/github/stars/${repo}?style=${BADGE_STYLE}&label=&color=blue)` : "\u2014";
    const commitBadge = repo
      ? `![](${SHIELDS}/github/last-commit/${repo}?style=${BADGE_STYLE}&label=&color=green)`
      : "\u2014";
    rows.push([rd.stars, `| [${entry.name}](${url}) | ${starsBadge} | ${commitBadge} | ${fullDesc} |`]);
  }
  rows.sort((a, b) => b[0] - a[0]);
  return rows.map((r) => r[1]);
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
