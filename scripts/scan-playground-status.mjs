#!/usr/bin/env node
/**
 * Computes which playground items are integrated (used by real app code outside the playground)
 * and which have a valid design-lint pass (not invalidated by a later source-file edit).
 *
 * Reads:
 *   - app/preview/_shared/integration-manifest.json — id → symbol/cardType + sourcePaths
 *   - app/preview/_shared/lint-passes.json          — id → ISO timestamp of last lint pass
 *
 * Writes:
 *   - app/preview/_shared/status-generated.ts       — INTEGRATED_IDS + CONFIRMED_IDS sets
 *
 * Invoked via `predev` / `prebuild` in package.json. Safe to run anytime; pure read of the repo.
 */

import { readFileSync, writeFileSync, statSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const MANIFEST_PATH = join(REPO_ROOT, "app/preview/_shared/integration-manifest.json");
const LINT_PASSES_PATH = join(REPO_ROOT, "app/preview/_shared/lint-passes.json");
const OUTPUT_PATH = join(REPO_ROOT, "app/preview/_shared/status-generated.ts");

const SEARCH_ROOT = join(REPO_ROOT, "app");
// Paths the scan IGNORES — playground itself + sim files + debug fixtures.
// References from these don't count as "integrated" since they only exist to feed the playground.
const EXCLUDED_DIR_FRAGMENTS = [
  "/app/(main)/playground/",
  "/app/preview/",
];
const EXCLUDED_FILE_FRAGMENTS = [
  "/app/lib/debug-fixtures.ts",
];

function isGloballyExcluded(absPath) {
  const normalized = absPath.replace(/\\/g, "/");
  if (EXCLUDED_DIR_FRAGMENTS.some((frag) => normalized.includes(frag))) return true;
  if (EXCLUDED_FILE_FRAGMENTS.some((frag) => normalized.endsWith(frag))) return true;
  return false;
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, acc);
    } else if (entry.isFile() && /\.(tsx?|jsx?|mjs)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

const allFiles = walk(SEARCH_ROOT);
const candidateFiles = allFiles.filter((f) => !isGloballyExcluded(f));

const IMPORT_RE = /from\s+["']([^"']+)["']/g;

function extractImportPaths(content, fromFile) {
  // Resolve every `from "..."` specifier to an absolute path (sans extension),
  // skipping bare/external packages. Aliased `@/x` resolves to REPO_ROOT/x per tsconfig.
  const resolved = [];
  for (const match of content.matchAll(IMPORT_RE)) {
    const spec = match[1];
    if (spec.startsWith("@/")) {
      resolved.push(join(REPO_ROOT, spec.slice(2)));
    } else if (spec.startsWith(".")) {
      resolved.push(resolve(dirname(fromFile), spec));
    }
  }
  return resolved;
}

function stripExt(p) {
  return p.replace(/\.(tsx?|jsx?|mjs)$/, "");
}

function fileImportsAnyOf(content, fromFile, sourcePathsAbs) {
  const targets = new Set(sourcePathsAbs.map(stripExt));
  return extractImportPaths(content, fromFile).some((r) => targets.has(stripExt(r)));
}

function fileContainsCardType(content, cardType) {
  // Match `type: "<cardType>"` or `type: '<cardType>'`
  const escaped = cardType.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`type\\s*:\\s*["']${escaped}["']`);
  return re.test(content);
}

function isIntegrated(matcher) {
  // An item's own source file doesn't count as "integrated" — exclude it per matcher.
  const ownAbsPaths = matcher.sourcePaths.map((p) => join(REPO_ROOT, p));
  const ownSet = new Set(ownAbsPaths);
  for (const file of candidateFiles) {
    if (ownSet.has(file)) continue;
    const content = readFileSync(file, "utf8");
    if (matcher.kind === "import") {
      if (fileImportsAnyOf(content, file, ownAbsPaths)) return true;
    } else if (matcher.kind === "cardType") {
      if (fileContainsCardType(content, matcher.cardType)) return true;
    }
  }
  return false;
}

function newestSourceMtime(sourcePaths) {
  let newest = 0;
  for (const rel of sourcePaths) {
    try {
      const m = statSync(join(REPO_ROOT, rel)).mtimeMs;
      if (m > newest) newest = m;
    } catch {
      // Missing source file — treat as freshly modified to force re-lint.
      return Date.now();
    }
  }
  return newest;
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
const lintPasses = JSON.parse(readFileSync(LINT_PASSES_PATH, "utf8"));

const integratedIds = [];
const confirmedIds = [];

for (const [, items] of Object.entries(manifest.sections)) {
  for (const [id, matcher] of Object.entries(items)) {
    if (isIntegrated(matcher)) {
      integratedIds.push(id);
      continue;
    }
    const lintedAtIso = lintPasses[id];
    if (typeof lintedAtIso === "string") {
      const lintedAt = Date.parse(lintedAtIso);
      const mtime = newestSourceMtime(matcher.sourcePaths);
      if (Number.isFinite(lintedAt) && mtime <= lintedAt) {
        confirmedIds.push(id);
      }
    }
  }
}

integratedIds.sort();
confirmedIds.sort();

const output = `// AUTO-GENERATED by scripts/scan-playground-status.mjs. Do not edit by hand.
// Regenerated on every \`pnpm dev\` and \`pnpm build\` via the predev/prebuild hooks.
// Source: app/preview/_shared/integration-manifest.json + app/preview/_shared/lint-passes.json

export const INTEGRATED_IDS: ReadonlySet<string> = new Set(${JSON.stringify(integratedIds, null, 2)});

export const CONFIRMED_IDS: ReadonlySet<string> = new Set(${JSON.stringify(confirmedIds, null, 2)});
`;

writeFileSync(OUTPUT_PATH, output, "utf8");

const counts = `integrated=${integratedIds.length} confirmed=${confirmedIds.length}`;
console.log(`[scan-playground-status] ${counts} — wrote ${relative(REPO_ROOT, OUTPUT_PATH)}`);
