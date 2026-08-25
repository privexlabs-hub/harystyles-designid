/**
 * End-to-end check of the pages layer, against a BUILT site.
 *
 * Covers the things that only break at runtime: that pages survive a reload,
 * that undo addresses the right page after a reorder, and that a project
 * exports one PDF page per artboard.
 *
 *   node scripts/verify-pages.mjs [baseUrl]
 */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? process.env.BASE_URL ?? "http://127.0.0.1:3010";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, acceptDownloads: true });
const page = await context.newPage();

const problems = [];
page.on("console", (m) => m.type() === "error" && problems.push(m.text()));
page.on("pageerror", (e) => problems.push(String(e)));
page.on("dialog", (d) => d.accept());

const rows = [];
const check = (label, got, want = true) => {
  rows.push({ label, got, want, ok: got === want });
  return got === want;
};

/** Reads page count and active index straight out of the store. */
const state = () =>
  page.evaluate(() => {
    const raw = localStorage.getItem("harystyles-editor");
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      pages: parsed?.state?.project?.pages?.length ?? 0,
      active: parsed?.state?.activePage ?? -1,
      ids: (parsed?.state?.project?.pages ?? []).map((p) => p.id),
      version: parsed?.version ?? null,
    };
  });

const byText = (text) => page.locator(`button:text-is("${text}")`).first();

await page.goto(`${BASE}/editor/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1500);

// A fresh editor is a one-page project, so the rail is hidden.
check("rail hidden for a one-page project", (await page.locator('[aria-label="Pages in this project"]').count()) === 0);

// --- add -------------------------------------------------------------------
// Driven entirely through the UI. "Add page" lives in the toolbar precisely
// because the rail hides itself at one page.
await byText("Add page").click();
await page.waitForTimeout(900);

let s = await state();
check("adding gives two pages", s.pages === 2);
check("rail appears", (await page.locator('[aria-label="Pages in this project"]').count()) > 0);

// --- duplicate -------------------------------------------------------------
await byText("Duplicate").click();
await page.waitForTimeout(800);
s = await state();
check("duplicate gives three pages", s.pages === 3);

// --- reorder ---------------------------------------------------------------
const before = (await state()).ids;
// Drag the third page onto the first. Playwright's dragTo issues real pointer
// events, so this exercises the same handlers a person would.
const thumbs = page.locator('[aria-label^="Page "]');
await thumbs.nth(2).dragTo(thumbs.nth(0));
await page.waitForTimeout(700);
const after = (await state()).ids;
check("reorder moved the last page to the front", after[0] === before[2]);

// --- undo ------------------------------------------------------------------
await page.keyboard.press("Meta+z");
await page.waitForTimeout(500);
check("undo restored the original order", (await state()).ids.join() === before.join());

// --- persistence -----------------------------------------------------------
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1500);
s = await state();
check("pages survive a reload", s.pages === 3);
check("persisted state is versioned", s.version === 1);

// --- delete ----------------------------------------------------------------
await byText("Delete").click();
await page.waitForTimeout(800);
check("delete leaves two pages", (await state()).pages === 2);

// --- multi-page pdf --------------------------------------------------------
await byText("PDF").click();
const [dl] = await Promise.all([
  page.waitForEvent("download", { timeout: 180000 }),
  page.locator("button", { hasText: /^Download / }).first().click(),
]);
const pdf = readFileSync(await dl.path());
// Page objects are the only reliable count without a parser.
const pdfPages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log(`  ${dl.suggestedFilename()} — ${(pdf.length / 1024).toFixed(0)} KB, ${pdfPages} page(s)`);
check("pdf header", pdf.toString("ascii", 0, 5) === "%PDF-");
// The project has two pages at this point, so the document must too — this is
// the whole reason multi-page exists.
check(`pdf has one page per artboard (${pdfPages})`, pdfPages === 2);

console.log("");
let failed = 0;
for (const r of rows) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.label}`);
}
console.log(`\n${rows.length - failed}/${rows.length} checks passed`);
if (problems.length) console.log(`console errors:\n  ${problems.slice(0, 5).join("\n  ")}`);

await browser.close();
process.exit(failed || problems.length ? 1 : 0);
