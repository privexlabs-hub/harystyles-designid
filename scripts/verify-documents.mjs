/**
 * Document starters, end to end: begin one, check it arrived as a real
 * multi-page project, and export it as a correctly paginated PDF.
 *
 *   node scripts/verify-documents.mjs [baseUrl]
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
const check = (label, got, want = true) => rows.push({ label, got, want, ok: got === want });

await page.goto(`${BASE}/shelf/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);

check("all four starters are offered", (await page.locator("text=/^(A notebook|A letter, printed|A press kit|The annual letter)$/").count()) === 4);

await page.locator("button", { hasText: "A notebook" }).first().click();
await page.waitForURL(/\/editor/, { timeout: 30000 });
await page.waitForTimeout(3500);

const state = await page.evaluate(() => {
  const parsed = JSON.parse(localStorage.getItem("harystyles-editor") ?? "{}");
  const pages = parsed?.state?.project?.pages ?? [];
  return {
    name: parsed?.state?.project?.name,
    count: pages.length,
    templates: pages.map((p) => p.templateId),
    everyPageHasCopy: pages.every((p) => p.values && Object.keys(p.values).length > 0),
  };
});

check("the project is named after the starter", state.name === "A notebook");
check(`it has five pages (${state.count})`, state.count === 5);
check("it opens with a cover", state.templates[0] === "document/cover");
check("it ends with a colophon", state.templates[state.templates.length - 1] === "document/colophon");
check("every page carries its own copy", state.everyPageHasCopy);

// Whether 3x is offered depends on the machine — the capability probe measures
// the real canvas limit rather than guessing — so asserting it here would only
// test this laptop. What matters for a print document is the physical page
// size, which is checked against the PDF's MediaBox below.

await page.locator('button:text-is("PDF")').first().click();
const [dl] = await Promise.all([
  page.waitForEvent("download", { timeout: 300000 }),
  page.locator("button", { hasText: /^Download / }).first().click(),
]);
const pdf = readFileSync(await dl.path());
const pdfPages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;

console.log(`  ${dl.suggestedFilename()} — ${(pdf.length / 1024 / 1024).toFixed(1)} MB, ${pdfPages} page(s)`);
check("the pdf is a real pdf", pdf.toString("ascii", 0, 5) === "%PDF-");

// A4 is 210x297mm, which in PDF points (1/72in) is 595.3 x 841.9. The whole
// reason the artboard is 2480x3508 is that 300 dpi makes this come out exact.
const box = /\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)/.exec(pdf.toString("latin1"));
const w = box ? Math.round(Number(box[1])) : 0;
const h = box ? Math.round(Number(box[2])) : 0;
console.log(`  page box: ${w} x ${h} pt (A4 is 595 x 842)`);
check(`the page is A4 (${w}x${h}pt)`, Math.abs(w - 595) <= 2 && Math.abs(h - 842) <= 2);
check(`the pdf has one page per artboard (${pdfPages})`, pdfPages === 5);

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
