/**
 * End-to-end export check against a BUILT site.
 *
 * Drives the real editor in a real browser and captures the real download, then
 * measures the bytes that arrive rather than trusting what was asked for. The
 * unit that matters is the file a designer ends up with.
 *
 *   node scripts/verify-export.mjs [baseUrl]
 */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? process.env.BASE_URL ?? "http://127.0.0.1:3010";

/** PNG dimensions live in the IHDR chunk, at a fixed offset. */
function pngSize(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

/** JPEG dimensions need a walk over the segment markers. */
function jpegSize(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    // SOF0..SOF15, skipping the DHT/JPG/DAC markers interleaved among them.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

function webpSize(buf) {
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") return null;
  const fmt = buf.toString("ascii", 12, 16);
  if (fmt === "VP8X") return { w: (buf.readUIntLE(24, 3) & 0xffffff) + 1, h: (buf.readUIntLE(27, 3) & 0xffffff) + 1 };
  if (fmt === "VP8L") {
    const b = buf.readUInt32LE(21);
    return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
  }
  if (fmt === "VP8 ") return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
  return null;
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1600, height: 950 }, acceptDownloads: true });
const page = await context.newPage();

const problems = [];
page.on("console", (m) => m.type() === "error" && problems.push(m.text()));
page.on("pageerror", (e) => problems.push(String(e)));

await page.goto(`${BASE}/editor/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

/**
 * Selectors here match on TEXT, not accessible name.
 *
 * The scale and format buttons carry a `title` (the pixel dimensions), and
 * Chromium computes the accessible name from that rather than the label, so
 * getByRole finds nothing and fails with a bare timeout.
 */
const byText = (text) => page.locator(`button:text-is("${text}")`).first();

/**
 * Picks a template by id, via the library's search box.
 *
 * Searching rather than scrolling for a card: the grid only renders what is on
 * screen, so a template further down the catalogue is not in the DOM at all.
 */
async function selectTemplate(id, name) {
  await page.getByLabel("Search templates").fill(id);
  await page.waitForTimeout(400);
  await page.locator("button", { hasText: name }).first().click();
  await page.waitForTimeout(400);
}

async function download(format, scale) {
  await byText(format).click();
  if (scale) await page.locator("button", { hasText: new RegExp(`^${scale}.$`) }).first().click();

  const [dl] = await Promise.all([
    page.waitForEvent("download", { timeout: 180000 }),
    page.locator("button", { hasText: /^Download / }).first().click(),
  ]);

  const path = await dl.path();
  const buf = readFileSync(path);
  return { name: dl.suggestedFilename(), bytes: buf.length, buf };
}

const rows = [];
const check = (label, got, want) => {
  const ok = got === want;
  rows.push({ label, got, want, ok });
  return ok;
};

await selectTemplate("square/big-stat", "Big stat card");

for (const scale of [1, 2, 3]) {
  const { name, bytes, buf } = await download("PNG", scale);
  const size = pngSize(buf);
  check(`PNG @${scale}x width`, size?.w, 1080 * scale);
  check(`PNG @${scale}x height`, size?.h, 1080 * scale);
  console.log(`  ${name} — ${size?.w}×${size?.h}, ${(bytes / 1024).toFixed(0)} KB`);
}

{
  const { name, bytes, buf } = await download("JPEG", 2);
  const size = jpegSize(buf);
  check("JPEG width", size?.w, 2160);
  console.log(`  ${name} — ${size?.w}×${size?.h}, ${(bytes / 1024).toFixed(0)} KB`);
}

{
  const { name, bytes, buf } = await download("WebP", 2);
  const size = webpSize(buf);
  check("WebP width", size?.w, 2160);
  console.log(`  ${name} — ${size?.w}×${size?.h}, ${(bytes / 1024).toFixed(0)} KB`);
}

{
  const { name, bytes, buf } = await download("SVG");
  const head = buf.toString("utf8", 0, 200);
  check("SVG declares 1080 wide", /width="1080"/.test(head), true);
  console.log(`  ${name} — ${(bytes / 1024).toFixed(0)} KB`);
}

{
  const { name, bytes, buf } = await download("PDF", 2);
  check("PDF header", buf.toString("ascii", 0, 5), "%PDF-");
  console.log(`  ${name} — ${(bytes / 1024).toFixed(0)} KB`);
}

// A vertical artboard at 3x is 3240×5760 — the case the capability probe exists
// for, and the one most likely to fail on a constrained device.
await selectTemplate("vertical/launch", "Launch");
{
  const { name, bytes, buf } = await download("PNG", 3);
  const size = pngSize(buf);
  check("Vertical PNG @3x width", size?.w, 3240);
  check("Vertical PNG @3x height", size?.h, 5760);
  console.log(`  ${name} — ${size?.w}×${size?.h}, ${(bytes / 1024 / 1024).toFixed(1)} MB`);
}

console.log("");
for (const r of rows) {
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.label}: ${r.got}${r.ok ? "" : ` (expected ${r.want})`}`);
}

const failed = rows.filter((r) => !r.ok).length;
console.log(`\n${rows.length - failed}/${rows.length} checks passed`);
if (problems.length) console.log(`console errors:\n  ${problems.slice(0, 6).join("\n  ")}`);

await browser.close();
process.exit(failed || problems.length ? 1 : 0);
