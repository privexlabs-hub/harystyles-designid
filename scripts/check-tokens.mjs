/**
 * Asserts lib/color.ts and app/tokens.css agree.
 *
 * The two exist because Satori cannot read CSS custom properties, so every
 * palette value is written twice. This check makes that duplication safe: if a
 * token moves in the stylesheet and not in the TypeScript, the build fails
 * rather than the exports quietly drifting from the documentation.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { OKLCH_TOKENS } from "../lib/color.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(ROOT, "app/tokens.css"), "utf8");

/** Only the raw ramps are mirrored; semantic roles are aliases of these. */
const MIRRORED = /^(ink|amber|wine|indigo|mood)-/;

const inCss = new Map();
for (const [, name, l, c, h] of css.matchAll(
  /--([\w-]+):\s*oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/g,
)) {
  inCss.set(name, [Number(l), Number(c), Number(h)]);
}

const problems = [];

for (const [name, [l, c, h]] of Object.entries(OKLCH_TOKENS)) {
  if (!MIRRORED.test(name)) continue;
  const css = inCss.get(name);
  if (!css) {
    problems.push(`${name}: in lib/color.ts but not in app/tokens.css`);
    continue;
  }
  if (css[0] !== l || css[1] !== c || css[2] !== h) {
    problems.push(
      `${name}: tokens.css has (${css.join(" ")}), lib/color.ts has (${l} ${c} ${h})`,
    );
  }
}

for (const name of inCss.keys()) {
  if (MIRRORED.test(name) && !(name in OKLCH_TOKENS)) {
    problems.push(`${name}: in app/tokens.css but not in lib/color.ts`);
  }
}

const checked = Object.keys(OKLCH_TOKENS).filter((n) => MIRRORED.test(n)).length;

if (problems.length) {
  console.error(`Token mismatch (${problems.length}):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

console.log(`tokens in step — ${checked} ramp values match app/tokens.css`);
