/**
 * Screenshot helper for review during development.
 *   node scripts/shot.mjs <path> [width] [out]
 * Also prints any console errors, so a visually fine page with a broken
 * hydration pass does not slip through.
 */
import { chromium } from "playwright";

const [, , route = "/", width = "1440", out = "/tmp/shot.png"] = process.argv;
const base = process.env.BASE_URL ?? "http://localhost:3007";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(width), height: 900 },
  deviceScaleFactor: 2,
});

const problems = [];
page.on("console", (m) => m.type() === "error" && problems.push(m.text()));
page.on("pageerror", (e) => problems.push(String(e)));

await page.goto(base + route, { waitUntil: "networkidle" });
if (process.env.WAIT_FOR) await page.waitForFunction(
  (sel) => document.querySelector(sel)?.textContent?.includes("rendered"),
  process.env.WAIT_FOR,
  { timeout: 120000 },
);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, fullPage: process.env.FULL !== "0" });

const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);

console.log(`${route} @${width} → ${out}`);
console.log(`horizontal overflow: ${overflow}px`);
if (problems.length) console.log("console errors:\n  " + problems.join("\n  "));
else console.log("console: clean");

await browser.close();
