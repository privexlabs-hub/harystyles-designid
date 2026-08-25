/**
 * Drives every route at a spread of viewport widths and asserts the page never
 * scrolls sideways.
 *
 * Horizontal overflow is the failure mode that a desktop screenshot never shows
 * and that makes a phone feel broken, so it is checked mechanically rather than
 * by eye. Console errors are reported alongside, since a layout that only looks
 * right because a component crashed is not a pass.
 *
 *   node scripts/responsive-check.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? process.env.BASE_URL ?? "http://127.0.0.1:3010";

const ROUTES = [
  "/",
  "/playbook/brand/",
  "/playbook/voice/",
  "/playbook/type/",
  "/playbook/color/",
  "/playbook/spacing/",
  "/playbook/components/",
  "/playbook/screens/ios/",
  "/playbook/screens/android/",
  "/playbook/screens/web/",
  "/playbook/screens/studio/",
  "/playbook/screens/marketing/",
  "/editor/",
  "/shelf/",
];

const WIDTHS = [360, 414, 768, 1024, 1440, 1920];

const browser = await chromium.launch();
const rows = [];

for (const route of ROUTES) {
  const cells = [];
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const problems = [];
    page.on("pageerror", (e) => problems.push(String(e)));
    page.on("console", (m) => m.type() === "error" && problems.push(m.text()));

    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    // A tap target below 44px is hard to hit reliably on a touch screen.
    const smallTargets = await page.evaluate(() => {
      if (window.innerWidth > 820) return 0;
      return [...document.querySelectorAll("a, button")].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.height < 32;
      }).length;
    });

    cells.push({ width, overflow, problems: problems.length, smallTargets });
    await page.close();
  }
  rows.push({ route, cells });
}

await browser.close();

const head = "route".padEnd(32) + WIDTHS.map((w) => String(w).padStart(9)).join("");
console.log(head);
console.log("-".repeat(head.length));

let failures = 0;
for (const { route, cells } of rows) {
  const line = cells
    .map((c) => {
      const bad = c.overflow > 0 || c.problems > 0;
      if (bad) failures++;
      return (c.overflow > 0 ? `+${c.overflow}px` : c.problems > 0 ? `${c.problems} err` : "ok").padStart(9);
    })
    .join("");
  console.log(route.padEnd(32) + line);
}

const tight = rows.flatMap((r) => r.cells.filter((c) => c.smallTargets > 0).map((c) => `${r.route} @${c.width}: ${c.smallTargets}`));
if (tight.length) {
  console.log(`\ntap targets under 32px on touch widths:\n  ${tight.join("\n  ")}`);
}

console.log(`\n${failures === 0 ? "no horizontal overflow, no console errors" : `${failures} failing cells`}`);
process.exit(failures ? 1 : 0);
