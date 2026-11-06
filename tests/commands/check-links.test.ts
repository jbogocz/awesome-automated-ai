import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
  collectTargets,
  extractUrls,
  isMeaningfulRedirect,
  isThrottled,
  renderLinkReport,
  runCheckLinksCommand,
} from "../../src/commands/check-links.ts";

const tmpDir = mkdtempSync(join(tmpdir(), "check-links-test-"));
afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

function writeYaml(name: string, entries: string): string {
  const path = join(tmpDir, name);
  writeFileSync(path, `categories:\n  - name: C\n    entries:\n${entries}`);
  return path;
}

describe("collectTargets", () => {
  // The custom url is the link the README and dashboard render for the entry,
  // and the metadata fetch only ever visits the repo.
  it("probes a repo-backed entry's own url", () => {
    const path = writeYaml(
      "targets.yaml",
      "      - { name: Tune, repo: o/r, url: 'https://docs.example.com/tune/', description: d }\n" +
        "      - { name: Plain, repo: o/plain, description: d }\n",
    );
    expect(collectTargets({ projectsYamlPath: path, templatePaths: [] }).map((t) => t.url)).toEqual([
      "https://docs.example.com/tune/",
    ]);
  });
});

describe("runCheckLinksCommand", () => {
  // Only the status is wanted. An unread body held the connection, and with it
  // the process, for undici's 300s body timeout after the report was written.
  it("closes the connection of a response whose body it did not read", async () => {
    const closed = Promise.withResolvers<void>();
    const server = createServer((req, res) => {
      if (req.method === "HEAD") {
        res.statusCode = 405;
        res.end();
        return;
      }
      res.writeHead(200);
      res.flushHeaders();
      res.on("close", () => closed.resolve());
    });
    await new Promise<void>((ready) => server.listen(0, "127.0.0.1", ready));
    try {
      const { port } = server.address() as AddressInfo;
      const path = writeYaml(
        "silent.yaml",
        `      - { name: Silent, url: 'http://127.0.0.1:${port}/', description: d }\n`,
      );
      await expect(runCheckLinksCommand({ projectsYamlPath: path, templatePaths: [] })).resolves.toBe(0);
      const timeout = new Promise<string>((done) => setTimeout(() => done("still open"), 2_000));
      await expect(Promise.race([closed.promise.then(() => "closed"), timeout])).resolves.toBe("closed");
    } finally {
      server.closeAllConnections();
      server.close();
    }
  });
});

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

describe("renderLinkReport", () => {
  it("renders nothing when every link is healthy", () => {
    expect(renderLinkReport([], [])).toBe("");
  });

  // Same heading level and count format as the audit's sections, which share the issue.
  it("renders one counted section covering dead and moved links", () => {
    const report = renderLinkReport(
      [{ url: "https://a.example/", where: "projects.yaml: A", status: 404, finalUrl: null }],
      [{ url: "https://b.example/old", where: "projects.yaml: B", status: 200, finalUrl: "https://b.example/new" }],
    );
    expect(report).toBe(
      "### Link rot (2)\n\n" +
        "- **dead** `https://a.example/` -> HTTP 404 (projects.yaml: A)\n" +
        "- **moved** `https://b.example/old` -> `https://b.example/new` (projects.yaml: B)\n",
    );
  });
});
