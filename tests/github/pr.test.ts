import { describe, expect, it } from "vitest";
import { buildYamlEntry } from "../../src/github/pr.js";

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
