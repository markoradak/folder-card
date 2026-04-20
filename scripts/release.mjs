#!/usr/bin/env node
// scripts/release.mjs
//
// Bumps @markoradak/folder-card, commits, tags, pushes.
// The GitHub Actions release workflow publishes via OIDC (Trusted Publisher).
//
// Usage: pnpm release:patch | release:minor | release:major

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const bump = process.argv[2];
if (!["patch", "minor", "major"].includes(bump)) {
  console.error("Usage: node scripts/release.mjs <patch|minor|major>");
  process.exit(1);
}

function sh(cmd, opts = {}) {
  return execSync(cmd, { stdio: "inherit", ...opts });
}
function shCapture(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

const branch = shCapture("git rev-parse --abbrev-ref HEAD");
console.log(`\nReleasing from branch: ${branch}\n`);

if (branch !== "main") {
  console.error(`Error: must release from main (currently on ${branch})`);
  process.exit(1);
}

if (shCapture("git status --porcelain")) {
  console.error("Error: working tree not clean. Commit or stash first.");
  process.exit(1);
}

sh("git pull --ff-only origin main");

// Preflight — same checks that CI runs, fail fast locally.
sh("pnpm -C packages/react typecheck");
sh("pnpm -C packages/react test");
sh("pnpm -C packages/react build");

// Bump version in the package. npm version (not pnpm) so this works
// reliably with pnpm 10, which doesn't ship its own version command.
sh(`npm version ${bump} --no-git-tag-version`, { cwd: "packages/react" });

const pkg = JSON.parse(
  readFileSync("packages/react/package.json", "utf8"),
);
const tag = `v${pkg.version}`;

sh("git add packages/react/package.json");
sh(`git commit -m "chore: release ${tag}"`);
sh(`git tag -a ${tag} -m "Release ${tag}"`);

// Push branch + tag together. --follow-tags pushes annotated tags
// that point to commits included in the push.
sh(`git push --follow-tags origin ${branch}`);

console.log(`
Released ${tag} and pushed to origin/${branch}.
Watch the publish workflow at:
  https://github.com/markoradak/folder-card/actions
`);
