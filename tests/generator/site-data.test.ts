import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loadApiData } from "../../src/generator/fetch-api.ts";
import { main } from "../../src/generator/site-data.ts";

vi.mock("node:fs", async (original) => ({
  ...(await original<typeof import("node:fs")>()),
  mkdirSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock("../../src/generator/fetch-api.ts", async (original) => {
  const actual = await original<typeof import("../../src/generator/fetch-api.ts")>();
  return { ...actual, loadApiData: vi.fn(actual.loadApiData) };
});

afterEach(() => {
  vi.mocked(writeFileSync).mockClear();
  vi.restoreAllMocks();
});

describe("site-data coverage gate", () => {
  it("refuses to write the feed when repos resolve to no stats", () => {
    vi.mocked(loadApiData).mockReturnValueOnce({});
    vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`exit ${code}`);
    });

    expect(() => main()).toThrow("exit 1");
    expect(writeFileSync).not.toHaveBeenCalled();
  });

  it("writes the feed from the committed measurements", () => {
    main();
    expect(writeFileSync).toHaveBeenCalledOnce();
    expect(vi.mocked(writeFileSync).mock.calls[0]?.[0]).toBe(resolve(import.meta.dirname, "../../docs/data.json"));
  });
});
