import { describe, expect, it } from "vitest";
import { type ApiData, generateReadme } from "../../src/generator/readme.js";

const SAMPLE_YAML = `categories:
- name: General-Purpose AutoML
  description: End-to-end frameworks.
  entries:
  - name: AutoGluon
    repo: autogluon/autogluon
    description: Multi-layer stack ensembling for tabular, text, and image.
    tags: [tabular, text, image, ensembling]
  - name: PyCaret
    repo: pycaret/pycaret
    description: Low-code ML library.
  - name: OldTool
    repo: old/tool
    description: Legacy framework from the old days.
    note: Historical.
`;

const now = new Date().toISOString();
const stale = "2022-01-01T00:00:00Z";

const SAMPLE_API: ApiData = {
  "autogluon/autogluon": { stars: 12000, pushed: now, archived: false, license: "Apache-2.0", trend: 340, score: 88, topics: ["automl", "machine-learning"] },
  "pycaret/pycaret": { stars: 9500, pushed: now, archived: false, license: "MIT", trend: 5, score: 75, topics: ["automl", "low-code"] },
  "old/tool": { stars: 500, pushed: stale, archived: false, license: null, trend: null, score: 10, topics: [] },
};

const HEADER = "# Awesome AutoML\n\n## Contents\n";
const FOOTER = "## Contributing\n\nContributions welcome!";

describe("generateReadme", () => {
  it("produces details/summary cards instead of tables", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("<details><summary>");
    expect(result).toContain("</details>");
    expect(result).not.toContain("| Project |");
  });

  it("shows activity dot and score before project name", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("\uD83D\uDFE2 <b>88</b>");
  });

  it("shows stars in short K format in summary", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("12.0K");
    expect(result).toContain("9.5K");
  });

  it("shows trend badge only when abs >= 10", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("+340");
    // PyCaret has trend=5, should NOT show trend badge in summary
    const pycaretSection = result.split("PyCaret")[1]?.split("</summary>")[0] ?? "";
    expect(pycaretSection).not.toContain("+5");
  });

  it("shows tagline in summary from description", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("Multi-layer stack ensembling for tabular");
  });

  it("renders quality score in details dashboard", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("88/100");
  });

  it("shows exact stars with trend in details", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("12,000 (+340 last 30d)");
  });

  it("shows tags from YAML in dashboard", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("tabular \u00B7 text \u00B7 image \u00B7 ensembling");
  });

  it("falls back to API topics when no YAML tags", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    const pycaretCard = result.split("PyCaret")[1]?.split("</details>")[0] ?? "";
    expect(pycaretCard).toContain("automl \u00B7 low-code");
  });

  it("renders dead projects with red dot and italic name", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("\uD83D\uDD34 <b>10</b>");
    expect(result).toContain("<i><a href=");
  });

  it("separates active and dead with horizontal rule", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    const catSection = result.split("## General-Purpose AutoML")[1]?.split("## Contributing")[0] ?? "";
    expect(catSection).toContain("\n---\n");
  });

  it("assigns medal after score for top entries", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("\uD83E\uDD47");
  });

  it("shows n/a trend for dead projects in dashboard", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    const oldCard = result.split("OldTool")[1]?.split("</details>")[0] ?? "";
    expect(oldCard).toContain("(n/a)");
  });

  it("sorts by score descending", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    const autogluonIdx = result.indexOf("AutoGluon");
    const pycaretIdx = result.indexOf("PyCaret");
    const oldIdx = result.indexOf("OldTool");
    expect(autogluonIdx).toBeLessThan(pycaretIdx);
    expect(pycaretIdx).toBeLessThan(oldIdx);
  });
});
