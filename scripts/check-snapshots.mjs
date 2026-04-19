#!/usr/bin/env node
import Database from "better-sqlite3";

const [, , repo] = process.argv;
if (!repo) {
  console.error("Usage: node scripts/check-snapshots.mjs <owner/name>");
  process.exit(1);
}

const db = new Database("data/curator.db", { readonly: true });
const rows = db
  .prepare(
    `SELECT snapshot_date, stars FROM snapshots
     WHERE project_id = (SELECT id FROM projects WHERE repo = ?)
     ORDER BY snapshot_date`,
  )
  .all(repo);
console.log(`rows: ${rows.length}`);
for (const r of rows) console.log(r.snapshot_date, r.stars);
db.close();
