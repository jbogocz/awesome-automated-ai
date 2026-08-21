import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { emitReport } from "../../src/utils/report.js";

const dir = mkdtempSync(join(tmpdir(), "report-test-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

/**
 * The weekly job decides "did anything drift?" purely from whether this file is
 * non-empty, so the file must contain findings and nothing else. It once
 * contained pnpm's lockfile-verification banner, because the report travelled
 * through stdout and `pnpm run` writes there too.
 */
describe("emitReport", () => {
  it("does not create the file at all when there is nothing to report", () => {
    const path = join(dir, "clean.md");
    emitReport("", path);
    expect(existsSync(path)).toBe(false);
  });

  it("appends findings so two reporters can share one file", () => {
    const path = join(dir, "both.md");
    emitReport("## Catalog drift\n\n- one\n", path);
    emitReport("## Link rot\n\n- two\n", path);
    expect(readFileSync(path, "utf-8")).toBe("## Catalog drift\n\n- one\n## Link rot\n\n- two\n");
  });

  it("leaves an unrelated writer's content alone rather than truncating it", () => {
    const path = join(dir, "preexisting.md");
    writeFileSync(path, "earlier\n");
    emitReport("later\n", path);
    expect(readFileSync(path, "utf-8")).toBe("earlier\nlater\n");
  });

  it("terminates a report that does not end in a newline", () => {
    const path = join(dir, "nl.md");
    emitReport("no trailing newline", path);
    expect(readFileSync(path, "utf-8")).toBe("no trailing newline\n");
  });

  it("falls back to stdout when no report path is given", () => {
    const written: string[] = [];
    const original = process.stdout.write;
    process.stdout.write = ((chunk: string) => {
      written.push(String(chunk));
      return true;
    }) as typeof process.stdout.write;
    try {
      emitReport("- finding\n", undefined);
      emitReport("", undefined);
    } finally {
      process.stdout.write = original;
    }
    expect(written).toEqual(["- finding\n"]);
  });
});
