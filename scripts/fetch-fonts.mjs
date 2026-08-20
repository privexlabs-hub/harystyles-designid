/**
 * Downloads every font the design system uses into public/assets/fonts/.
 *
 * Two formats are needed, for two different consumers:
 *   .woff2 — @font-face in the browser (small, modern)
 *   .ttf   — Satori, which cannot read WOFF2 and has no variable-axis API
 *
 * Google's CSS API decides which format to serve from the User-Agent, and for a
 * variable family (Fraunces) it returns a *static instance* pinned to the axes in
 * the query. That is exactly what Satori needs, so the axes are baked here.
 */
import { mkdir, writeFile, rename, unlink } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/assets/fonts");
const run = promisify(execFile);

const UA_WOFF2 =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const UA_TTF =
  "Mozilla/5.0 (Linux; U; Android 4.1.1; en-us; Build/JRO03C) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";

/**
 * The only codepoints the brand actually uses from Noto Symbols: the fleuron and
 * its siblings, plus the punctuation the display faces set awkwardly. Shipping
 * the whole family would cost 700 KiB for five marks.
 */
const SYMBOL_GLYPHS = [
  "U+2766", // ❦ fleuron — kept
  "U+2765", // ❥ rotated fleuron
  "U+2661", // ♡ tender
  "U+2665", // ♥ filled heart
  "U+2726", // ✦ spark
  "U+25D0", // ◐ staying
  "U+25D1",
  "U+2605", "U+2606", // ★ ☆
  "U+2713", "U+2717", // ✓ ✗ for comparison templates
  "U+2192", "U+2190", // → ←
  "U+2022", "U+00B7", "U+2014", "U+2013", // • · — –
].join(",");

/** family = the CSS font-family name used in tokens.css and in Satori. */
const FONTS = [
  // Fraunces at optical size 144 — the display cut. Titles, wordmark, pull quotes.
  { dir: "fraunces", family: "Fraunces", file: "fraunces-display",
    query: "Fraunces:ital,opsz,wght@0,144,300;0,144,400;0,144,500;0,144,600;0,144,700;1,144,300;1,144,400;1,144,500;1,144,600" },
  // Fraunces at optical size 24 — the reading cut. Body copy.
  { dir: "fraunces", family: "Fraunces Text", file: "fraunces-text",
    query: "Fraunces:ital,opsz,wght@0,24,400;0,24,500;1,24,400" },
  { dir: "inter-tight", family: "Inter Tight", file: "inter-tight",
    query: "Inter+Tight:wght@300;400;500;600;700" },
  { dir: "jetbrains-mono", family: "JetBrains Mono", file: "jetbrains-mono",
    query: "JetBrains+Mono:wght@400;500" },
  // The brand's reaction glyphs — ❦ ♡ ✦ ◐ — are in none of the three text
  // families. They are marks the brand uses constantly, so this ships with the
  // brand set rather than as a fallback.
  { dir: "noto", family: "Noto Symbols", file: "noto-symbols", query: "Noto+Sans+Symbols+2", subset: SYMBOL_GLYPHS },

  // Fallbacks so a pasted emoji or non-Latin character never exports as a blank box.
  { dir: "noto", family: "Noto Sans", file: "noto-sans", query: "Noto+Sans:wght@400;700" },
  { dir: "noto", family: "Noto Emoji", file: "noto-emoji", query: "Noto+Emoji:wght@400" },
];

/** Compresses our TTF to WOFF2 so the browser and Satori load the same outlines. */
async function toWoff2(ttf, dest) {
  try {
    await run("python3", [join(ROOT, "scripts/ttf-to-woff2.py"), ttf, dest]);
    return true;
  } catch {
    console.warn(`  fontTools/brotli unavailable — falling back to Google's woff2 for ${ttf.split("/").pop()}`);
    console.warn("  NOTE: the DOM preview may then break lines differently from the export.");
    return false;
  }
}

/**
 * Cuts a font down to the codepoints listed. Needs fontTools; if it is missing
 * the full font is kept and a warning is printed, so the build still succeeds
 * on a machine without it.
 */
async function subset(file, unicodes) {
  const tmp = file + ".subset";
  try {
    await run("python3", [
      "-m", "fontTools.subset", file,
      `--unicodes=${unicodes}`,
      `--output-file=${tmp}`,
      "--no-hinting", "--desubroutinize",
    ]);
    await rename(tmp, file);
    return true;
  } catch {
    await unlink(tmp).catch(() => {});
    console.warn(`  fontTools unavailable — shipping ${file.split("/").pop()} unsubsetted`);
    return false;
  }
}

const LICENSE = `Fonts in this directory are redistributed under the SIL Open Font License 1.1.

  Fraunces        https://github.com/undercasetype/Fraunces
  Inter Tight     https://github.com/rsms/inter
  JetBrains Mono  https://github.com/JetBrains/JetBrainsMono
  Noto Sans       https://github.com/notofonts/latin-greek-cyrillic
  Noto Symbols    https://github.com/notofonts/symbols
  Noto Emoji      https://github.com/googlefonts/noto-emoji

The OFL permits redistribution and embedding, including within this repository.
Full text: https://openfontlicense.org/
`;

async function css(query, ua) {
  const res = await fetch(`https://fonts.googleapis.com/css2?family=${query}&display=swap`, {
    headers: { "User-Agent": ua },
  });
  if (!res.ok) throw new Error(`CSS request failed for ${query}: ${res.status}`);
  return res.text();
}

/** Pulls one {style, weight, url} record per @font-face block. */
function parseFaces(sheet) {
  return [...sheet.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(([, body]) => ({
    style: /font-style:\s*([a-z]+)/.exec(body)?.[1] ?? "normal",
    weight: Number(/font-weight:\s*(\d+)/.exec(body)?.[1] ?? 400),
    url: /url\((https:\/\/[^)]+)\)/.exec(body)?.[1],
  })).filter((f) => f.url);
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA_WOFF2 } });
  if (!res.ok) throw new Error(`Download failed ${url}: ${res.status}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

const manifest = [];

for (const font of FONTS) {
  const dir = join(OUT, font.dir);
  await mkdir(dir, { recursive: true });

  const [woff2Faces, ttfFaces] = await Promise.all([
    css(font.query, UA_WOFF2).then(parseFaces),
    css(font.query, UA_TTF).then(parseFaces),
  ]);

  // Match the two lists on (style, weight) so each entry has both formats.
  for (const face of ttfFaces) {
    const twin = woff2Faces.find((w) => w.style === face.style && w.weight === face.weight);
    const slug = `${font.file}-${face.weight}${face.style === "italic" ? "-italic" : ""}`;

    const ttfPath = join(dir, `${slug}.ttf`);
    const woff2Path = join(dir, `${slug}.woff2`);

    await download(face.url, ttfPath);
    if (font.subset) await subset(ttfPath, font.subset);

    // The WOFF2 is compressed FROM the TTF rather than downloaded.
    //
    // Google answers the same CSS request with two different fonts: a
    // subsetted *variable* WOFF2 for modern browsers and a static instance as
    // TTF for legacy ones. Satori can only read the TTF, so if the browser
    // loaded Google's WOFF2 the preview and the export would be set in
    // different fonts — measurably so: Fraunces italic came out 9% wider in
    // the DOM, enough to break lines in different places.
    //
    // Compressing our own guarantees both engines see identical outlines.
    if (!(await toWoff2(ttfPath, woff2Path))) {
      if (twin) await download(twin.url, woff2Path);
    }

    manifest.push({
      family: font.family,
      weight: face.weight,
      style: face.style,
      ttf: `/assets/fonts/${font.dir}/${slug}.ttf`,
      woff2: `/assets/fonts/${font.dir}/${slug}.woff2`,
    });
    console.log(`  ${slug}`);
  }
  console.log(`${font.family} — ${ttfFaces.length} instances`);
}

await writeFile(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
await writeFile(join(OUT, "LICENSE.txt"), LICENSE);
console.log(`\n${manifest.length} font files written to public/assets/fonts/`);

/**
 * The @font-face sheet is derived from the manifest rather than hand-written, so
 * adding a weight above cannot leave the CSS out of sync.
 */
const faces = manifest
  .map(
    (f) => `@font-face {
  font-family: "${f.family}";
  font-style: ${f.style};
  font-weight: ${f.weight};
  font-display: swap;
  src: url("${f.woff2}") format("woff2"),
       url("${f.ttf}") format("truetype");
}`,
  )
  .join("\n\n");

await writeFile(
  join(ROOT, "app/fonts.css"),
  `/* =========================================================
   harystyles — self-hosted faces
   Generated by scripts/fetch-fonts.mjs. Do not edit by hand.

   "Fraunces" is the optical-size-144 display cut; "Fraunces Text"
   is the opsz-24 reading cut. They are separate families here
   because the variable axis cannot be selected at render time —
   Satori has no API for it, so the instances are baked.
   ========================================================= */

${faces}
`,
);
console.log("app/fonts.css regenerated");
