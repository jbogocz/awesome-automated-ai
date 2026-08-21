#!/usr/bin/env node

/**
 * One-off repair of data/curator.db. Applied 2026-08-21; kept as the record of
 * what was changed and why, and safe to re-run (it exits early once clean).
 *
 * WHAT WENT WRONG
 * GitHub restricted stargazer listings to admins and collaborators
 * (2026-06-30 changelog, rolled out July 2026). The GraphQL `stargazers`
 * connection now returns an empty edge list — with no error and hasNextPage
 * false — for every repository the caller cannot administer.
 *
 * The retired reconstruction path computed each historical day as
 * `currentStars - starsAfter`. With no edges, starsAfter was 0 for every day,
 * so it stamped the current star count across all 30 preceding days. Backfill
 * run 12 (2026-08-14, 29 repos, 2 seconds) wrote 870 such rows and reported
 * "OK=29 skipped=0 reasons={}". They were published as the sparkline and as
 * the 30-day trend, which also feeds 25% of the quality score.
 *
 * WHY THOSE REPOS WERE BEING RECONSTRUCTED AT ALL
 * Nine of the 29 were upstream renames. upsertProject keyed on the slug, so a
 * renamed entry minted a fresh row and syncListedStatus retired the old one,
 * stranding months of real measurements behind a slug nobody read any more.
 * The empty new row is exactly what triggered reconstruction.
 *
 * WHAT THIS SCRIPT DOES
 *   1. Deletes the fabricated rows, identified by their own signature rather
 *      than by a hard-coded run id: a reconstruction write batch (one
 *      created_at) in which EVERY project received a single repeated star
 *      value is a batch where the source returned nothing.
 *   2. Moves the stranded measurements onto the surviving row for the nine
 *      renames, each confirmed by GitHub's immutable numeric repository id,
 *      and records that id so the slug can never orphan history again.
 *   3. Deletes the emptied predecessor rows.
 *
 * WHAT IT DELIBERATELY DOES NOT TOUCH
 * Reconstructions from runs 2/8/9/10/11 ran while the API still served real
 * starredAt timestamps and are genuine estimates — including seven small
 * repos whose flat series is corroborated by measured snapshots at both ends.
 * They stay in the database. They are excluded from publication by
 * DB.MEASURED, not by deletion.
 *
 * visenger/awesome-mlops -> kelvins/awesome-mlops looks like a rename and is
 * not one: different GitHub ids (244620269 vs 266895706), different creation
 * dates, 14,160 vs 5,251 stars. It was a curation swap, and merging the two
 * would have grafted one project's history onto another.
 */

import { resolve } from "node:path";
import Database from "better-sqlite3";

const DB_PATH = process.argv[2] ?? resolve(import.meta.dirname, "../data/curator.db");

/** old slug -> [new slug, GitHub repository id shared by both]. */
const RENAMES = [
  ["MilesCranmer/PySR", "astroautomata/PySR", 295391759],
  ["block/goose", "aaif-goose/goose", 846698999],
  ["microsoft/presidio", "data-privacy-stack/presidio", 132129752],
  ["great-expectations/great_expectations", "fivetran/great_expectations", 103071520],
  ["sst/opencode", "anomalyco/opencode", 975734319],
  ["strands-agents/sdk-python", "strands-agents/harness-sdk", 983715534],
  ["NVIDIA-NeMo/NeMo-Curator", "NVIDIA-NeMo/Curator", 772255271],
  ["Data-Centric-AI-Community/ydata-profiling", "Data-Centric-AI-Community/fg-data-profiling", 49346299],
  ["e2b-dev/e2b", "e2b-dev/E2B", 609539715],
];

const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

// Normally added by DB.migrate(); this script runs standalone, and step 2
// needs somewhere to record the id that proves each pairing.
try {
  db.exec("ALTER TABLE projects ADD COLUMN github_id INTEGER");
} catch (err) {
  if (!/duplicate column name/i.test(String(err))) throw err;
}

const poisoned = db
  .prepare(
    `SELECT created_at, SUM(n) AS rows, COUNT(*) AS projects
       FROM (SELECT created_at, project_id, COUNT(*) AS n, COUNT(DISTINCT stars) AS distinct_stars
               FROM snapshots WHERE composite_score IS NULL
              GROUP BY created_at, project_id)
      GROUP BY created_at
     HAVING COUNT(*) >= 5 AND SUM(CASE WHEN distinct_stars = 1 THEN 1 ELSE 0 END) = COUNT(*)`,
  )
  .all();

const strandedLeft = db
  .prepare(`SELECT COUNT(*) AS c FROM projects WHERE repo IN (${RENAMES.map(() => "?").join(",")})`)
  .get(...RENAMES.map((r) => r[0])).c;

// A run whose output was voided but which still reads 'completed' is also
// unfinished business, so the script is not "done" until that is recorded too.
const unmarked = db
  .prepare(
    "SELECT COUNT(*) AS c FROM backfill_runs WHERE status = 'completed' AND points_used <= 2 AND total_repos >= 5",
  )
  .get().c;

if (poisoned.length === 0 && strandedLeft === 0 && unmarked === 0) {
  console.log("Nothing to repair: no fabricated batch and no stranded predecessor rows.");
  db.close();
  process.exit(0);
}

const before = db.prepare("SELECT COUNT(*) AS c FROM snapshots").get().c;

const repair = db.transaction(() => {
  let deleted = 0;
  for (const batch of poisoned) {
    const info = db
      .prepare("DELETE FROM snapshots WHERE composite_score IS NULL AND created_at = ?")
      .run(batch.created_at);
    deleted += info.changes;
    console.log(`  purged ${info.changes} fabricated rows written at ${batch.created_at} (${batch.projects} projects)`);
  }

  let moved = 0;
  let dropped = 0;
  for (const [oldRepo, newRepo, githubId] of RENAMES) {
    const oldRow = db.prepare("SELECT id FROM projects WHERE repo = ?").get(oldRepo);
    const newRow = db.prepare("SELECT id FROM projects WHERE repo = ?").get(newRepo);
    if (!newRow) throw new Error(`survivor row missing for ${newRepo} — refusing to continue`);
    db.prepare("UPDATE projects SET github_id = ? WHERE id = ?").run(githubId, newRow.id);
    if (!oldRow) continue;

    // The purge above removed every fabricated row, so the two series no
    // longer overlap; UPDATE OR IGNORE is belt-and-braces against the
    // UNIQUE(project_id, snapshot_date) constraint should one ever remain.
    const info = db
      .prepare("UPDATE OR IGNORE snapshots SET project_id = ? WHERE project_id = ?")
      .run(newRow.id, oldRow.id);
    moved += info.changes;

    const left = db.prepare("SELECT COUNT(*) AS c FROM snapshots WHERE project_id = ?").get(oldRow.id).c;
    if (left > 0) throw new Error(`${oldRepo}: ${left} snapshot(s) could not be moved — refusing to drop the row`);
    db.prepare("DELETE FROM projects WHERE id = ?").run(oldRow.id);
    dropped += 1;
    console.log(`  ${oldRepo} -> ${newRepo}: moved ${info.changes} snapshots, dropped the orphaned row`);
  }
  // Record what happened to the run whose output we just voided, so the
  // retained audit tables do not read as a clean success.
  db.prepare(
    `UPDATE backfill_runs
        SET status = 'aborted',
            notes = notes || ' | OUTPUT VOIDED 2026-08-21: stargazer listings returned no edges; rows purged by scripts/repair-star-history.mjs'
      WHERE id IN (SELECT DISTINCT b.run_id FROM backfill_repo_status b WHERE b.project_id IN (SELECT id FROM projects))
        AND status = 'completed'
        AND points_used <= 2
        AND total_repos >= 5`,
  ).run();

  // Post-condition, inside the transaction so that failing it rolls the whole
  // repair back rather than leaving a half-repaired database behind.
  const orphans = db
    .prepare(
      `SELECT repo FROM projects p WHERE p.status = 'listed'
        AND NOT EXISTS (SELECT 1 FROM snapshots s WHERE s.project_id = p.id AND s.composite_score IS NOT NULL)`,
    )
    .all();
  if (orphans.length > 0) {
    throw new Error(`listed projects left with no measured snapshot: ${orphans.map((o) => o.repo)}`);
  }

  console.log(`\npurged ${deleted} rows, moved ${moved} rows, dropped ${dropped} predecessor project rows`);
});

repair();

const after = db.prepare("SELECT COUNT(*) AS c FROM snapshots").get().c;
console.log(`snapshots: ${before} -> ${after}`);

// curator.db is committed to git, and *.db-wal is not. Fold the write-ahead
// log back into the file itself or the repair never reaches the repository.
db.pragma("wal_checkpoint(TRUNCATE)");
db.close();
console.log("WAL checkpointed; data/curator.db is ready to commit.");
