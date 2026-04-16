# Collapsible Cards README Redesign

**Goal:** Replace table-based project listings with `<details><summary>` collapsible cards (Proposal 15 style) - traffic light dot + score lead, KPI badges, short tagline in summary; full description + dashboard + tags in details.

**Architecture:** Rewrite `readme.ts` generator output from tables to HTML card blocks. Add `tags` field to `projects.yaml`. Fetch GitHub topics via API as tag source. Add tagline generation (truncated description). No changes to scoring algorithm or DB.

**Tech Stack:** Same - TypeScript, Vitest, yaml parser, gh CLI.

---

## Summary Line Format

```
🟢 88  🥇 ProjectName  ⭐ 11.7K  ↗️ +340  Apache-2.0  -  Short tagline here
```

### Elements (left to right):
1. **Activity dot** - 🟢 fresh (<6mo) / 🟡 stale (6-12mo) / 🔴 dead (>12mo or archived)
2. **Score** - bold number from quality score (0-100)
3. **Medal** - 🥇🥈🥉 for top 3 per category (score >= 40, not dead). Omitted for non-medal.
4. **Project name** - bold link to repo. Italic for dead projects. 💤 prefix for unmaintained. 🗄️ for historical.
5. **Stars badge** - `⭐ 11.7K` format (K/M abbreviation). As inline `<code>`.
6. **Trend badge** - `↗️ +340` only when abs(trend) >= 10. Omitted otherwise. As inline `<code>`.
7. **License badge** - `Apache-2.0` as inline `<code>`. Omitted if null.
8. **Tagline** - after ` - ` separator. First sentence of description, max 80 chars, truncated with `...` if needed.

### Dead project summary:
```
🔴 15  💤 auto-sklearn  ⭐ 8.1K  BSD-3  -  Bayesian optimization + meta-learning
```
No trend for dead projects. Name in italic.

## Details Content

```markdown
<br>

Full multi-sentence description from projects.yaml.

\```
  Quality   ████████▓░  88/100
  Stars     ⭐ 11,665 (+340 last 30d)
  Activity  🟢 Apr 2026
  License   Apache-2.0
  Tags      tabular · text · image · deep-learning · fine-tuning
\```
```

### Dashboard rules:
- **Quality** - Unicode progress bar (10 chars: `█` filled, `▓` partial, `░` empty) + score/100
- **Stars** - exact number with locale formatting + `(+N last 30d)` always shown. `(n/a)` if no previous data or dead.
- **Activity** - dot + month-year. For dead: append ` - unmaintained 12+ months` or ` - historical` or ` - archived`.
- **License** - SPDX ID or `-`
- **Tags** - dot-separated from `tags` field in YAML. If no tags in YAML, fetch GitHub repo topics. If neither, omit Tags line.

## Progress Bar Generation

Score 0-100 mapped to 10-char bar:
- Each char = 10 points
- Full block `█` for complete 10-point segments
- Half block `▓` for partial (>= 5 points remaining)
- Empty `░` for rest

Examples: 88 -> `████████▓░`, 55 -> `█████▓░░░░`, 5 -> `░░░░░░░░░░` (rounds to `▓░░░░░░░░░` actually... let me be precise)

Formula: `filled = Math.floor(score / 10)`, `partial = (score % 10 >= 5) ? 1 : 0`, `empty = 10 - filled - partial`

## Stars Abbreviation (Summary Only)

- < 1,000: exact number (e.g., `449`)
- >= 1,000 and < 10,000: one decimal K (e.g., `4.3K`)
- >= 10,000 and < 1,000,000: one decimal K (e.g., `11.7K`)
- >= 1,000,000: one decimal M (e.g., `1.2M`)

Details dashboard always shows exact: `11,665`

## Activity Dot Logic

- 🟢 `pushed` date < 6 months ago
- 🟡 `pushed` date 6-12 months ago
- 🔴 `pushed` date > 12 months ago, OR archived, OR unmaintained/historical note

## Category Header

```markdown
## General-Purpose AutoML

*End-to-end frameworks that automate model selection, hyperparameter tuning, and pipeline construction.*
```

No change from current. The `---` horizontal rule separates active from dead projects within a category.

## Tags in projects.yaml

Add optional `tags` field to entries:

```yaml
- name: Ludwig
  repo: ludwig-ai/ludwig
  description: Declarative deep learning framework...
  tags: [tabular, text, image, audio, deep-learning, fine-tuning, yaml-config]
```

For initial population: fetch GitHub repo topics via `gh api repos/{repo} --jq '.topics'` and store in YAML. This is a one-time manual step (can be scripted).

## Tagline Generation

No new YAML field. Auto-generated from `description`:
1. Take text up to first `.` or `,` that is followed by a space
2. Cap at 80 characters
3. If truncated, append `...`
4. HTML-escape `&` as `&amp;`

## Header Legend Update

Replace current legend table with new symbols:

| Symbol | Meaning |
|:-------|:--------|
| 🟢 🟡 🔴 | Project health: active / stale / unmaintained |
| **88** | Quality score (0-100) based on stars, trend, freshness, license, archived status |
| 🥇 🥈 🥉 | Top 3 quality score per category |
| ⭐ 11.7K | GitHub stars |
| ↗️ +340 | Stars gained in last 30 days (shown when >= 10) |
| 💤 | Unmaintained - no activity for 12+ months |
| 🗄️ | Historical - included for foundational influence |
| `Apache-2.0` | SPDX license identifier |

## Files Changed

- **Modify:** `engine/src/generator/readme.ts` - rewrite `buildTable` -> `buildCards`, update `generateReadme`
- **Modify:** `engine/tests/generator/readme.test.ts` - update all tests for card output
- **Modify:** `config/header.md` - update legend
- **Modify:** `projects.yaml` - add `tags` arrays to entries
- **Modify:** `engine/src/generator/fetch-api.ts` - add GitHub topics fetch to `fetchOneRepo`
- **No change:** `engine/src/scoring/quality.ts`, `engine/src/db/client.ts`, `engine/src/cli.ts`

## Out of Scope

- Interactive site changes
- New scoring algorithm
- New data fields beyond tags/topics
