import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const pkgPath = resolve(process.cwd(), "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

const d = new Date();
const nextVersion = `${d.getUTCFullYear()}.${d.getUTCMonth() + 1}.${d.getUTCDate()}`;

if (pkg.version === nextVersion) {
  console.log(`version already ${nextVersion}`);
  process.exit(0);
}

pkg.version = nextVersion;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
console.log(`bumped version to ${nextVersion}`);
