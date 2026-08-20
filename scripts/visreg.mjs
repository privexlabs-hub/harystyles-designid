/**
 * DOM-vs-Satori visual regression.
 *
 * The preview and the export come from one element tree, but two renderers.
 * Nothing enforces that they agree — this does. For every template in the
 * registry it screenshots the React DOM artboard out of a real browser and
 * rasterises the Satori render of the same request, then diffs the two pixel
 * for pixel.
 *
 *   npm run visreg               check against visreg.baseline.json
 *   npm run visreg -- --update   record what the pipeline currently produces
 *   npm run visreg -- --filter square/big-stat
 *
 * Baselines record the drift that is already there, so a run fails on a change
 * for the worse rather than on the backlog. Raising a baseline is a deliberate,
 * reviewable edit to a committed file; raising the tolerance to make a run pass
 * defeats the whole exercise.
 *
 * Needs `next dev` up — the DOM half has to come from the real app, and the
 * Satori half fetches its fonts from the same origin.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, ".visreg");
// Committed, unlike .visreg/ — a baseline change is a reviewable diff.
const BASELINE = join(ROOT, "visreg.baseline.json");

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const UPDATE = flag("update");
const KEEP_ALL = flag("keep-all");
const FILTER = value("filter", "");
/** Browser tabs run in parallel — the catalog is in the hundreds of variants. */
const JOBS = Math.max(1, Number(value("jobs", "4")));
const BASE = process.env.BASE_URL ?? "http://localhost:3007";

/**
 * How much fresh drift a variant may gain before it counts as a regression,
 * in percentage points of mismatched pixels.
 *
 * The default is deliberately tight. Antialiasing along a curve moves a
 * fraction of a percent between the two rasterisers; anything past that is a
 * layout difference, which is the thing worth failing on.
 */
const DEFAULT_TOLERANCE = Number(value("tolerance", "0.25"));

/** Templates whose drift is structurally larger, with the reason recorded. */
const TOLERANCE = {
  // e.g. "square/big-stat": 0.6, // very large glyphs — more edge than area
};

// The font loader resolves its URLs through lib/assetUrl.ts, which prepends
// this. Pointing it at the dev server is what lets the app's own, unmodified
// font code run outside the browser.
process.env.NEXT_PUBLIC_BASE_PATH = BASE;

const { chromium } = await import("playwright");
const { default: pixelmatch } = await import("pixelmatch");
const { PNG } = await import("pngjs");
const { Resvg } = await import("@resvg/resvg-js");
const { TEMPLATES } = await import("../lib/templates/registry.ts");
const { renderTemplate } = await import("../lib/templates/render.tsx");
const { renderToSvg } = await import("../lib/satori/render.ts");
const { THEMES } = await import("../lib/templates/theme.ts");

// ---------------------------------------------------------------- variants

/**
 * A representative spread rather than the full product of the axes.
 *
 * Themes and layouts are the two that change what is drawn — a theme swaps
 * every colour, a layout swaps the arrangement. The rest are covered by
 * lint:satori, which walks all of them.
 */
function variantsFor(template) {
  const out = new Map();
  const add = (label, variant) => out.set(label, variant);

  add("default", {});
  for (const theme of THEMES) add(`theme:${theme}`, { theme });
  template.layouts.forEach((name, i) => {
    if (i > 0) add(`layout:${i}-${name.toLowerCase().replace(/\W+/g, "-")}`, { layout: i });
  });

  return [...out].map(([label, variant]) => ({ label, variant }));
}

// ---------------------------------------------------------------- captures

async function satoriPng(template, size, variant) {
  const svg = await renderToSvg(renderTemplate({ template, size, variant }), {
    width: size.w,
    height: size.h,
  });
  // fitTo zoom 1 — the SVG is authored at the artboard's true dimensions, and
  // the browser screenshot is taken at deviceScaleFactor 1, so neither side is
  // resampled before the diff.
  const resvg = new Resvg(svg, { fitTo: { mode: "zoom", value: 1 } });
  // The node binding manages its own buffers, unlike the wasm one in
  // lib/export/raster.ts — there is nothing to free here.
  return resvg.render().asPng();
}

async function domPng(page, template, size, variant) {
  const query = new URLSearchParams({ t: template.id, size: size.id });
  for (const [k, v] of Object.entries(variant)) query.set(k, String(v));

  await page.setViewportSize({ width: size.w, height: Math.min(size.h, 4000) });
  await page.goto(`${BASE}/visreg/?${query}`, { waitUntil: "domcontentloaded" });
  const artboard = page.locator("[data-artboard]");
  await artboard.waitFor({ state: "attached", timeout: 30_000 });
  await page.waitForFunction(
    () => document.querySelector("[data-artboard]")?.getAttribute("data-ready") === "1",
    undefined,
    { timeout: 60_000 },
  );
  // Clipped by rectangle rather than by element: the artboard is pinned to the
  // viewport origin, so this is exactly the artboard and exactly its declared
  // dimensions, which is what makes the diff a like-for-like comparison.
  return page.screenshot({
    clip: { x: 0, y: 0, width: size.w, height: size.h },
    scale: "device",
  });
}

// ---------------------------------------------------------------- diffing

function diff(aBytes, bBytes) {
  const a = PNG.sync.read(aBytes);
  const b = PNG.sync.read(bBytes);

  if (a.width !== b.width || a.height !== b.height) {
    return { mismatch: 100, note: `${a.width}×${a.height} vs ${b.width}×${b.height}`, png: null };
  }

  const out = new PNG({ width: a.width, height: a.height });
  const changed = pixelmatch(a.data, b.data, out.data, a.width, a.height, {
    threshold: 0.1,
    includeAA: false,
    alpha: 0.2,
    diffColor: [255, 0, 128],
  });

  return {
    mismatch: (changed / (a.width * a.height)) * 100,
    note: `${changed.toLocaleString()} px`,
    png: out,
  };
}

// ---------------------------------------------------------------- run

mkdirSync(OUT, { recursive: true });

let baselines = {};
try {
  baselines = JSON.parse(readFileSync(BASELINE, "utf8"));
} catch {
  if (!UPDATE) console.log("no baseline yet — every variant is measured against zero drift\n");
}

const templates = TEMPLATES.filter((t) => !FILTER || t.id.includes(FILTER));
if (!templates.length) {
  console.error(`no templates match --filter=${FILTER}`);
  process.exit(1);
}

// Stale artefacts from an earlier run read as current failures.
for (const name of ["diffs"]) rmSync(join(OUT, name), { recursive: true, force: true });
mkdirSync(join(OUT, "diffs"), { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 1 });

const problems = [];

const queue = templates.flatMap((template) =>
  variantsFor(template).map(({ label, variant }) => ({ template, label, variant })),
);

const rows = new Array(queue.length);
const measured = {};

async function runOne(page, { template, label, variant }, index) {
    const size = template.sizes[0];
    const key = `${template.id}|${label}`;
    const slug = key.replace(/[^\w.-]+/g, "_");

    let row;
    try {
      const [dom, satori] = await Promise.all([
        domPng(page, template, size, variant),
        satoriPng(template, size, variant),
      ]);
      const { mismatch, note, png } = diff(dom, satori);
      measured[key] = Number(mismatch.toFixed(3));

      const tolerance = TOLERANCE[template.id] ?? DEFAULT_TOLERANCE;
      const baseline = baselines[key];
      const budget = (baseline ?? 0) + tolerance;
      const pass = UPDATE || mismatch <= budget;

      row = {
        template: template.id,
        label,
        mismatch,
        baseline,
        note,
        verdict: UPDATE ? "baselined" : pass ? "ok" : "REGRESSED",
      };

      if (!pass || KEEP_ALL) {
        writeFileSync(join(OUT, "diffs", `${slug}.dom.png`), dom);
        writeFileSync(join(OUT, "diffs", `${slug}.satori.png`), satori);
        if (png) writeFileSync(join(OUT, "diffs", `${slug}.diff.png`), PNG.sync.write(png));
      }
    } catch (err) {
      row = {
        template: template.id,
        label,
        mismatch: NaN,
        note: err.message.split("\n")[0].slice(0, 80),
        verdict: "ERROR",
      };
    }

    rows[index] = row;
    process.stdout.write(row.verdict === "ok" ? "." : row.verdict === "baselined" ? "+" : "x");
}

// One page per worker, taken from a shared queue so a slow artboard does not
// hold up the rest.
let next = 0;
await Promise.all(
  Array.from({ length: Math.min(JOBS, queue.length) }, async () => {
    const page = await context.newPage();
    page.on("pageerror", (e) => problems.push(String(e)));
    for (let i = next++; i < queue.length; i = next++) await runOne(page, queue[i], i);
    await page.close();
  }),
);

process.stdout.write("\n\n");
await browser.close();

// ---------------------------------------------------------------- report

const w = (s, n) => String(s).padEnd(n).slice(0, n);
const pct = (n) => (Number.isNaN(n) ? "    —" : `${n.toFixed(3)}%`.padStart(8));

console.log(`${w("TEMPLATE", 30)} ${w("VARIANT", 24)} ${"MISMATCH".padStart(8)} ${"BASE".padStart(8)}  VERDICT`);
console.log("-".repeat(88));
for (const r of rows) {
  console.log(
    `${w(r.template, 30)} ${w(r.label, 24)} ${pct(r.mismatch)} ` +
      `${r.baseline == null ? "       —" : pct(r.baseline)}  ${r.verdict}` +
      (r.verdict === "ok" ? "" : `  (${r.note})`),
  );
}

const failed = rows.filter((r) => r.verdict === "REGRESSED" || r.verdict === "ERROR");
const worst = rows.filter((r) => !Number.isNaN(r.mismatch)).sort((a, b) => b.mismatch - a.mismatch)[0];

console.log("-".repeat(88));
console.log(
  `${rows.length} variants across ${templates.length} templates · ` +
    `worst drift ${worst ? `${worst.mismatch.toFixed(3)}% (${worst.template} ${worst.label})` : "n/a"} · ` +
    `tolerance ${DEFAULT_TOLERANCE}pp`,
);

if (problems.length) console.log(`\npage errors:\n  ${[...new Set(problems)].join("\n  ")}`);

if (UPDATE) {
  // Merged, not replaced: a filtered --update must not silently drop the
  // baselines of every template it did not look at.
  const next = Object.fromEntries(
    Object.entries({ ...baselines, ...measured }).sort(([a], [b]) => a.localeCompare(b)),
  );
  writeFileSync(BASELINE, `${JSON.stringify(next, null, 2)}\n`);
  console.log(
    `\nbaseline written — ${Object.keys(measured).length} variants updated, ` +
      `${Object.keys(next).length} in visreg.baseline.json`,
  );
  process.exit(0);
}

if (failed.length) {
  console.log(`\n${failed.length} regressed — diffs in .visreg/diffs/`);
  process.exit(1);
}

console.log("\nno regression");
