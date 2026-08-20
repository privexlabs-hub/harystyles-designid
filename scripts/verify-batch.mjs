/**
 * Checks the batch export end to end: plan, render, zip, and the contents of
 * the file that lands on disk.
 *
 * The in-memory fallback is what runs here — showSaveFilePicker needs a real
 * save dialog, which headless Chromium has no way to answer — so this proves
 * the zip itself, not the File System Access path.
 *
 *   node scripts/verify-batch.mjs [baseUrl]
 */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? process.env.BASE_URL ?? "http://127.0.0.1:3010";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1600, height: 950 }, acceptDownloads: true });
const page = await context.newPage();

const problems = [];
page.on("console", (m) => m.type() === "error" && problems.push(m.text()));
page.on("pageerror", (e) => problems.push(String(e)));

// The panel confirms the job count before starting; accept it.
page.on("dialog", (d) => d.accept());

// showSaveFilePicker exists in headless Chromium but never resolves — there is
// no dialog for it to open — so the streaming path cannot be exercised here.
// Removing it forces the in-memory fallback, which is the half this can check.
await page.addInitScript(() => {
  delete globalThis.showSaveFilePicker;
});

await page.goto(`${BASE}/editor/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

// Avatars are the smallest category — 8 templates at 400×400 — which keeps the
// run short while still exercising every stage of the pipeline.
await page.getByLabel("Search templates").fill("avatar/");
await page.waitForTimeout(500);
await page.locator("button", { hasText: "Indigo" }).first().click();
await page.waitForTimeout(500);

console.log("starting batch: all avatars, PNG @2x");
const started = Date.now();

const [download] = await Promise.all([
  page.waitForEvent("download", { timeout: 300000 }),
  page.locator("button", { hasText: /^All avatar$/ }).first().click(),
]);

const path = await download.path();
const buf = readFileSync(path);
const seconds = ((Date.now() - started) / 1000).toFixed(1);

console.log(`  ${download.suggestedFilename()} — ${(buf.length / 1024).toFixed(0)} KB in ${seconds}s`);

/** Walks the zip's central directory rather than unpacking it. */
function zipEntries(b) {
  const names = [];
  for (let i = b.length - 22; i >= 0; i--) {
    if (b.readUInt32LE(i) === 0x06054b50) {
      const count = b.readUInt16LE(i + 10);
      let off = b.readUInt32LE(i + 16);
      for (let n = 0; n < count; n++) {
        if (b.readUInt32LE(off) !== 0x02014b50) break;
        const nameLen = b.readUInt16LE(off + 28);
        const extraLen = b.readUInt16LE(off + 30);
        const commentLen = b.readUInt16LE(off + 32);
        const size = b.readUInt32LE(off + 24);
        names.push({ name: b.toString("utf8", off + 46, off + 46 + nameLen), size });
        off += 46 + nameLen + extraLen + commentLen;
      }
      return names;
    }
  }
  return names;
}

const entries = zipEntries(buf);
console.log(`  ${entries.length} entries`);
for (const e of entries) console.log(`    ${e.name}  (${(e.size / 1024).toFixed(0)} KB)`);

const checks = [
  ["zip is not empty", entries.length > 0],
  ["has a manifest", entries.some((e) => e.name.endsWith("manifest.json"))],
  ["has a README", entries.some((e) => e.name.toLowerCase().includes("readme"))],
  ["all avatars present", entries.filter((e) => e.name.endsWith(".png")).length >= 8],
  ["paths are namespaced", entries.filter((e) => e.name.includes("/")).length > 0],
  ["every png has bytes", entries.filter((e) => e.name.endsWith(".png")).every((e) => e.size > 500)],
];

console.log("");
let failed = 0;
for (const [label, ok] of checks) {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
}
console.log(`\n${checks.length - failed}/${checks.length} checks passed`);
if (problems.length) console.log(`console errors:\n  ${problems.slice(0, 5).join("\n  ")}`);

await browser.close();
process.exit(failed ? 1 : 0);
