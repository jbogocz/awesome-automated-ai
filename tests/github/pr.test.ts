import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { buildYamlEntry } from "../../src/github/pr.js";

/** Parse an entry back in the projects.yaml structure it gets spliced into. */
function roundTrip(entry: string): Record<string, unknown> {
  const doc = parse(`categories:\n- name: Cat\n  entries:\n${entry}\n`) as {
    categories: { entries: Record<string, unknown>[] }[];
  };
  return doc.categories[0]?.entries[0] ?? {};
}

describe("buildYamlEntry", () => {
  it("emits name, repo, description, tagline and tags when all provided", () => {
    const yaml = buildYamlEntry({
      name: "AutoGluon",
      repo: "autogluon/autogluon",
      description: "Multi-layer stack ensembling for tabular, text, image, time-series.",
      tagline: "Multi-modal stack ensembling, Kaggle champion",
      tags: ["automl", "deep-learning", "tabular-data"],
      note: null,
    });
    expect(yaml).toBe(
      [
        "  - name: AutoGluon",
        "    repo: autogluon/autogluon",
        "    description: Multi-layer stack ensembling for tabular, text, image, time-series.",
        "    tagline: Multi-modal stack ensembling, Kaggle champion",
        "    tags: [automl, deep-learning, tabular-data]",
      ].join("\n"),
    );
  });

  it("appends note after tagline/tags when present", () => {
    const yaml = buildYamlEntry({
      name: "Old Tool",
      repo: "owner/old",
      description: "Legacy project.",
      tagline: "Legacy AutoML from 2019",
      tags: ["automl"],
      note: "Unmaintained; kept for historical reference",
    });
    expect(yaml).toContain("    note: Unmaintained; kept for historical reference");
    expect(yaml.indexOf("note:")).toBeGreaterThan(yaml.indexOf("tags:"));
  });

  it("skips tagline, tags and note lines when empty", () => {
    const yaml = buildYamlEntry({
      name: "Bare",
      repo: "owner/bare",
      description: "Short.",
      tagline: "",
      tags: [],
      note: null,
    });
    expect(yaml).toBe(["  - name: Bare", "    repo: owner/bare", "    description: Short."].join("\n"));
  });
});

describe("buildYamlEntry escaping (values derive from untrusted READMEs via the LLM)", () => {
  it("quotes values that would otherwise inject or break YAML structure", () => {
    const entry = buildYamlEntry({
      name: "Evil: tool",
      repo: "owner/evil",
      description: "description ending with a colon:",
      tagline: "- looks like a list item",
      tags: ["ok", "with,comma", "with]bracket"],
      note: "#looks like a comment",
    });
    expect(roundTrip(entry)).toEqual({
      name: "Evil: tool",
      repo: "owner/evil",
      description: "description ending with a colon:",
      tagline: "- looks like a list item",
      tags: ["ok", "with,comma", "with]bracket"],
      note: "#looks like a comment",
    });
  });

  it("flattens newlines so entries stay single-line per field", () => {
    const entry = buildYamlEntry({
      name: "Tool",
      repo: "o/r",
      description: "line1\nline2  spaced",
      tagline: "",
      tags: [],
      note: null,
    });
    expect(entry.split("\n")).toHaveLength(3);
    expect(roundTrip(entry).description).toBe("line1 line2 spaced");
  });

  it("keeps benign values as plain unquoted scalars (style parity with projects.yaml)", () => {
    const entry = buildYamlEntry({
      name: "AutoGluon",
      repo: "autogluon/autogluon",
      description: "Stack ensembling for tabular, text, and image data.",
      tagline: "Multi-modal stack ensembling",
      tags: ["automl", "deep-learning"],
      note: null,
    });
    expect(entry).toContain("    description: Stack ensembling for tabular, text, and image data.");
    expect(entry).toContain("    tags: [automl, deep-learning]");
  });
});
