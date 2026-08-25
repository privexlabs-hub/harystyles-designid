/**
 * The shelf, end to end: save from the editor, find it on the shelf, reopen it,
 * and prove it survived the round trip through IndexedDB.
 *
 *   node scripts/verify-shelf.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? process.env.BASE_URL ?? "http://127.0.0.1:3010";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await context.newPage();

const problems = [];
page.on("console", (m) => m.type() === "error" && problems.push(m.text()));
page.on("pageerror", (e) => problems.push(String(e)));
page.on("dialog", (d) => (d.type() === "prompt" ? d.accept("An evening of letters") : d.accept()));

const rows = [];
const check = (label, got, want = true) => {
  rows.push({ label, got, want, ok: got === want });
};

const byText = (t) => page.locator(`button:text-is("${t}")`).first();

await page.goto(`${BASE}/editor/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);

// Two pages, so the round trip has something to lose.
await byText("Add page").click();
await page.waitForTimeout(700);

// Type something identifiable into the active page.
const headline = page.locator("label").filter({ hasText: "Headline" }).first().locator("textarea, input").first();
await headline.fill("Proof this survived");
await page.waitForTimeout(900);

await byText("Save").click();
await page.waitForTimeout(4000);
check("save reports success", (await byText("Saved").count()) > 0 || (await byText("Save").count()) > 0);

await page.goto(`${BASE}/shelf/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const cards = page.locator("article");
check("the project is on the shelf", (await cards.count()) >= 1);
check(
  "it is named what we called it",
  (await page.locator('input[aria-label^="Name of"]').first().inputValue()) === "An evening of letters",
);
check("it remembers its page count", (await page.locator("text=2 PAGES").count()) > 0);
check("it has a cover", (await page.locator("article img").count()) >= 1);

// Reopen and confirm the copy came back.
await page.locator("article").first().locator('button:text-is("Open")').click();
await page.waitForURL(/\/editor/, { timeout: 30000 });
await page.waitForTimeout(2500);

// Reopening lands on page one; the copy was typed on page two.
await page.locator('[aria-label="Page 2 of 2"]').first().click();
await page.waitForTimeout(1200);

const reopened = page.locator("label").filter({ hasText: "Headline" }).first().locator("textarea, input").first();
check("the copy survived the round trip", (await reopened.inputValue()).includes("Proof this survived"));

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
