import { appendFileSync } from "node:fs";

/**
 * Emit a command's findings.
 *
 * Never route a machine-read report through stdout: `pnpm run <script>` prints
 * its own lockfile-verification summary there whenever its check is stale, so
 * a weekly run on a cold runner appended
 *   "Lockfile passes supply-chain policies ... Done in 782ms using pnpm v11"
 * to the drift report and filed it as a catalog-drift issue. Locally the same
 * command wrote nothing, because pnpm stays quiet when it verified recently —
 * which is exactly why this cannot be tested away.
 *
 * With `--report=<path>` the findings go to that file and nothing else does,
 * so "the file is non-empty" means "something drifted". Without it they go to
 * stdout, which is fine for a human reading the terminal.
 */
export function emitReport(markdown: string, reportPath: string | undefined): void {
  if (markdown === "") return;
  const body = markdown.endsWith("\n") ? markdown : `${markdown}\n`;
  if (reportPath) {
    appendFileSync(reportPath, body, "utf-8");
  } else {
    process.stdout.write(body);
  }
}
