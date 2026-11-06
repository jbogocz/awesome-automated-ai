import { describe, expect, it } from "vitest";
import {
  escapeCardBody,
  escapeHtml,
  formatDateMonth,
  formatStarsShort,
  generateTagline,
} from "../../src/generator/formatters.ts";

describe("formatStarsShort", () => {
  it("returns '0' for 0", () => {
    expect(formatStarsShort(0)).toBe("0");
  });

  it("returns exact number below 1000", () => {
    expect(formatStarsShort(449)).toBe("449");
    expect(formatStarsShort(999)).toBe("999");
  });

  it("returns 1.0K for exactly 1000", () => {
    expect(formatStarsShort(1000)).toBe("1.0K");
  });

  it("returns one-decimal K for thousands", () => {
    expect(formatStarsShort(4320)).toBe("4.3K");
    expect(formatStarsShort(11665)).toBe("11.7K");
    expect(formatStarsShort(69721)).toBe("69.7K");
  });

  it("rolls over to M where one decimal of K would round up to 1000", () => {
    expect(formatStarsShort(999_949)).toBe("999.9K");
    expect(formatStarsShort(999_950)).toBe("1.0M");
  });

  it("returns one-decimal M for millions", () => {
    expect(formatStarsShort(1200000)).toBe("1.2M");
  });
});

// Dot/status logic moved to src/status.ts — covered by tests/status.test.ts.

describe("generateTagline", () => {
  it("takes first 7 words", () => {
    expect(
      generateTagline("Declarative deep learning framework supporting custom model building and LLM fine-tuning"),
    ).toBe("Declarative deep learning framework supporting custom model");
  });

  it("strips trailing punctuation", () => {
    expect(generateTagline("Fast ML framework, easy to use.")).toBe("Fast ML framework, easy to use");
  });

  it("returns plain text; escaping happens where it is rendered", () => {
    expect(generateTagline("Training & tuning toolkit for ML")).toBe("Training & tuning toolkit for ML");
  });

  it("passes through short text", () => {
    expect(generateTagline("Short text")).toBe("Short text");
  });

  it("respects custom maxWords", () => {
    expect(generateTagline("one two three four five six seven eight", 3)).toBe("one two three");
  });
});

describe("formatDateMonth", () => {
  it("formats April 2026 correctly", () => {
    expect(formatDateMonth("2026-04-15T00:00:00Z")).toBe("Apr 2026");
  });

  it("formats December 2025 correctly", () => {
    expect(formatDateMonth("2025-12-01T00:00:00Z")).toBe("Dec 2025");
  });

  it("returns '-' for empty string", () => {
    expect(formatDateMonth("")).toBe("-");
  });
});

describe("escapeHtml", () => {
  it("neutralises everything that could open a tag or break an attribute", () => {
    expect(escapeHtml('R&D <model> "x"')).toBe("R&amp;D &lt;model&gt; &quot;x&quot;");
  });

  it("leaves markdown syntax alone", () => {
    expect(escapeHtml("**bold** `code` [link](https://a.dev)")).toBe("**bold** `code` [link](https://a.dev)");
  });
});

describe("escapeCardBody", () => {
  // Each result was checked against GitHub's renderer: no link or image in any.
  it.each([
    ["[click](https://a.dev)", "\\[click](https://a.dev)"],
    ["![pixel](https://a.dev/p.png)", "!\\[pixel](https://a.dev/p.png)"],
    ["\\[click](https://a.dev)", "\\\\\\[click](https://a.dev)"],
    ["\\\\[click](https://a.dev)", "\\\\\\\\\\[click](https://a.dev)"],
    ["!\\[pixel](https://a.dev/p.png)", "!\\\\\\[pixel](https://a.dev/p.png)"],
  ])("leaves %s inert", (input, expected) => {
    expect(escapeCardBody(input)).toBe(expected);
  });

  it("escapes HTML as well", () => {
    expect(escapeCardBody("<img src=x>")).toBe("&lt;img src=x&gt;");
  });
});
