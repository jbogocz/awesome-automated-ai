# Enriched README Design

## Goal

Transform the README from a basic 4-column table into a data-rich, scannable reference with quality scores, star trends, and license info - giving users actionable information at a glance.

## Architecture

Extend the existing `generate` pipeline (`projects.yaml` -> `fetch-api.ts` -> `readme.ts` -> `README.md`) with richer data collection and a new scoring module. No new services or dependencies - everything runs in one `generate` command.

## README Table Format

6 columns per category table:

```markdown
| # | Project | Stars | Updated | License | Description |
|:--|:--------|------:|:--------|:--------|:------------|
| medal/emoji | [Name](url) trend | 12,100 | 2026-04 | `Apache-2.0` | Text. **Note if any.** |
```

### Column Details

**Column 1 (#)** - status indicator per row:
- Active top 3 per category by quality score: `{gold medal}` `{silver medal}` `{bronze medal}`
- Active but not top 3: empty
- Unmaintained (no commits 12+ months): `{sleeping}`
- Historical (included for influence, not active use): `{file cabinet}`
- Archived by maintainer: `{sleeping}` with "Archived" in description

**Column 2 (Project)** - name as GitHub link + superscript trend:
- Trending up (gained 50+ stars/30d): `[Name](url) ^{up-right arrow} 340^`
- Moderate growth (10-49 stars/30d): `[Name](url) ^{up-right arrow} 25^`
- Stable (-9 to +9 stars/30d): `[Name](url) ^{left-right arrow}^`
- Declining (lost 10+ stars/30d): `[Name](url) ^{down-right arrow} 15^`
- No data (first run): no superscript shown
- Unmaintained/historical rows: name in italic, no trend shown

**Column 3 (Stars)** - integer with thousands separator (e.g., `12,100`)

**Column 4 (Updated)** - YYYY-MM from `pushed_at`

**Column 5 (License)** - SPDX identifier in backtick code tag (e.g., `` `MIT` ``, `` `Apache-2.0` ``). `-` if no license detected.

**Column 6 (Description)** - existing description text. Unmaintained/historical rows rendered in italic with bold status note.

### Legend

Compact one-liner rendered below each category table inside a blockquote:

```markdown
> {gold}{silver}{bronze} quality score (top 3) | {up-right arrow} stars/30d | {left-right arrow} stable | {sleeping} unmaintained | {file cabinet} historical
```

### Sorting

Rows sorted by quality score descending (not just stars). This means a tool with fewer stars but strong trend and recent commits can rank above a high-star stale project.

### Unmaintained/Historical Presentation

These rows use italic markdown for name, stars, date, and description. The status note is bold within the italic description. No trend arrow shown. This creates a visually distinct "muted" look using only standard GitHub markdown.

Example:
```markdown
| {sleeping} | *[auto-sklearn](url)* | *7,800* | *2022-09* | `BSD-3` | *Historically important AutoML toolkit. **Unmaintained.*** |
```

## Data Collection

### Extended API Fetch

`fetch-api.ts` currently calls `gh api repos/{repo}` and extracts `{stars, pushed, archived}`. Extend the `--jq` query to also extract:

- `license`: `.license.spdx_id` (string or null)

New cache format in `data/api_cache.json`:
```json
{
  "autogluon/autogluon": {
    "stars": 12100,
    "pushed": "2026-04-07T...",
    "archived": false,
    "license": "Apache-2.0"
  }
}
```

### Star History in SQLite

Use the existing `data/curator.db` SQLite database and the already-defined `snapshots` table. On each `generate` run:

1. Open/create `data/curator.db`
2. Ensure the `snapshots` table exists (migration already defined in `db/client.ts`)
3. For each repo, insert a snapshot row: `{project_id, snapshot_date, stars}`
4. To compute trend: `SELECT stars FROM snapshots WHERE project_id = ? ORDER BY snapshot_date DESC LIMIT 2` - delta between the two most recent entries.

The `snapshots` table already has columns for `stars`, `forks`, `open_issues`, `contributors`, `commit_count_30d`, `avg_issue_response_hours`, `composite_score`. We only populate `stars` and `composite_score` for now. Other columns available for future enrichment.

**Note:** The `projects` table requires a row per repo for foreign key. The `generate` command will upsert projects into the `projects` table from `projects.yaml` before writing snapshots.

### First Run Behavior

On first run there is no previous snapshot, so:
- Trend = no data, no arrow displayed
- Quality score uses trend weight as 0 (redistributed to other metrics)
- All data is correct, just no trend info yet
- Second run onwards: full trend data available

## Quality Score Algorithm

New module: `engine/src/scoring/quality.ts`

Input per repo: `{stars, starsPrevious, pushedAt, license, archived}`

### Metrics and Weights

| Metric | Weight | Calculation |
|:-------|:-------|:------------|
| Stars (log scale) | 25% | `min(log10(max(stars, 1)) / 5 * 100, 100)` - 100K stars = 100, 1K = 60, 100 = 40 |
| Star trend | 25% | `clamp((current - previous) / max(previous, 1) * 1000, 0, 100)` - relative growth rate. If no previous data: 50 (neutral). |
| Freshness | 30% | Days since last commit: <30d = 100, <90d = 80, <180d = 60, <365d = 30, >=365d = 0 |
| Has license | 10% | License present: 100, null: 0 |
| Not archived | 10% | Not archived: 100, archived: 0 |

**Total**: weighted sum, clamped to 0-100, rounded to integer.

### Medal Assignment

After computing scores for all entries in a category:
1. Sort by score descending
2. Top entry = gold, second = silver, third = bronze
3. Only active projects eligible (unmaintained/archived/historical excluded from medal consideration)
4. Minimum score threshold for medal: 40 (prevents medals in categories with mostly dead projects)

### Auto-tagging

If a project has no explicit `note` in `projects.yaml` and:
- `score < 30` AND last commit > 12 months ago: auto-tag as "Unmaintained"
- `archived == true`: auto-tag as "Archived"

Existing manual `note` values in `projects.yaml` always take precedence.

## Generator Changes

### `readme.ts` Modifications

The `buildTable` function changes from 4-column to 6-column output:

```
| # | Project | Stars | Updated | License | Description |
```

New logic:
1. Compute quality score for each entry
2. Sort by score descending (not stars)
3. Assign medals to top 3 active entries
4. Format each row with trend arrow, license code tag, and status emoji
5. Render unmaintained/historical rows in italic
6. Append legend below table

### `fetch-api.ts` Modifications

1. Add `license` to the `--jq` query: `{stars: .stargazers_count, pushed: .pushed_at, archived: .archived, license: .license.spdx_id}`
2. After fetching all repos, open SQLite and write snapshot rows
3. Read previous snapshot for trend calculation
4. Return enriched data: `{stars, pushed, archived, license, trend, score}`

### `ApiRepoData` Type Extension

```typescript
export interface ApiRepoData {
  stars: number;
  pushed: string;
  archived: boolean;
  license: string | null;    // NEW
  trend: number | null;       // NEW: stars delta from previous snapshot
  score: number;              // NEW: quality score 0-100
}
```

## File Changes Summary

| File | Change |
|:-----|:-------|
| `engine/src/generator/fetch-api.ts` | Add license to API query, SQLite snapshot writes/reads, trend calculation |
| `engine/src/scoring/quality.ts` | NEW: quality score algorithm |
| `engine/src/generator/readme.ts` | 6-column table, medals, trend arrows, italic unmaintained, legend |
| `engine/src/db/client.ts` | Add methods: `upsertProject`, `insertSnapshot`, `getLatestSnapshot` |
| `engine/tests/scoring/quality.test.ts` | NEW: tests for quality score |
| `engine/tests/generator/readme.test.ts` | Update for new table format |
| `config/header.md` | Update Legend table to match new symbols |
| `data/api_cache.json` | Extended with `license` field (gitignored) |
| `data/curator.db` | Snapshot data (gitignored) |

## Out of Scope

- Interactive site changes (separate spec)
- CI/CD automation (user runs manually)
- Additional metrics (forks, contributors, downloads) - future enrichment
- Comparison tables in header (keep existing Quick Comparison table as-is for now)
