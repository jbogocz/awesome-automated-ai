import { describe, expect, it } from "vitest";
import { buildTagCorpus, selectTags } from "../../src/generator/tags.js";

/** Build a corpus where `spec` maps a tag to how many entries carry it. */
function corpusOf(spec: Record<string, number>, entryCount: number) {
  const entries: string[][] = Array.from({ length: entryCount }, () => []);
  for (const [tag, n] of Object.entries(spec)) {
    for (let i = 0; i < n; i++) entries[i % entryCount].push(tag);
  }
  return buildTagCorpus(entries);
}

describe("selectTags", () => {
  // The real failure: TPOT, a genetic-programming AutoML library, rendered
  // `adsp · ag066833 · aiml · alzheimer · alzheimers` because tags were taken
  // in YAML order, which is alphabetical.
  it("drops one-off tags in favour of ones shared with other entries", () => {
    const corpus = corpusOf(
      { ag066833: 1, adsp: 1, alzheimer: 1, "genetic-programming": 8, automl: 12, "scikit-learn": 6 },
      100,
    );
    const chosen = selectTags(
      ["adsp", "ag066833", "alzheimer", "automl", "genetic-programming", "scikit-learn"],
      corpus,
    );
    expect(chosen).not.toContain("ag066833");
    expect(chosen).not.toContain("adsp");
    expect(chosen).toContain("genetic-programming");
    expect(chosen).toContain("scikit-learn");
  });

  it("drops tags too common to tell entries apart", () => {
    // `llm` is on 104 of 302 entries in the real corpus: it separates nothing.
    const corpus = corpusOf({ llm: 60, "prompt-optimization": 5 }, 100);
    expect(selectTags(["llm", "prompt-optimization"], corpus)).toEqual(["prompt-optimization"]);
  });

  it("keeps the specific form when one tag is a truncation of another", () => {
    // Ludwig printed `deep · deep-learning`.
    const corpus = corpusOf({ deep: 4, "deep-learning": 9 }, 100);
    expect(selectTags(["deep", "deep-learning"], corpus)).toEqual(["deep-learning"]);
  });

  it("ranks the most-shared tag first", () => {
    const corpus = corpusOf({ rare: 2, mid: 5, common: 9 }, 100);
    expect(selectTags(["rare", "mid", "common"], corpus)).toEqual(["common", "mid", "rare"]);
  });

  it("is deterministic for tags of equal frequency", () => {
    const corpus = corpusOf({ zebra: 4, alpha: 4, mango: 4 }, 100);
    const once = selectTags(["zebra", "alpha", "mango"], corpus);
    expect(once).toEqual(["alpha", "mango", "zebra"]);
    expect(selectTags(["mango", "zebra", "alpha"], corpus)).toEqual(once);
  });

  it("respects the limit", () => {
    const corpus = corpusOf({ a: 3, b: 4, c: 5, d: 6, e: 7, f: 8 }, 100);
    expect(selectTags(["a", "b", "c", "d", "e", "f"], corpus)).toHaveLength(5);
    expect(selectTags(["a", "b", "c", "d", "e", "f"], corpus, 2)).toEqual(["f", "e"]);
  });

  // A genuinely niche project must not be left with a blank tag line.
  it("backfills rather than returning nothing when every tag is a one-off", () => {
    const corpus = corpusOf({ onlyhere: 1, alsoonce: 1 }, 100);
    expect(selectTags(["onlyhere", "alsoonce"], corpus)).toHaveLength(2);
  });

  it("returns an empty list for an entry with no tags", () => {
    const corpus = corpusOf({ a: 3 }, 10);
    expect(selectTags(undefined, corpus)).toEqual([]);
    expect(selectTags([], corpus)).toEqual([]);
  });

  it("counts a tag once per entry even when the entry repeats it", () => {
    const corpus = buildTagCorpus([["dup", "dup", "dup"], ["other"]]);
    expect(corpus.count.get("dup")).toBe(1);
  });
});
