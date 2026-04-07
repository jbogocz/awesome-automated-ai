# Enriched README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the README from a 4-column table into a 6-column data-rich format with quality scores, star trends, license info, and medal rankings.

**Architecture:** Extend the existing `generate` pipeline. Add `license` to the GitHub API fetch, store star snapshots in SQLite for trend calculation, compute quality scores in a new module, and rewrite the table renderer to produce the enriched 6-column format. No new dependencies.

**Tech Stack:** TypeScript, better-sqlite3 (existing), vitest (existing), GitHub CLI (`gh api`)

---

## File Structure

| File | Responsibility |
|:-----|:---------------|
| `engine/src/scoring/quality.ts` | **NEW** - Quality score algorithm (stars, trend, freshness, license, archived) |
| `engine/src/generator/fetch-api.ts` | **MODIFY** - Add license to API query, write/read SQLite snapshots, compute trend |
| `engine/src/generator/readme.ts` | **MODIFY** - 6-column table, medals, trend arrows, italic unmaintained, legend |
| `engine/src/db/client.ts` | **MODIFY** - Add `upsertProject`, `insertSnapshot`, `getPreviousStars` methods |
| `engine/tests/scoring/quality.test.ts` | **NEW** - Tests for quality score |
| `engine/tests/generator/readme.test.ts` | **MODIFY** - Update for new table format |
| `config/header.md` | **MODIFY** - Update Legend table |

---

### Task 1: Quality Score Module

**Files:**
- Create: `engine/src/scoring/quality.ts`
- Create: `engine/tests/scoring/quality.test.ts`

- [ ] **Step 1: Write failing tests for quality score**

```typescript
// engine/tests/scoring/quality.test.ts
import { describe, expect, it } from "vitest";
import { computeQualityScore, type QualityInput } from "../../src/scoring/quality.js";

describe("computeQualityScore", () => {
  it("scores a healthy active project high", () => {
    const input: QualityInput = {
      stars: 10000,
      starsPrevious: 9700,
      pushedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      license: "MIT",
      archived: false,
    };
    const score = computeQualityScore(input);
    expect(score).toBeGreaterThanOrEqual(70);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("scores an unmaintained project low", () => {
    const input: QualityInput = {
      stars: 500,
      starsPrevious: 510,
      pushedAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      license: null,
      archived: false,
    };
    const score = computeQualityScore(input);
    expect(score).toBeLessThan(30);
  });

  it("gives neutral trend when no previous data", () => {
    const input: QualityInput = {
      stars: 5000,
      starsPrevious: null,
      pushedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      license: "Apache-2.0",
      archived: false,
    };
    const score = computeQualityScore(input);
    expect(score).toBeGreaterThanOrEqual(50);
  });

  it("penalizes archived projects", () => {
    const active: QualityInput = {
      stars: 5000,
      starsPrevious: 4900,
      pushedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      license: "MIT",
      archived: false,
    };
    const archived: QualityInput = { ...active, archived: true };
    expect(computeQualityScore(active)).toBeGreaterThan(computeQualityScore(archived));
  });

  it("clamps score between 0 and 100", () => {
    const extreme: QualityInput = {
      stars: 999999,
      starsPrevious: 1,
      pushedAt: new Date().toISOString(),
      license: "MIT",
      archived: false,
    };
    expect(computeQualityScore(extreme)).toBeLessThanOrEqual(100);
    expect(computeQualityScore(extreme)).toBeGreaterThanOrEqual(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd engine && npx vitest run tests/scoring/quality.test.ts`
Expected: FAIL - cannot find module `../../src/scoring/quality.js`

- [ ] **Step 3: Implement the quality score module**

```typescript
// engine/src/scoring/quality.ts
export interface QualityInput {
  stars: number;
  starsPrevious: number | null;
  pushedAt: string;
  license: string | null;
  archived: boolean;
}

export function computeQualityScore(input: QualityInput): number {
  const starsScore = Math.min((Math.log10(Math.max(input.stars, 1)) / 5) * 100, 100);

  let trendScore: number;
  if (input.starsPrevious === null) {
    trendScore = 50;
  } else {
    const prev = Math.max(input.starsPrevious, 1);
    trendScore = clamp(((input.stars - prev) / prev) * 1000, 0, 100);
  }

  const freshnessScore = scoreFreshness(input.pushedAt);
  const licenseScore = input.license ? 100 : 0;
  const archivedScore = input.archived ? 0 : 100;

  const raw =
    starsScore * 0.25 +
    trendScore * 0.25 +
    freshnessScore * 0.3 +
    licenseScore * 0.1 +
    archivedScore * 0.1;

  return clamp(Math.round(raw), 0, 100);
}

function scoreFreshness(pushedAt: string): number {
  if (!pushedAt) return 0;
  try {
    const days = (Date.now() - new Date(pushedAt).getTime()) / (24 * 60 * 60 * 1000);
    if (days < 30) return 100;
    if (days < 90) return 80;
    if (days < 180) return 60;
    if (days < 365) return 30;
    return 0;
  } catch {
    return 0;
  }
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd engine && npx vitest run tests/scoring/quality.test.ts`
Expected: All 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add engine/src/scoring/quality.ts engine/tests/scoring/quality.test.ts
git commit -m "feat: add quality score module for enriched README"
```

---

### Task 2: Extend DB Client with Snapshot Methods

**Files:**
- Modify: `engine/src/db/client.ts`

- [ ] **Step 1: Add `upsertProject`, `insertSnapshot`, and `getPreviousStars` methods to `DB` class**

Add these methods at the end of the `DB` class in `engine/src/db/client.ts`, before the `close()` method:

```typescript
  upsertProject(repo: string, name: string): number {
    const existing = this.sqlite
      .prepare("SELECT id FROM projects WHERE repo = ?")
      .get(repo) as { id: number } | undefined;
    if (existing) return existing.id;
    const info = this.sqlite
      .prepare(
        "INSERT INTO projects (repo, name, status, discovered_via) VALUES (?, ?, 'listed', 'github')",
      )
      .run(repo, name);
    return Number(info.lastInsertRowid);
  }

  insertSnapshot(projectId: number, stars: number, score: number): void {
    const today = new Date().toISOString().split("T")[0];
    this.sqlite
      .prepare(
        `INSERT OR REPLACE INTO snapshots (project_id, snapshot_date, stars, composite_score)
         VALUES (?, ?, ?, ?)`,
      )
      .run(projectId, today, stars, score);
  }

  getPreviousStars(projectId: number): number | null {
    const today = new Date().toISOString().split("T")[0];
    const row = this.sqlite
      .prepare(
        `SELECT stars FROM snapshots
         WHERE project_id = ? AND snapshot_date < ?
         ORDER BY snapshot_date DESC LIMIT 1`,
      )
      .get(projectId, today) as { stars: number } | undefined;
    return row?.stars ?? null;
  }
```

- [ ] **Step 2: Run existing tests to verify nothing is broken**

Run: `cd engine && npx vitest run`
Expected: All existing tests PASS (no tests for these methods yet - they will be exercised through integration in Task 4)

- [ ] **Step 3: Commit**

```bash
git add engine/src/db/client.ts
git commit -m "feat: add snapshot DB methods for star trend tracking"
```

---

### Task 3: Extend API Fetch with License and Snapshots

**Files:**
- Modify: `engine/src/generator/fetch-api.ts`
- Modify: `engine/src/generator/readme.ts` (only the `ApiRepoData` interface)

- [ ] **Step 1: Update the `ApiRepoData` interface in `readme.ts`**

In `engine/src/generator/readme.ts`, replace the existing `ApiRepoData` interface:

```typescript
export interface ApiRepoData {
  stars: number;
  pushed: string;
  archived: boolean;
  license: string | null;
  trend: number | null;
  score: number;
}
```

- [ ] **Step 2: Rewrite `fetch-api.ts` to collect license, write snapshots, and compute scores**

Replace the entire content of `engine/src/generator/fetch-api.ts`:

```typescript
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { DB } from "../db/client.js";
import { computeQualityScore } from "../scoring/quality.js";
import type { ApiData } from "./readme.js";

interface RawApiResult {
  stars: number;
  pushed: string;
  archived: boolean;
  license: string | null;
}

export function fetchRepoData(yamlContent: string): ApiData {
  const doc = parseYaml(yamlContent) as {
    categories: { entries?: { repo?: string; name?: string }[] }[];
  };
  const repos: { repo: string; name: string }[] = [];
  for (const cat of doc.categories) {
    for (const entry of cat.entries ?? []) {
      if (entry.repo) repos.push({ repo: entry.repo, name: entry.name ?? entry.repo });
    }
  }
  console.log(`Fetching data for ${repos.length} repos...`);

  const dbPath = resolve(import.meta.dirname, "../../../data/curator.db");
  const db = new DB(dbPath);
  db.migrate();

  const data: ApiData = {};
  for (const { repo, name } of repos) {
    const raw = fetchOneRepo(repo);
    const projectId = db.upsertProject(repo, name);
    const starsPrevious = db.getPreviousStars(projectId);
    const trend = starsPrevious !== null ? raw.stars - starsPrevious : null;
    const score = computeQualityScore({
      stars: raw.stars,
      starsPrevious,
      pushedAt: raw.pushed,
      license: raw.license,
      archived: raw.archived,
    });
    db.insertSnapshot(projectId, raw.stars, score);
    data[repo] = {
      stars: raw.stars,
      pushed: raw.pushed,
      archived: raw.archived,
      license: raw.license,
      trend,
      score,
    };
  }

  db.close();
  return data;
}

function fetchOneRepo(repo: string): RawApiResult {
  try {
    const result = execFileSync(
      "gh",
      [
        "api",
        `repos/${repo}`,
        "--jq",
        "{stars: .stargazers_count, pushed: .pushed_at, archived: .archived, license: .license.spdx_id}",
      ],
      { timeout: 15_000, encoding: "utf-8" },
    );
    const parsed = JSON.parse(result);
    return {
      stars: parsed.stars ?? 0,
      pushed: parsed.pushed ?? "",
      archived: parsed.archived ?? false,
      license: parsed.license ?? null,
    };
  } catch {
    return { stars: 0, pushed: "", archived: false, license: null };
  }
}
```

- [ ] **Step 3: Update `cli.ts` to handle the new `license` field in cache read/write**

In `engine/src/cli.ts`, the `--no-fetch` path reads cached JSON. The cache now includes `license`, `trend`, and `score`. No code change is needed for writing (JSON.stringify handles new fields). But reading old cache without these fields needs a fallback.

Replace the `apiData` type annotation in `cli.ts`:

Find this line:
```typescript
    let apiData: Record<string, { stars: number; pushed: string; archived: boolean }>;
```

Replace with:
```typescript
    let apiData: Record<string, { stars: number; pushed: string; archived: boolean; license?: string | null; trend?: number | null; score?: number }>;
```

- [ ] **Step 4: Run tests to verify nothing breaks**

Run: `cd engine && npx vitest run`
Expected: All tests PASS (readme tests still pass because `ApiRepoData` now has more fields but old test data spreads are compatible - test data will be updated in Task 5)

- [ ] **Step 5: Commit**

```bash
git add engine/src/generator/fetch-api.ts engine/src/generator/readme.ts engine/src/cli.ts
git commit -m "feat: extend API fetch with license, SQLite snapshots, and quality score"
```

---

### Task 4: Rewrite README Table Renderer

**Files:**
- Modify: `engine/src/generator/readme.ts`

- [ ] **Step 1: Replace the `buildTable` function and related helpers**

Replace the entire content of `engine/src/generator/readme.ts` with:

```typescript
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
      parts.push("| # | Project | Stars | Updated | License | Description |");
      parts.push("|:--|:--------|------:|:--------|:--------|:------------|");
      for (const row of buildTable(entries, apiData)) parts.push(row);
      parts.push("", LEGEND);
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

  scored.sort((a, b) => b.rd.score - a.rd.score);

  const medals = assignMedals(scored);

  return scored.map((s, i) => {
    const { entry, rd, note, isDead, isHistorical } = s;
    const repo = entry.repo ?? "";
    const url = entry.url ?? `https://github.com/${repo}`;
    const desc = entry.description ?? "";
    const fullDesc = note ? `${desc} **${note}**` : desc;

    let statusCol: string;
    if (isDead && isHistorical) statusCol = HISTORICAL;
    else if (isDead) statusCol = SLEEPING;
    else statusCol = medals.get(i) ?? "";

    const trendText = !isDead ? formatTrend(rd.trend) : "";
    const projectCol = isDead
      ? `*[${entry.name}](${url})*`
      : `[${entry.name}](${url})${trendText}`;

    const starsText = repo ? formatStars(rd.stars) : "-";
    const commitText = repo ? formatDate(rd.pushed) : "-";
    const licenseText = rd.license ? `\`${rd.license}\`` : "-";

    if (isDead) {
      return `| ${statusCol} | ${projectCol} | *${starsText}* | *${commitText}* | ${licenseText} | *${fullDesc}* |`;
    }
    return `| ${statusCol} | ${projectCol} | ${starsText} | ${commitText} | ${licenseText} | ${fullDesc} |`;
  });
}

function assignMedals(scored: ScoredEntry[]): Map<number, string> {
  const medals = new Map<number, string>();
  let medalIdx = 0;
  for (let i = 0; i < scored.length && medalIdx < 3; i++) {
    if (!scored[i].isDead && scored[i].rd.score >= 40) {
      medals.set(i, MEDAL[medalIdx]);
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
```

- [ ] **Step 2: Run tests (expect failures - tests use old format)**

Run: `cd engine && npx vitest run`
Expected: `tests/generator/readme.test.ts` FAILS (old assertions don't match new 6-column table). `tests/scoring/quality.test.ts` and `tests/scoring/composite.test.ts` PASS.

- [ ] **Step 3: Commit**

```bash
git add engine/src/generator/readme.ts
git commit -m "feat: rewrite table renderer for 6-column enriched format"
```

---

### Task 5: Update README Tests

**Files:**
- Modify: `engine/tests/generator/readme.test.ts`

- [ ] **Step 1: Rewrite tests for the new table format**

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
    description: Multi-layer stack ensembling.
  - name: PyCaret
    repo: pycaret/pycaret
    description: Low-code ML library.
  - name: OldTool
    repo: old/tool
    description: Legacy framework.
    note: Historical.
`;

const now = new Date().toISOString();
const stale = "2022-01-01T00:00:00Z";

const SAMPLE_API: ApiData = {
  "autogluon/autogluon": { stars: 12000, pushed: now, archived: false, license: "Apache-2.0", trend: 340, score: 88 },
  "pycaret/pycaret": { stars: 9500, pushed: now, archived: false, license: "MIT", trend: 85, score: 75 },
  "old/tool": { stars: 500, pushed: stale, archived: false, license: null, trend: null, score: 10 },
};

const HEADER = "# Awesome AutoML\n\n## Contents\n";
const FOOTER = "## Contributing\n\nContributions welcome!";

describe("generateReadme", () => {
  it("produces 6-column table with header", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("| # | Project | Stars | Updated | License | Description |");
  });

  it("sorts by quality score descending (highest score first)", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    const autogluonIdx = result.indexOf("AutoGluon");
    const pycaretIdx = result.indexOf("PyCaret");
    const oldIdx = result.indexOf("OldTool");
    expect(autogluonIdx).toBeLessThan(pycaretIdx);
    expect(pycaretIdx).toBeLessThan(oldIdx);
  });

  it("renders license in backtick code", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("`Apache-2.0`");
    expect(result).toContain("`MIT`");
  });

  it("renders trend arrows for active projects", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toMatch(/AutoGluon.*340/);
    expect(result).toMatch(/PyCaret.*85/);
  });

  it("renders unmaintained/historical rows in italic", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("*[OldTool]");
    expect(result).toContain("*500*");
  });

  it("assigns medal to top scorer", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("\u{1F947}");
  });

  it("includes legend below table", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("quality score (top 3)");
    expect(result).toContain("unmaintained");
  });

  it("renders - for missing license", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    const oldToolLine = result.split("\n").find((l) => l.includes("OldTool"));
    expect(oldToolLine).toBeDefined();
    expect(oldToolLine).toMatch(/\| - \|/);
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `cd engine && npx vitest run`
Expected: ALL tests PASS (quality, readme, composite)

- [ ] **Step 3: Commit**

```bash
git add engine/tests/generator/readme.test.ts
git commit -m "test: update readme tests for 6-column enriched table format"
```

---

### Task 6: Update Header Legend

**Files:**
- Modify: `config/header.md`

- [ ] **Step 1: Replace the Legend table in `config/header.md`**

Find this block (lines 79-90):

```markdown
### Legend

| Symbol | Meaning |
|:-------|:--------|
| 5,200 | GitHub stars (updates on each `generate` run) |
| 2026-03 | Last commit date as YYYY-MM |
| **Unmaintained** | No meaningful commits for 12+ months |
| **Archived** | Repository archived by maintainer |
| **Deprecated** | Superseded; named replacement provided |
| **Historical** | Included for foundational influence, not active use |
| **Low activity** | Infrequent updates but not abandoned |
```

Replace with:

```markdown
### Legend

| Symbol | Meaning |
|:-------|:--------|
| 12,100 | GitHub stars (updates on each `generate` run) |
| 2026-04 | Last commit date as YYYY-MM |
| `MIT` | SPDX license identifier |
| :1st_place_medal: :2nd_place_medal: :3rd_place_medal: | Quality score - top 3 per category |
| :arrow_upper_right: 340 | Stars gained in last 30 days |
| :left_right_arrow: | Stable (fewer than 10 stars gained/lost) |
| :zzz: | Unmaintained - no commits for 12+ months |
| :file_cabinet: | Historical - included for foundational influence |
| **Archived** | Repository archived by maintainer |
```

- [ ] **Step 2: Commit**

```bash
git add config/header.md
git commit -m "docs: update legend for enriched README format"
```

---

### Task 7: Generate and Verify

**Files:**
- None created/modified by hand - this task runs the pipeline

- [ ] **Step 1: Run the full generate pipeline (with fresh API fetch)**

```bash
cd engine && npx tsx src/cli.ts generate
```

Expected: Fetches 202 repos, creates/updates `data/curator.db` with snapshots, writes enriched `README.md`. First run will show no trend arrows (no previous snapshot data).

- [ ] **Step 2: Verify the README output**

Check the generated `README.md`:
- Tables have 6 columns: `# | Project | Stars | Updated | License | Description`
- Top 3 active projects per category have medal emoji
- Unmaintained projects show sleeping emoji and italic text
- License column shows backtick-wrapped SPDX identifiers
- Legend appears below each category table
- `<sup>` trend arrows show `-` or stable arrow (first run, no previous data)

Run: `head -100 README.md` and spot-check a few category tables.

- [ ] **Step 3: Run generate again to get trend data**

```bash
cd engine && npx tsx src/cli.ts generate
```

Expected: Second run finds previous snapshots in SQLite. Trend arrows now show actual deltas (likely 0 or very small since both runs are same day). Verify a few entries show `<sup>` with numbers.

- [ ] **Step 4: Run all tests one final time**

```bash
cd engine && npx vitest run
```

Expected: ALL tests PASS

- [ ] **Step 5: Commit the generated README**

```bash
git add README.md data/api_cache.json
git commit -m "feat: generate enriched README with scores, trends, and licenses"
```

Note: `data/api_cache.json` may be gitignored. If `git add` skips it, that's fine - it's a local cache. Only `README.md` needs to be committed.

- [ ] **Step 6: Push**

```bash
git push
```
