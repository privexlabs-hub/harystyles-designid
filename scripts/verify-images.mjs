/**
 * Photographs, end to end: drop a file in, see it on the canvas, and prove the
 * exported file contains it.
 *
 * The last assertion is the one that matters — an image that previews but does
 * not export is exactly the class of bug that shipped once already.
 *
 *   node scripts/verify-images.mjs [baseUrl]
 */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? process.env.BASE_URL ?? "http://127.0.0.1:3010";
const PHOTO = "public/assets/backgrounds/lamp.png";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, acceptDownloads: true });
const page = await context.newPage();

const problems = [];
page.on("console", (m) => m.type() === "error" && problems.push(m.text()));
page.on("pageerror", (e) => problems.push(String(e)));
page.on("dialog", (d) => d.accept());

const rows = [];
const check = (label, got, want = true) => rows.push({ label, got, want, ok: got === want });

const byText = (t) => page.locator(`button:text-is("${t}")`).first();

async function download(format) {
  await byText(format).click();
  const [dl] = await Promise.all([
    page.waitForEvent("download", { timeout: 180000 }),
    page.locator("button", { hasText: /^Download / }).first().click(),
  ]);
  return readFileSync(await dl.path());
}

await page.goto(`${BASE}/editor/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);

await page.getByLabel("Search templates").fill("square/photo-post");
await page.waitForTimeout(500);
await page.locator("button", { hasText: "Photograph" }).first().click();
await page.waitForTimeout(1500);

check("the image field is rendered", (await page.locator('input[type="file"]').count()) > 0);
check(
  "the empty state shows a placeholder, not a broken image",
  (await page.locator("text=Drop a photograph").count()) > 0,
);

// The export before any photograph, for comparison.
const before = await download("PNG");

await page.locator('input[type="file"]').first().setInputFiles(PHOTO);
await page.waitForTimeout(3500);

check("a preview appears in the field", (await page.locator('img[alt=""]').count()) > 0);
check(
  "the field reports the stored size",
  (await page.locator("text=/kept in this browser only/").count()) > 0,
);

const after = await download("PNG");
check("the exported file changed once a photograph was added", Buffer.compare(before, after) !== 0);
// A photograph is orders of magnitude more data than a placeholder box.
check(`the export grew (${(before.length / 1024).toFixed(0)} → ${(after.length / 1024).toFixed(0)} KB)`, after.length > before.length * 2);

// It must survive a reload, since the bytes live in IndexedDB.
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(3000);
check("the photograph survives a reload", (await page.locator("text=/kept in this browser only/").count()) > 0);

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
