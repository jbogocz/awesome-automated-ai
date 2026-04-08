import { describe, expect, it } from "vitest";
import { type ApiData, generateReadme } from "../../src/generator/readme.js";

const SAMPLE_YAML = `categories:
- name: General-Purpose AutoML
  description: End-to-end frameworks.
  entries:
  - name: AutoGluon
    repo: autogluon/autogluon
    description: Multi-layer stack ensembling.
  - name: PyCaret
    repo: pycaret/pycaret
    description: Low-code ML library.
  - name: OldTool
    repo: old/tool
    description: Legacy framework.
    note: Historical.
`;

const now = new Date().toISOString();
const stale = "2022-01-01T00:00:00Z";

const SAMPLE_API: ApiData = {
  "autogluon/autogluon": { stars: 12000, pushed: now, archived: false, license: "Apache-2.0", trend: 340, score: 88 },
  "pycaret/pycaret": { stars: 9500, pushed: now, archived: false, license: "MIT", trend: 85, score: 75 },
  "old/tool": { stars: 500, pushed: stale, archived: false, license: null, trend: null, score: 10 },
};

const HEADER = "# Awesome AutoML\n\n## Contents\n";
const FOOTER = "## Contributing\n\nContributions welcome!";

describe("generateReadme", () => {
  it("produces 5-column table with header", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("| Project | Stars | Updated | License | Description |");
  });

  it("sorts by stars descending", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    const autogluonIdx = result.indexOf("AutoGluon");
    const pycaretIdx = result.indexOf("PyCaret");
    const oldIdx = result.indexOf("OldTool");
    expect(autogluonIdx).toBeLessThan(pycaretIdx);
    expect(pycaretIdx).toBeLessThan(oldIdx);
  });

  it("renders license in backtick code", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("`Apache-2.0`");
    expect(result).toContain("`MIT`");
  });

  it("renders trend arrows for active projects", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toMatch(/AutoGluon.*340/);
    expect(result).toMatch(/PyCaret.*85/);
  });

  it("renders unmaintained/historical rows in italic", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("*[OldTool]");
    expect(result).toContain("*500*");
  });

  it("assigns medal after top scorer name", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("autogluon) \u{1F947}");
  });

  it("does not repeat legend below each table", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).not.toContain("quality score (top 3)");
  });

  it("renders - for missing license", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    const oldToolLine = result.split("\n").find((l) => l.includes("OldTool"));
    expect(oldToolLine).toBeDefined();
    expect(oldToolLine).toMatch(/\| - \|/);
  });
});
