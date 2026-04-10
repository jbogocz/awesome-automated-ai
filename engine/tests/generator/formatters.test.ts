import { describe, expect, it } from "vitest";
import {
  activityDot,
  formatDateMonth,
  formatStarsShort,
  generateTagline,
  progressBar,
} from "../../src/generator/formatters.js";

// Helper to build a date string N days ago from now
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

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

  it("returns one-decimal M for millions", () => {
    expect(formatStarsShort(1200000)).toBe("1.2M");
  });
});

describe("progressBar", () => {
  it("returns all empty for 0", () => {
    expect(progressBar(0)).toBe("░░░░░░░░░░");
  });

  it("returns partial at threshold 5", () => {
    expect(progressBar(5)).toBe("▓░░░░░░░░░");
  });

  it("handles score 22 - 2 filled, no partial", () => {
    expect(progressBar(22)).toBe("██░░░░░░░░");
  });

  it("handles score 55 - 5 filled plus partial", () => {
    expect(progressBar(55)).toBe("█████▓░░░░");
  });

  it("handles score 60 - 6 filled no partial", () => {
    expect(progressBar(60)).toBe("██████░░░░");
  });

  it("handles score 88 - 8 filled plus partial", () => {
    expect(progressBar(88)).toBe("████████▓░");
  });

  it("returns all filled for 100", () => {
    expect(progressBar(100)).toBe("██████████");
  });
});

describe("activityDot", () => {
  it("returns green for recent push (30 days ago)", () => {
    expect(activityDot(daysAgo(30), false)).toBe("🟢");
  });

  it("returns yellow for stale push (250 days ago)", () => {
    expect(activityDot(daysAgo(250), false)).toBe("🟡");
  });

  it("returns red for dead push (400 days ago)", () => {
    expect(activityDot(daysAgo(400), false)).toBe("🔴");
  });

  it("returns red for archived repo even if recently pushed", () => {
    expect(activityDot(daysAgo(30), true)).toBe("🔴");
  });

  it("returns red for empty pushed string", () => {
    expect(activityDot("", false)).toBe("🔴");
  });
});

describe("generateTagline", () => {
  it("takes first 7 words", () => {
    expect(
      generateTagline("Declarative deep learning framework supporting custom model building and LLM fine-tuning"),
    ).toBe("Declarative deep learning framework supporting custom model");
  });

  it("strips trailing punctuation", () => {
    expect(generateTagline("Fast ML framework, easy to use.")).toBe("Fast ML framework, easy to use");
  });

  it("escapes ampersand", () => {
    expect(generateTagline("Training & tuning toolkit for ML")).toBe("Training &amp; tuning toolkit for ML");
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
