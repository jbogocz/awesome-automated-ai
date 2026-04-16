# Collapsible Cards README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace table-based project listings with `<details><summary>` collapsible cards showing traffic-light health dot, quality score, KPI badges, and expandable dashboard with tags.

**Architecture:** Extract formatting helpers into a new `formatters.ts` module. Extend API data with GitHub topics. Rewrite the readme generator's `buildTable` into `buildCards` producing HTML `<details>` blocks. Update header legend and populate tags in YAML.

**Tech Stack:** TypeScript, Vitest 4.1.3, yaml parser, gh CLI, pnpm monorepo

---

## File Structure

| File | Action | Responsibility |
|:-----|:-------|:---------------|
| `engine/src/generator/formatters.ts` | Create | Pure formatting helpers: stars abbreviation, progress bar, activity dot, tagline, date |
| `engine/tests/generator/formatters.test.ts` | Create | Unit tests for all formatters |
| `engine/src/generator/readme.ts` | Modify | Replace `buildTable` with `buildCards`, update `generateReadme`, add `tags` to Entry interface, add `topics` to ApiRepoData |
| `engine/tests/generator/readme.test.ts` | Modify | Rewrite all tests for card output |
| `engine/src/generator/fetch-api.ts` | Modify | Add topics fetch to `fetchOneRepo`, add `topics` to RawApiResult and ApiData |
| `config/header.md` | Modify | Replace legend table with new symbols |
| `projects.yaml` | Modify | Add `tags` arrays to all 203 entries |
| `scripts/fetch-tags.sh` | Create | One-time script to fetch GitHub topics and patch YAML |

---

### Task 1: Formatter Helpers

**Files:**
- Create: `engine/src/generator/formatters.ts`
- Create: `engine/tests/generator/formatters.test.ts`

- [ ] **Step 1: Write failing tests for `formatStarsShort`**

```typescript
// engine/tests/generator/formatters.test.ts
import { describe, expect, it } from "vitest";
import { formatStarsShort, progressBar, activityDot, generateTagline, formatDateMonth } from "../../src/generator/formatters.js";

describe("formatStarsShort", () => {
  it("returns exact number below 1K", () => {
    expect(formatStarsShort(449)).toBe("449");
    expect(formatStarsShort(0)).toBe("0");
    expect(formatStarsShort(999)).toBe("999");
  });
  it("formats thousands as K with one decimal", () => {
    expect(formatStarsShort(1000)).toBe("1.0K");
    expect(formatStarsShort(4320)).toBe("4.3K");
    expect(formatStarsShort(11665)).toBe("11.7K");
    expect(formatStarsShort(69721)).toBe("69.7K");
  });
  it("formats millions as M with one decimal", () => {
    expect(formatStarsShort(1200000)).toBe("1.2M");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx vitest run tests/generator/formatters.test.ts`
Expected: FAIL - module not found

- [ ] **Step 3: Implement `formatStarsShort`**

```typescript
// engine/src/generator/formatters.ts
export function formatStarsShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx vitest run tests/generator/formatters.test.ts`
Expected: PASS

- [ ] **Step 5: Add failing tests for `progressBar`**

Append to `engine/tests/generator/formatters.test.ts`:

```typescript
describe("progressBar", () => {
  it("renders full bar for score 100", () => {
    expect(progressBar(100)).toBe("██████████");
  });
  it("renders empty bar for score 0", () => {
    expect(progressBar(0)).toBe("░░░░░░░░░░");
  });
  it("renders partial block for score with remainder >= 5", () => {
    expect(progressBar(88)).toBe("████████▓░");
    expect(progressBar(55)).toBe("█████▓░░░░");
    expect(progressBar(5)).toBe("▓░░░░░░░░░");
  });
  it("no partial block when remainder < 5", () => {
    expect(progressBar(60)).toBe("██████░░░░");
    expect(progressBar(22)).toBe("██░░░░░░░░");
  });
});
```

- [ ] **Step 6: Implement `progressBar`**

Append to `engine/src/generator/formatters.ts`:

```typescript
export function progressBar(score: number): string {
  const filled = Math.floor(score / 10);
  const partial = score % 10 >= 5 ? 1 : 0;
  const empty = 10 - filled - partial;
  return "\u2588".repeat(filled) + "\u2593".repeat(partial) + "\u2591".repeat(empty);
}
```

- [ ] **Step 7: Run tests - all pass**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx vitest run tests/generator/formatters.test.ts`

- [ ] **Step 8: Add failing tests for `activityDot`**

Append to `engine/tests/generator/formatters.test.ts`:

```typescript
describe("activityDot", () => {
  it("returns green for recent activity (<6 months)", () => {
    const recent = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    expect(activityDot(recent, false)).toBe("\uD83D\uDFE2");
  });
  it("returns yellow for stale activity (6-12 months)", () => {
    const stale = new Date(Date.now() - 250 * 24 * 60 * 60 * 1000).toISOString();
    expect(activityDot(stale, false)).toBe("\uD83D\uDFE1");
  });
  it("returns red for dead activity (>12 months)", () => {
    const dead = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString();
    expect(activityDot(dead, false)).toBe("\uD83D\uDD34");
  });
  it("returns red for archived regardless of date", () => {
    const recent = new Date().toISOString();
    expect(activityDot(recent, true)).toBe("\uD83D\uDD34");
  });
  it("returns red for empty pushed", () => {
    expect(activityDot("", false)).toBe("\uD83D\uDD34");
  });
});
```

- [ ] **Step 9: Implement `activityDot`**

Append to `engine/src/generator/formatters.ts`:

```typescript
export function activityDot(pushed: string, archived: boolean): string {
  if (archived || !pushed) return "\uD83D\uDD34";
  try {
    const days = (Date.now() - new Date(pushed).getTime()) / (24 * 60 * 60 * 1000);
    if (days < 180) return "\uD83D\uDFE2";
    if (days < 365) return "\uD83D\uDFE1";
    return "\uD83D\uDD34";
  } catch {
    return "\uD83D\uDD34";
  }
}
```

- [ ] **Step 10: Run tests - all pass**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx vitest run tests/generator/formatters.test.ts`

- [ ] **Step 11: Add failing tests for `generateTagline`**

Append to `engine/tests/generator/formatters.test.ts`:

```typescript
describe("generateTagline", () => {
  it("truncates at first period followed by space", () => {
    expect(generateTagline("Declarative deep learning framework. Now under LF.")).toBe(
      "Declarative deep learning framework",
    );
  });
  it("truncates at first comma followed by space", () => {
    expect(generateTagline("Multi-layer stack ensembling for tabular, text, image")).toBe(
      "Multi-layer stack ensembling for tabular",
    );
  });
  it("caps at maxLen with ellipsis", () => {
    const long = "A".repeat(100);
    expect(generateTagline(long, 80)).toBe("A".repeat(77) + "...");
  });
  it("escapes ampersand", () => {
    expect(generateTagline("Training & tuning. Done.")).toBe("Training &amp; tuning");
  });
  it("returns full text if no sentence boundary and under limit", () => {
    expect(generateTagline("Short description")).toBe("Short description");
  });
});
```

- [ ] **Step 12: Implement `generateTagline`**

Append to `engine/src/generator/formatters.ts`:

```typescript
export function generateTagline(description: string, maxLen = 80): string {
  const match = description.match(/^(.+?)[.,]\s/);
  let tagline = match ? match[1] : description;
  if (tagline.length > maxLen) {
    tagline = tagline.slice(0, maxLen - 3) + "...";
  }
  return tagline.replace(/&/g, "&amp;");
}
```

- [ ] **Step 13: Add failing tests for `formatDateMonth`**

Append to `engine/tests/generator/formatters.test.ts`:

```typescript
describe("formatDateMonth", () => {
  it("formats ISO date as Mon YYYY", () => {
    expect(formatDateMonth("2026-04-15T00:00:00Z")).toBe("Apr 2026");
    expect(formatDateMonth("2025-12-01T00:00:00Z")).toBe("Dec 2025");
    expect(formatDateMonth("2023-02-28T00:00:00Z")).toBe("Feb 2023");
  });
  it("returns - for empty string", () => {
    expect(formatDateMonth("")).toBe("-");
  });
});
```

- [ ] **Step 14: Implement `formatDateMonth`**

Append to `engine/src/generator/formatters.ts`:

```typescript
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDateMonth(pushed: string): string {
  if (!pushed) return "-";
  try {
    const d = new Date(pushed);
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  } catch {
    return "-";
  }
}
```

- [ ] **Step 15: Run all formatter tests - all pass**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx vitest run tests/generator/formatters.test.ts`
Expected: 5 describe blocks, all PASS

- [ ] **Step 16: Commit**

```bash
git add engine/src/generator/formatters.ts engine/tests/generator/formatters.test.ts
git commit -m "feat: add card formatting helpers with tests

formatStarsShort, progressBar, activityDot, generateTagline, formatDateMonth"
```

---

### Task 2: Extend API with Topics

**Files:**
- Modify: `engine/src/generator/fetch-api.ts`
- Modify: `engine/src/generator/readme.ts` (interface only)

- [ ] **Step 1: Add `topics` to interfaces**

In `engine/src/generator/fetch-api.ts`, change `RawApiResult`:

```typescript
interface RawApiResult {
  stars: number;
  pushed: string;
  archived: boolean;
  license: string | null;
  topics: string[];
}
```

In `engine/src/generator/readme.ts`, change `ApiRepoData`:

```typescript
export interface ApiRepoData {
  stars: number;
  pushed: string;
  archived: boolean;
  license: string | null;
  trend: number | null;
  score: number;
  topics: string[];
}
```

- [ ] **Step 2: Update `fetchOneRepo` to fetch topics**

In `engine/src/generator/fetch-api.ts`, update the `--jq` query in `fetchOneRepo` to include topics:

```typescript
function fetchOneRepo(repo: string): RawApiResult {
  try {
    const result = execFileSync(
      "gh",
      [
        "api",
        `repos/${repo}`,
        "--jq",
        "{stars: .stargazers_count, pushed: .pushed_at, archived: .archived, license: .license.spdx_id, topics: .topics}",
      ],
      { timeout: 15_000, encoding: "utf-8" },
    );
    const parsed = JSON.parse(result);
    const pushed = fetchLastActivity(repo) || parsed.pushed || "";
    return {
      stars: parsed.stars ?? 0,
      pushed,
      archived: parsed.archived ?? false,
      license: parsed.license ?? null,
      topics: parsed.topics ?? [],
    };
  } catch {
    return { stars: 0, pushed: "", archived: false, license: null, topics: [] };
  }
}
```

- [ ] **Step 3: Pass `topics` through to ApiData**

In `engine/src/generator/fetch-api.ts`, update the data assignment in `fetchRepoData`:

```typescript
    data[repo] = {
      stars: raw.stars,
      pushed: raw.pushed,
      archived: raw.archived,
      license: raw.license,
      trend,
      score,
      topics: raw.topics,
    };
```

- [ ] **Step 4: Update cli.ts apiData type to include topics**

In `engine/src/cli.ts`, update the type annotation on line 34:

```typescript
    let apiData: Record<string, { stars: number; pushed: string; archived: boolean; license?: string | null; trend?: number | null; score?: number; topics?: string[] }>;
```

- [ ] **Step 5: Run existing tests to confirm nothing breaks**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx vitest run`
Expected: All 17 existing tests PASS (readme tests still use old format but don't check topics)

- [ ] **Step 6: Commit**

```bash
git add engine/src/generator/fetch-api.ts engine/src/generator/readme.ts engine/src/cli.ts
git commit -m "feat: extend API data with GitHub topics

Add topics field to RawApiResult, ApiRepoData, and jq query"
```

---

### Task 3: Rewrite README Generator for Cards

**Files:**
- Modify: `engine/src/generator/readme.ts`
- Modify: `engine/tests/generator/readme.test.ts`

This is the main rewrite. Replace table output with `<details><summary>` cards.

- [ ] **Step 1: Write new tests for card output**

Replace the entire content of `engine/tests/generator/readme.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { type ApiData, generateReadme } from "../../src/generator/readme.js";

const SAMPLE_YAML = `categories:
- name: General-Purpose AutoML
  description: End-to-end frameworks.
  entries:
  - name: AutoGluon
    repo: autogluon/autogluon
    description: Multi-layer stack ensembling for tabular, text, and image.
    tags: [tabular, text, image, ensembling]
  - name: PyCaret
    repo: pycaret/pycaret
    description: Low-code ML library.
  - name: OldTool
    repo: old/tool
    description: Legacy framework from the old days.
    note: Historical.
`;

const now = new Date().toISOString();
const stale = "2022-01-01T00:00:00Z";

const SAMPLE_API: ApiData = {
  "autogluon/autogluon": { stars: 12000, pushed: now, archived: false, license: "Apache-2.0", trend: 340, score: 88, topics: ["automl", "machine-learning"] },
  "pycaret/pycaret": { stars: 9500, pushed: now, archived: false, license: "MIT", trend: 5, score: 75, topics: ["automl", "low-code"] },
  "old/tool": { stars: 500, pushed: stale, archived: false, license: null, trend: null, score: 10, topics: [] },
};

const HEADER = "# Awesome AutoML\n\n## Contents\n";
const FOOTER = "## Contributing\n\nContributions welcome!";

describe("generateReadme", () => {
  it("produces details/summary cards instead of tables", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("<details><summary>");
    expect(result).toContain("</details>");
    expect(result).not.toContain("| Project |");
  });

  it("shows activity dot and score before project name", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toMatch(/\uD83D\uDFE2 <b>88<\/b>/);
  });

  it("shows stars in short K format in summary", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("12.0K");
    expect(result).toContain("9.5K");
  });

  it("shows trend badge only when abs >= 10", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("+340");
    const pycaretSummary = result.split("PyCaret")[1]?.split("</summary>")[0] ?? "";
    expect(pycaretSummary).not.toContain("+5");
  });

  it("shows tagline in summary from description", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("Multi-layer stack ensembling for tabular");
  });

  it("renders progress bar in details dashboard", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2593\u2591");
    expect(result).toContain("88/100");
  });

  it("shows exact stars with trend in details", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("12,000 (+340 last 30d)");
  });

  it("shows tags from YAML in dashboard", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("tabular \u00B7 text \u00B7 image \u00B7 ensembling");
  });

  it("falls back to API topics when no YAML tags", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    const pycaretCard = result.split("PyCaret")[1]?.split("</details>")[0] ?? "";
    expect(pycaretCard).toContain("automl \u00B7 low-code");
  });

  it("renders dead projects with red dot and italic name", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toMatch(/\uD83D\uDD34 <b>10<\/b>/);
    expect(result).toContain("<i><a href=");
  });

  it("separates active and dead with horizontal rule", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    const catSection = result.split("## General-Purpose AutoML")[1]?.split("## Contributing")[0] ?? "";
    expect(catSection).toContain("\n---\n");
  });

  it("assigns medal after score for top entries", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("\uD83E\uDD47");
  });

  it("shows n/a trend for dead projects in dashboard", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    const oldCard = result.split("OldTool")[1]?.split("</details>")[0] ?? "";
    expect(oldCard).toContain("(n/a)");
  });

  it("sorts by score descending", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    const autogluonIdx = result.indexOf("AutoGluon");
    const pycaretIdx = result.indexOf("PyCaret");
    const oldIdx = result.indexOf("OldTool");
    expect(autogluonIdx).toBeLessThan(pycaretIdx);
    expect(pycaretIdx).toBeLessThan(oldIdx);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx vitest run tests/generator/readme.test.ts`
Expected: Most tests FAIL (old table format still in place)

- [ ] **Step 3: Rewrite `readme.ts`**

Replace the entire content of `engine/src/generator/readme.ts` with:

```typescript
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

  const desc = entry.description ?? "";
  const fullDesc = note ? `${desc} **${note}**` : desc;
  const displayDesc = isDead ? `*${fullDesc}*` : fullDesc;

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
```

- [ ] **Step 4: Run tests**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx vitest run tests/generator/readme.test.ts`
Expected: All 14 tests PASS

- [ ] **Step 5: Run all tests to check nothing else broke**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx vitest run`
Expected: All tests PASS (formatters + readme + quality)

- [ ] **Step 6: Commit**

```bash
git add engine/src/generator/readme.ts engine/tests/generator/readme.test.ts
git commit -m "feat: rewrite README generator for collapsible card format

Replace table output with <details><summary> cards showing activity dot,
quality score, KPI badges, tagline, and expandable dashboard with progress
bar, exact stats, and tags."
```

---

### Task 4: Update Header Legend

**Files:**
- Modify: `config/header.md`

- [ ] **Step 1: Replace legend table in `config/header.md`**

Replace lines 79-92 (the current `### Legend` section through the end of the table) with:

```markdown
### Legend

| Symbol | Meaning |
|:-------|:--------|
| \uD83D\uDFE2 \uD83D\uDFE1 \uD83D\uDD34 | Project health: active (< 6 months) / stale (6-12 months) / unmaintained (> 12 months) |
| **88** | Quality score (0-100) based on stars, trend, freshness, license, and archived status |
| \uD83E\uDD47 \uD83E\uDD48 \uD83E\uDD49 | Top 3 quality score per category |
| \u2B50 11.7K | GitHub stars |
| \u2197\uFE0F +340 | Stars gained in last 30 days (shown when >= 10) |
| \u{1F4A4} | Unmaintained - no activity for 12+ months |
| \u{1F5C4}\uFE0F | Historical - included for foundational influence |
| `Apache-2.0` | SPDX license identifier |

> Click any project to expand its full dashboard with quality bar, exact stats, and tags.
```

- [ ] **Step 2: Remove the Quick Comparison table**

Delete lines 93-105 (the `### Quick Comparison: General-Purpose AutoML` section with shields.io badges). This is replaced by the card format which shows the same data inline.

- [ ] **Step 3: Verify README generates correctly**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx vitest run`
Expected: All tests PASS

- [ ] **Step 4: Commit**

```bash
git add config/header.md
git commit -m "feat: update header legend for collapsible card format

Replace old table legend with new symbols (activity dots, score, badges).
Remove Quick Comparison table (redundant with card format)."
```

---

### Task 5: Populate Tags in projects.yaml

**Files:**
- Create: `scripts/fetch-tags.sh`
- Modify: `projects.yaml`

- [ ] **Step 1: Create tag-fetching script**

```bash
#!/usr/bin/env bash
# scripts/fetch-tags.sh
# Fetches GitHub topics for all repos in projects.yaml and outputs YAML-ready tags.
# Usage: bash scripts/fetch-tags.sh

set -euo pipefail

grep 'repo:' projects.yaml | sed 's/.*repo: //' | while read -r repo; do
  topics=$(gh api "repos/$repo" --jq '.topics | join(", ")' 2>/dev/null || echo "")
  if [ -n "$topics" ]; then
    echo "$repo: [$topics]"
  else
    echo "$repo: []"
  fi
  sleep 0.5
done
```

- [ ] **Step 2: Run the script and capture output**

Run: `cd /home/jbogocz/Repos/awesome-automl && bash scripts/fetch-tags.sh > data/repo-topics.txt`

This creates a reference file mapping repos to their GitHub topics.

- [ ] **Step 3: Add tags to projects.yaml entries**

Using the output from `data/repo-topics.txt`, add `tags:` arrays to each entry in `projects.yaml`. Example transformation:

Before:
```yaml
  - name: Ludwig
    repo: ludwig-ai/ludwig
    description: Declarative deep learning framework...
```

After:
```yaml
  - name: Ludwig
    repo: ludwig-ai/ludwig
    description: Declarative deep learning framework...
    tags: [deep-learning, fine-tuning, llm, tabular, yaml]
```

Use the GitHub topics as-is. If a repo has no topics, omit the `tags` field (the generator falls back to API topics at runtime).

- [ ] **Step 4: Verify YAML is valid**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && node -e "const y=require('yaml');const fs=require('fs');const d=y.parse(fs.readFileSync('../projects.yaml','utf-8'));console.log(d.categories.length+' categories loaded')"`

Expected: `25 categories loaded` (no parse errors)

- [ ] **Step 5: Run full test suite**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx vitest run`
Expected: All tests PASS

- [ ] **Step 6: Commit**

```bash
git add scripts/fetch-tags.sh projects.yaml data/repo-topics.txt
git commit -m "feat: add tags to projects.yaml from GitHub topics

Fetch GitHub repo topics for all 203 entries and add as tags arrays.
Include fetch script for future updates."
```

---

### Task 6: Integration Test - Generate and Verify

**Files:**
- None created - verification only

- [ ] **Step 1: Run full README generation with cached data**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx tsx src/cli.ts generate --no-fetch`

If no cache exists, run without `--no-fetch` (requires `gh` auth):
Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx tsx src/cli.ts generate`

Expected: `Generated README.md` with no errors.

- [ ] **Step 2: Verify README structure**

Check the generated README.md for:
- `<details><summary>` blocks present
- No `| Project |` table headers
- Activity dots (\uD83D\uDFE2 \uD83D\uDFE1 \uD83D\uDD34) visible
- Score numbers before project names
- Progress bars in expanded sections
- Tags in dashboard blocks
- `---` separating active from dead in categories
- Back to Contents links still work

Run: `grep -c '<details>' /home/jbogocz/Repos/awesome-automl/README.md`
Expected: ~203 (one per project)

Run: `grep -c '| Project |' /home/jbogocz/Repos/awesome-automl/README.md`
Expected: 0

- [ ] **Step 3: Run full test suite one final time**

Run: `cd /home/jbogocz/Repos/awesome-automl/engine && npx vitest run`
Expected: All tests PASS

- [ ] **Step 4: Commit generated README**

```bash
git add README.md
git commit -m "feat: generate README with collapsible card format

Traffic-light dots, quality scores, KPI badges, expandable dashboards
with progress bars, exact stats, and tags for all 203 projects."
```
