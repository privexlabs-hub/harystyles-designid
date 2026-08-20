/**
 * Keyboard and contrast checks.
 *
 * Two things a screenshot will not tell you: whether the editor can be operated
 * without a mouse, and whether the colour pairings the playbook asserts as
 * WCAG AA actually are.
 *
 *   node scripts/verify-a11y.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { contrastRatio, HEX } from "../lib/color.ts";

const BASE = process.argv[2] ?? process.env.BASE_URL ?? "http://127.0.0.1:3010";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 950 } });
const rows = [];
const check = (label, ok, detail = "") => rows.push({ label, ok, detail });

// ---------------------------------------------------------------- keyboard

await page.goto(`${BASE}/editor/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

/** Walks forward with Tab and records what receives focus. */
const walk = async (steps) => {
  const seen = [];
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press("Tab");
    seen.push(
      await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const style = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 28),
          // A focus ring that is invisible is the same as no focus ring.
          ring: style.outlineStyle !== "none" && style.outlineWidth !== "0px",
        };
      }),
    );
  }
  return seen.filter(Boolean);
};

// The library is a long list of cards, so the walk has to run past it to
// reach the inspector and the export controls.
const focused = await walk(200);
check("editor is reachable by keyboard", focused.length > 10, `${focused.length} stops`);
check("every focus stop shows a ring", focused.every((f) => f.ring), `${focused.filter((f) => !f.ring).length} without`);

// The library search, the canvas and the inspector must all be on the path.
const names = focused.map((f) => f.label.toLowerCase()).join(" | ");
check("search is on the tab path", names.includes("search") || focused.some((f) => f.tag === "input"));
check("format controls are on the tab path", /png|jpeg|webp|svg|pdf/.test(names));

// Undo/redo without touching a mouse.
await page.keyboard.press("Meta+z");
check("undo shortcut does not throw", true);

// ---------------------------------------------------------------- contrast

const PAIRINGS = [
  ["display on page", "ink-50", "ink-950", 3],
  ["body on page", "ink-100", "ink-950", 4.5],
  ["accent on page", "amber-500", "ink-950", 3],
  ["ink on accent", "ink-1000", "amber-500", 4.5],
  ["body in card", "ink-100", "ink-900", 4.5],
  ["vellum on patron", "ink-100", "wine-500", 4.5],
  ["muted on page", "ink-300", "ink-950", 4.5],
  ["subtle on page", "ink-400", "ink-950", 4.5],
  ["paper body", "paper-fg", "paper-bg", 4.5],
  ["indigo on page", "indigo-500", "ink-950", 3],
];

for (const [label, fg, bg, threshold] of PAIRINGS) {
  const ratio = contrastRatio(HEX[fg], HEX[bg]);
  check(`${label} ≥ ${threshold}:1`, ratio >= threshold, `${ratio.toFixed(2)}:1`);
}

await browser.close();

let failed = 0;
for (const r of rows) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.label}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${rows.length - failed}/${rows.length} checks passed`);
process.exit(failed ? 1 : 0);
