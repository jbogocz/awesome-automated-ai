import { describe, expect, it } from "vitest";
import { entryNote, maintainedAlternatives } from "../../src/generator/notes.ts";
import type { ApiData, ApiRepoData } from "../../src/generator/readme.ts";
import { buildTagCorpus } from "../../src/generator/tags.ts";
import type { Entry } from "../../src/validation/projects-yaml.ts";

const NOW = Date.parse("2026-11-09T00:00:00Z");
const recent = "2026-11-01T00:00:00Z";
const old = "2025-06-01T00:00:00Z";

function api(score: number, lastCommit: string, extra: Partial<ApiRepoData> = {}): ApiRepoData {
  return {
    stars: 100,
    pushed: lastCommit,
    archived: false,
    license: null,
    trend: null,
    score,
    topics: [],
    tagline: null,
    lastCommit,
    lastRelease: null,
    lastTag: null,
    commits90d: 20,
    ...extra,
  };
}

const entry = (name: string, repo: string, extra: Partial<Entry> = {}): Entry =>
  ({ name, repo, description: "d", ...extra }) as Entry;

describe("maintainedAlternatives", () => {
  const entries = [
    entry("Dead", "o/dead", { tags: ["tracking", "python"] }),
    entry("Popular", "o/popular", { tags: ["orchestration", "python"] }),
    entry("Tracker", "o/tracker", { tags: ["tracking", "python"] }),
    entry("Tracker2", "o/tracker2", { tags: ["tracking"] }),
    entry("Tracker3", "o/tracker3", { tags: ["tracking"] }),
    entry("OldTracker", "o/old", { tags: ["tracking"] }),
    entry("Museum", "o/museum", { tags: ["tracking"], lifecycle: "historical" }),
    entry("Hosted", "", { url: "https://x.example", tags: ["tracking"] }),
  ];
  const data: ApiData = {
    "o/dead": api(90, old),
    "o/popular": api(99, recent),
    "o/tracker": api(10, recent),
    "o/tracker2": api(30, recent),
    "o/tracker3": api(20, recent),
    "o/old": api(95, old),
    "o/museum": api(98, recent),
  };
  // "python" is on most entries, "orchestration" on one and "tracking" on many.
  const corpus = buildTagCorpus([
    ...entries.map((e) => e.tags),
    ["python"],
    ["python"],
    ["python"],
    ["python"],
    ["python"],
  ]);

  // Aim's best-scored neighbours were Apache Airflow and Ray: a section is
  // broader than one tool's job, so the closest active entries are named.
  it("names the closest active entries by shared tags, then by score, never the entry itself", () => {
    expect(maintainedAlternatives(entries[0] as Entry, entries, data, corpus, NOW)).toEqual(["Tracker", "Tracker2"]);
  });

  it("names nothing that shares no tag with the entry", () => {
    const lone = entry("Lone", "o/dead", { tags: ["unique"] });
    expect(maintainedAlternatives(lone, [lone, ...entries.slice(1)], data, corpus, NOW)).toEqual([]);
  });
});

describe("entryNote", () => {
  it("keeps the curator's note as written", () => {
    expect(entryNote(entry("A", "o/a", { note: "Use B." }), api(1, old), ["X"], NOW)).toBe("Use B.");
  });

  // Every curated resolution of a dead entry so far (TPOT, EvoPrompt,
  // AI-Researcher, ...) named maintained options from the same section.
  it("names the maintained alternatives for an entry that went dead without a note", () => {
    expect(entryNote(entry("A", "o/a"), api(1, old), ["X", "Y"], NOW)).toBe(
      "Unmaintained - no commit on the default branch, release or tag for 12+ months. Maintained in this section: X and Y.",
    );
    expect(entryNote(entry("A", "o/a"), api(1, old), ["X"], NOW)).toBe(
      "Unmaintained - no commit on the default branch, release or tag for 12+ months. Maintained in this section: X.",
    );
  });

  it("states the status alone when the section has nothing maintained", () => {
    expect(entryNote(entry("A", "o/a"), api(1, old), [], NOW)).toBe(
      "Unmaintained - no commit on the default branch, release or tag for 12+ months.",
    );
  });

  it("says an archived repo is archived, ahead of the curator's note", () => {
    expect(entryNote(entry("A", "o/a", { note: "Research code." }), api(1, old, { archived: true }), [], NOW)).toBe(
      "Archived. Research code.",
    );
  });

  it("writes nothing for an entry without data", () => {
    expect(entryNote(entry("A", "o/a"), undefined, ["X"], NOW)).toBe("");
  });
});
