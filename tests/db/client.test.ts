import { describe, expect, it } from "vitest";
import { DB } from "../../src/db/client.js";

describe("DB.migrate on a fresh database", () => {
  it("supports insertSnapshot with full metadata after a single migrate()", () => {
    const db = new DB(":memory:");
    db.migrate();
    const id = db.upsertProject("a/b", "ab");
    db.insertSnapshot(id, 100, 80, {
      archived: false,
      pushedAt: "2026-07-01T00:00:00Z",
      license: "MIT",
      topics: ["automl"],
      lastRelease: "2026-06-01T00:00:00Z",
      lastCommit: "2026-07-10T00:00:00Z",
    });
    const snap = db.getLatestSnapshot(id);
    expect(snap?.stars).toBe(100);
    expect(snap?.compositeScore).toBe(80);
    expect(snap?.license).toBe("MIT");
    expect(snap?.topics).toEqual(["automl"]);
    expect(snap?.archived).toBe(false);
    expect(snap?.lastRelease).toBe("2026-06-01T00:00:00Z");
    expect(snap?.lastCommit).toBe("2026-07-10T00:00:00Z");
    db.close();
  });

  it("supports tagline on a fresh database", () => {
    const db = new DB(":memory:");
    db.migrate();
    const id = db.upsertProject("a/b", "ab");
    db.setTagline(id, "one-liner");
    expect(db.getTagline(id)).toBe("one-liner");
    db.close();
  });

  it("is idempotent across multiple migrate() calls", () => {
    const db = new DB(":memory:");
    db.migrate();
    db.migrate();
    const id = db.upsertProject("a/b", "ab");
    db.insertSnapshot(id, 1, 1, { license: "MIT" });
    expect(db.getLatestSnapshot(id)?.license).toBe("MIT");
    db.close();
  });
});

describe("DB.countPrsToday", () => {
  it("counts today's decisions that carry a PR number", () => {
    const db = new DB(":memory:");
    db.migrate();
    const id = db.upsertProject("a/b", "ab");
    db.insertDecision({
      project_id: id,
      decision: "add",
      proposed_by: "discovery",
      pr_number: 42,
      pr_status: "open",
      reasoning: "auto",
    });
    db.insertDecision({
      project_id: id,
      decision: "add",
      proposed_by: "discovery",
      reasoning: "queued - no PR",
    });
    expect(db.countPrsToday()).toBe(1);
    db.close();
  });
});
