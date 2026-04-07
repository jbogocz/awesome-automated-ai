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
`;

const SAMPLE_API: ApiData = {
  "autogluon/autogluon": { stars: 8000, pushed: "2026-04-01T00:00:00Z", archived: false },
  "pycaret/pycaret": { stars: 9500, pushed: "2026-03-15T00:00:00Z", archived: false },
};

const HEADER = "# Awesome AutoML\n\n## Contents\n";
const FOOTER = "## Contributing\n\nContributions welcome!";

describe("generateReadme", () => {
  it("produces markdown with tables sorted by stars desc", () => {
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: SAMPLE_API });
    expect(result).toContain("## General-Purpose AutoML");
    expect(result).toContain("PyCaret");
    expect(result).toContain("AutoGluon");
    const pycaretIdx = result.indexOf("PyCaret");
    const autogluonIdx = result.indexOf("AutoGluon");
    expect(pycaretIdx).toBeLessThan(autogluonIdx);
  });

  it("marks archived projects", () => {
    const api: ApiData = {
      ...SAMPLE_API,
      "pycaret/pycaret": { stars: 9500, pushed: "2026-03-15T00:00:00Z", archived: true },
    };
    const result = generateReadme({ yamlContent: SAMPLE_YAML, header: HEADER, footer: FOOTER, apiData: api });
    expect(result).toContain("Archived");
  });
});
