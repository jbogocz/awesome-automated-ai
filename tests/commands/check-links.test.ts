import { describe, expect, it } from "vitest";
import { extractUrls, isMeaningfulRedirect, isThrottled } from "../../src/commands/check-links.js";

/**
 * Every "moved" finding lands in the weekly drift issue, so a redirect that is
 * routine site routing pins that issue open with nothing to fix.
 */
describe("isMeaningfulRedirect", () => {
  it("ignores scheme and trailing-slash changes", () => {
    expect(isMeaningfulRedirect("http://example.com/docs", "https://example.com/docs/")).toBe(false);
  });

  it("ignores www being added or dropped", () => {
    expect(isMeaningfulRedirect("https://example.com/a", "https://www.example.com/a")).toBe(false);
  });

  it("ignores a bare domain rolling over into its own subdomain", () => {
    expect(isMeaningfulRedirect("https://automl.cc", "https://2026.automl.cc/")).toBe(false);
  });

  it("ignores a page forwarding into its own subtree", () => {
    expect(isMeaningfulRedirect("https://huggingface.co/papers", "https://huggingface.co/papers/date/2026-10-02")).toBe(
      false,
    );
  });

  it("ignores login walls and interstitials", () => {
    expect(isMeaningfulRedirect("https://www.nature.com/articles/x", "https://idp.nature.com/authorize?x")).toBe(false);
  });

  it("reports a move to another host", () => {
    expect(isMeaningfulRedirect("https://paperswithcode.com", "https://huggingface.co/papers")).toBe(true);
  });

  it("reports a move to a sibling path on the same host", () => {
    expect(isMeaningfulRedirect("https://example.com/old-tool", "https://example.com/new-tool")).toBe(true);
  });

  it("reports a root redirecting into a path, which is a real destination", () => {
    expect(isMeaningfulRedirect("https://example.com/", "https://example.com/en/product")).toBe(true);
  });

  it("does not treat a shared prefix as a subtree", () => {
    expect(isMeaningfulRedirect("https://example.com/paper", "https://example.com/papers")).toBe(true);
  });
});

describe("isThrottled", () => {
  it("treats only 429 as throttling", () => {
    expect(isThrottled(429)).toBe(true);
    expect(isThrottled(404)).toBe(false);
    expect(isThrottled(null)).toBe(false);
  });
});

describe("extractUrls", () => {
  it("strips trailing prose punctuation and collapses duplicates", () => {
    const text = "See https://a.dev/x. Also [b](https://b.dev/y), and https://a.dev/x again.";
    expect(extractUrls(text)).toEqual(["https://a.dev/x", "https://b.dev/y"]);
  });
});
