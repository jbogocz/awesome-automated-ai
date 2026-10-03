import { describe, expect, it } from "vitest";
import { renderAuditReport, UNFETCHABLE_DAYS, unfetchableDetail } from "../../src/commands/audit.js";

const NOW = new Date("2026-10-05T06:00:00Z");

describe("unfetchableDetail", () => {
  it("reports an entry that has never been measured", () => {
    expect(unfetchableDetail("o/r", null, NOW)).toMatch(/never been fetched/);
  });

  it("reports an entry whose newest snapshot is older than the threshold", () => {
    expect(unfetchableDetail("o/r", "2026-09-14", NOW)).toMatch(/last refreshed 2026-09-14 \(21 days ago\)/);
  });

  // One missed week is already covered by the generate fallback's stale marker.
  it(`stays quiet within ${UNFETCHABLE_DAYS} days`, () => {
    expect(unfetchableDetail("o/r", "2026-10-05", NOW)).toBeNull();
    expect(unfetchableDetail("o/r", "2026-09-21", NOW)).toBeNull();
  });
});

describe("renderAuditReport", () => {
  it("gives unfetchable entries their own heading", () => {
    const report = renderAuditReport([
      { kind: "unfetchable", entry: "Cat / Tool", detail: "o/r has never been fetched" },
    ]);
    expect(report).toContain(`### Not refreshed in ${UNFETCHABLE_DAYS}+ days - fetch keeps failing (1)`);
    expect(report).toContain("- **Cat / Tool** — o/r has never been fetched");
  });
});
