/**
 * Checks the brand kit against a BUILT site.
 *
 * The zip is assembled in the browser from files the site itself serves, so the
 * only honest check is to click the real button and read the bytes that arrive
 * — a Node-side reimplementation would prove nothing about what a visitor gets.
 *
 *   node scripts/verify-brandkit.mjs [baseUrl]
 */
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? process.env.BASE_URL ?? "http://127.0.0.1:3010";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1400, height: 900 }, acceptDownloads: true });
const page = await context.newPage();

const problems = [];
page.on("console", (m) => m.type() === "error" && problems.push(m.text()));
page.on("pageerror", (e) => problems.push(String(e)));

await page.goto(`${BASE}/playbook/brand/`, { waitUntil: "networkidle" });

const button = page.locator("button", { hasText: /tokens, fonts, logos/ }).first();
await button.scrollIntoViewIfNeeded();

const started = Date.now();
const [download] = await Promise.all([
  page.waitForEvent("download", { timeout: 120000 }),
  button.click(),
]);

const buf = readFileSync(await download.path());
const seconds = ((Date.now() - started) / 1000).toFixed(1);
console.log(`${download.suggestedFilename()} — ${(buf.length / 1024 / 1024).toFixed(2)} MB in ${seconds}s`);

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
const has = (re) => entries.filter((e) => re.test(e.name));

console.log(`  ${entries.length} entries`);
for (const group of [/^fonts\//, /^logo\//, /^favicon\//, /^[^/]+$/]) {
  const files = has(group);
  const bytes = files.reduce((n, f) => n + f.size, 0);
  console.log(`    ${String(group).padEnd(14)} ${String(files.length).padStart(3)} files  ${(bytes / 1024).toFixed(0)} KB`);
}
for (const e of has(/^[^/]+$/)) console.log(`      ${e.name}  (${(e.size / 1024).toFixed(1)} KB)`);

// The note the button prints is the number a user is told; it must match.
const note = (await page.locator("p.mono", { hasText: /files ·/ }).first().textContent()) ?? "";
console.log(`  panel says: ${note.trim()}`);

const checks = [
  ["zip parsed", entries.length > 0],
  ["has woff2 fonts", has(/^fonts\/.+\.woff2$/).length >= 10],
  ["has ttf fonts", has(/^fonts\/.+\.ttf$/).length >= 10],
  ["fonts carry a licence", has(/^fonts\/LICENSE\.txt$/).length === 1],
  ["licence has text", has(/^fonts\/LICENSE\.txt$/).every((e) => e.size > 300)],
  ["has logo files", has(/^logo\//).length >= 10],
  ["logo has svg lockups", has(/^logo\/lockup-.+\.svg$/).length >= 2],
  ["has the favicon set", has(/^favicon\//).length >= 5],
  ["has palette.json", has(/^palette\.json$/).length === 1],
  ["has tokens.css", has(/^tokens\.css$/).length === 1],
  ["has a README", has(/^README\.txt$/).length === 1],
  ["licence names the OFL", false], // replaced below, once the text is in hand
  ["every entry has bytes", entries.every((e) => e.size > 0)],
  ["panel reported the count", note.includes(`${entries.length} files`)],
];

// The licence text itself is not in the central directory — fetch the source
// file the zip copied verbatim and assert on that instead of inflating.
const licence = await page.evaluate(() => fetch("/assets/fonts/LICENSE.txt").then((r) => r.text()));
checks[11] = ["licence names the OFL", /SIL Open Font License/i.test(licence)];

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
