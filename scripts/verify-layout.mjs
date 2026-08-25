/**
 * The editor's geometry, at every breakpoint.
 *
 * This exists because a layout regression shipped through a suite that was
 * entirely green. Every other check drives the UI by selector — they prove a
 * control exists, and say nothing about whether it is anywhere a person could
 * use it. A stray element in the shell's grid moved every pane one column
 * right, dropped the inspector onto a second row and left the canvas with zero
 * height, and not one assertion noticed.
 *
 * So this one asserts position and size, not presence.
 *
 *   node scripts/verify-layout.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? process.env.BASE_URL ?? "http://127.0.0.1:3010";

/** The breakpoints in components/editor/EditorShell.module.css, either side. */
const WIDTHS = [1920, 1440, 1200, 1100, 1024, 900, 820, 768, 414, 360];

/** Where the shell shows three columns, two, and one. */
const THREE_COL = 1081;
const TWO_COL = 821;

const browser = await chromium.launch();
const rows = [];
const check = (label, ok, detail = "") => {
  rows.push({ label, ok, detail });
  return ok;
};

/** Reads the rects the layout is actually made of. */
async function measure(page) {
  return page.evaluate(() => {
    const rect = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    };

    // The panes are CSS-module classes, so they are matched by prefix.
    const byModule = (name) => {
      const el = [...document.querySelectorAll("div")].find((d) =>
        [...d.classList].some((c) => c.includes(`__${name}`) || c.startsWith(`${name}-`)),
      );
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    };

    // Read the percentage from its own span. Taking the parent's textContent
    // glues "1080×1080" to "65%" and yields 108065 — which would have made the
    // negative-zoom assertion pass on any value at all.
    const hudSpans = [
      ...(document.querySelector('[role="application"]')?.parentElement?.querySelectorAll("span") ?? []),
    ];
    const zoomText = hudSpans.map((el) => el.textContent?.trim() ?? "").find((t) => /^-?\d+%$/.test(t));

    const overflowing = [...document.querySelectorAll("*")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > window.innerWidth + 1;
      })
      .slice(0, 4)
      .map((el) => String(el.className).slice(0, 40));

    return {
      library: byModule("library"),
      centre: byModule("centre"),
      inspector: byModule("inspector"),
      canvas: rect('[role="application"]'),
      rail: document.querySelector('[aria-label="Pages in this project"]')
        ? rect('[aria-label="Pages in this project"]')
        : null,
      zoom: zoomText ? Number(zoomText.replace("%", "")) : null,
      overflowing,
      innerWidth: window.innerWidth,
    };
  });
}

const table = [];

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`${BASE}/editor/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1400);

  const m = await measure(page);
  const at = `@${width}`;

  table.push({
    width,
    library: m.library ? `${m.library.x},${m.library.w}` : "—",
    centre: m.centre ? `${m.centre.x},${m.centre.w}` : "—",
    inspector: m.inspector ? `${m.inspector.x},${m.inspector.w}` : "—",
    canvas: m.canvas ? `${m.canvas.w}×${m.canvas.h}` : "—",
    zoom: m.zoom === null ? "—" : `${m.zoom}%`,
  });

  // The artboard must be drawable. A zero-height canvas was the failure that
  // made a whole breakpoint band unusable.
  check(`${at} canvas has area`, !!m.canvas && m.canvas.w > 0 && m.canvas.h > 0,
    m.canvas ? `${m.canvas.w}×${m.canvas.h}` : "missing");

  // A negative zoom means fit() divided by a collapsed box and inverted the
  // artboard rather than shrinking it.
  check(`${at} zoom is positive`, m.zoom !== null && m.zoom > 0, `${m.zoom}%`);

  if (width >= THREE_COL) {
    const ok =
      m.library && m.centre && m.inspector &&
      m.library.y === m.centre.y && m.centre.y === m.inspector.y;
    check(`${at} three panes share one row`, !!ok,
      ok ? "" : `y: ${m.library?.y} / ${m.centre?.y} / ${m.inspector?.y}`);

    const ordered =
      m.library && m.centre && m.inspector &&
      m.library.x < m.centre.x && m.centre.x < m.inspector.x;
    check(`${at} order is library → centre → inspector`, !!ordered,
      ordered ? "" : `x: ${m.library?.x} / ${m.centre?.x} / ${m.inspector?.x}`);

    // The artboard is the point of the screen; it gets the most room.
    const widest = m.centre && m.library && m.inspector &&
      m.centre.w > m.library.w && m.centre.w > m.inspector.w;
    check(`${at} the centre column is the widest`, !!widest,
      `${m.library?.w} / ${m.centre?.w} / ${m.inspector?.w}`);

    check(`${at} the inspector is on screen`, !!m.inspector && m.inspector.y < 900,
      `y ${m.inspector?.y}`);
  }

  if (width >= TWO_COL && width < THREE_COL) {
    // The inspector becomes a sheet here, but the library and canvas stay side
    // by side — and the canvas must still be the larger of the two.
    const ok = m.library && m.centre && m.library.y === m.centre.y && m.library.x < m.centre.x;
    check(`${at} library and centre share one row`, !!ok,
      ok ? "" : `y: ${m.library?.y} / ${m.centre?.y}`);
    check(`${at} the centre is wider than the library`, !!(m.centre && m.library && m.centre.w > m.library.w),
      `${m.library?.w} / ${m.centre?.w}`);
  }

  if (width < TWO_COL) {
    // One column: the canvas gets the screen, and must not be pushed down it.
    check(`${at} the centre starts near the top`, !!m.centre && m.centre.y < 140, `y ${m.centre?.y}`);
    check(`${at} the canvas has most of the height`, !!m.canvas && m.canvas.h > 400, `h ${m.canvas?.h}`);
  }

  check(`${at} nothing escapes the window`, m.overflowing.length === 0, m.overflowing.join(", "));

  await page.close();
}

// --- the pages rail, which has to stay reachable once it appears ------------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/editor/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  await page.locator('button:text-is("Add page")').first().click();
  await page.waitForTimeout(900);

  const tools = await page.evaluate(() => {
    const centre = [...document.querySelectorAll("div")].find((d) =>
      [...d.classList].some((c) => c.includes("__centre")),
    );
    const cr = centre?.getBoundingClientRect();
    return ["Duplicate", "Delete"].map((label) => {
      const el = [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === label);
      if (!el) return { label, found: false };
      const r = el.getBoundingClientRect();
      return {
        label,
        found: true,
        inWindow: r.right <= window.innerWidth + 1 && r.left >= -1 && r.bottom <= window.innerHeight + 1,
        // They belong to the centre column and must not be drawn over the library.
        inColumn: !!cr && r.left >= cr.left - 1 && r.right <= cr.right + 1,
      };
    });
  });

  for (const t of tools) {
    check(`rail: ${t.label} is inside the window`, t.found && t.inWindow === true);
    check(`rail: ${t.label} stays in the centre column`, t.found && t.inColumn === true);
  }
  await page.close();
}

await browser.close();

// --- report ----------------------------------------------------------------
console.log("width   library(x,w)   centre(x,w)    inspector(x,w)  canvas      zoom");
console.log("-".repeat(74));
for (const r of table) {
  console.log(
    String(r.width).padEnd(8) +
      r.library.padEnd(15) +
      r.centre.padEnd(15) +
      r.inspector.padEnd(16) +
      r.canvas.padEnd(12) +
      r.zoom,
  );
}
console.log("");

let failed = 0;
for (const r of rows) {
  if (!r.ok) failed++;
  if (!r.ok) console.log(`FAIL  ${r.label}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${rows.length - failed}/${rows.length} checks passed`);
process.exit(failed ? 1 : 0);
