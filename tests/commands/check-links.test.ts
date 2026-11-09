import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
  carryOutages,
  collectTargets,
  extractUrls,
  isMeaningfulRedirect,
  isOutage,
  isThrottled,
  type LinkResult,
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

/**
 * 2026-11-09: proceedings.neurips.cc and proceedings.iclr.cc (one server)
 * refused every connection for hours, and four correct links were filed as
 * dead. A single run cannot tell an outage from a host that is gone, so a
 * connection failure or 5xx is reported only when the next weekly run sees it too.
 */
describe("isOutage", () => {
  it("treats connection failures and server errors as outages", () => {
    expect(isOutage({ url: "u", where: "w", status: null, finalUrl: null, error: "fetch failed" })).toBe(true);
    expect(isOutage({ url: "u", where: "w", status: 503, finalUrl: "u" })).toBe(true);
  });

  it("treats a 4xx as an answer about the page, not an outage", () => {
    expect(isOutage({ url: "u", where: "w", status: 404, finalUrl: "u" })).toBe(false);
  });
});

describe("carryOutages", () => {
  const down = (url: string): LinkResult => ({ url, where: "w", status: null, finalUrl: null, error: "fetch failed" });

  it("holds back an outage seen for the first time and remembers when it started", () => {
    const { report, next } = carryOutages([down("https://a.example/")], {}, "2026-11-09");
    expect(report).toEqual([]);
    expect(next).toEqual({ "https://a.example/": "2026-11-09" });
  });

  it("reports an outage the previous weekly run already saw", () => {
    const { report, next } = carryOutages(
      [down("https://a.example/")],
      { "https://a.example/": "2026-11-09" },
      "2026-11-16",
    );
    expect(report).toEqual([{ ...down("https://a.example/"), downSince: "2026-11-09" }]);
    expect(next).toEqual({ "https://a.example/": "2026-11-09" });
  });

  // A dispatch or a hand run mid-week must not promote a fresh outage.
  it("does not report an outage that started earlier the same week", () => {
    const { report } = carryOutages([down("https://a.example/")], { "https://a.example/": "2026-11-09" }, "2026-11-11");
    expect(report).toEqual([]);
  });

  it("forgets a link once it answers again", () => {
    const { next } = carryOutages([], { "https://a.example/": "2026-11-09" }, "2026-11-16");
    expect(next).toEqual({});
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

  it("says since when an outage has lasted", () => {
    const report = renderLinkReport(
      [
        {
          url: "https://a.example/",
          where: "templates/footer.md",
          status: null,
          finalUrl: null,
          error: "fetch failed (ECONNREFUSED)",
          downSince: "2026-11-09",
        },
      ],
      [],
    );
    expect(report).toBe(
      "### Link rot (1)\n\n" +
        "- **unreachable since 2026-11-09** `https://a.example/` -> fetch failed (ECONNREFUSED) (templates/footer.md)\n",
    );
  });
});

describe("runCheckLinksCommand with an outage file", () => {
  // A closed port refuses the connection, as 198.202.70.94 did.
  it("records a first outage without reporting it, then reports it a week later", async () => {
    const server = createServer();
    await new Promise<void>((ready) => server.listen(0, "127.0.0.1", ready));
    const { port } = server.address() as AddressInfo;
    await new Promise<void>((done) => server.close(() => done()));

    const yaml = writeYaml("outage.yaml", `      - { name: Down, url: 'http://127.0.0.1:${port}/', description: d }\n`);
    const outagesPath = join(tmpDir, "outages.json");
    const reportPath = join(tmpDir, "outage-report.md");
    const opts = { projectsYamlPath: yaml, templatePaths: [], outagesPath, reportPath };

    await expect(runCheckLinksCommand({ ...opts, today: "2026-11-09" })).resolves.toBe(0);
    expect(existsSync(reportPath)).toBe(false);
    expect(JSON.parse(readFileSync(outagesPath, "utf-8"))).toEqual({ [`http://127.0.0.1:${port}/`]: "2026-11-09" });

    await expect(runCheckLinksCommand({ ...opts, today: "2026-11-16" })).resolves.toBe(1);
    expect(readFileSync(reportPath, "utf-8")).toContain("**unreachable since 2026-11-09**");
  });

  it("reports an outage at once when no outage file is kept", async () => {
    const server = createServer();
    await new Promise<void>((ready) => server.listen(0, "127.0.0.1", ready));
    const { port } = server.address() as AddressInfo;
    await new Promise<void>((done) => server.close(() => done()));

    const yaml = writeYaml(
      "outage-now.yaml",
      `      - { name: Down, url: 'http://127.0.0.1:${port}/', description: d }\n`,
    );
    await expect(runCheckLinksCommand({ projectsYamlPath: yaml, templatePaths: [] })).resolves.toBe(1);
  });
});
