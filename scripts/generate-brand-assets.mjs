/**
 * Generates every standalone brand asset from two sources of truth:
 *   - the logomark path data, lifted from HSLogomark in the design system
 *   - the self-hosted Fraunces TTF, for the wordmark
 *
 * The wordmark is converted to outlines rather than shipped as live text, so the
 * .svg files render identically without the font installed.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import sharp from "sharp";
import { BRAND } from "./oklch.mjs";

const require = createRequire(import.meta.url);
const opentype = require("@shuding/opentype.js");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOGO = join(ROOT, "public/assets/logo");
const FAVICON = join(ROOT, "public/assets/favicon");
const TEXTURES = join(ROOT, "public/assets/textures");

/**
 * The mark: a lowercase "h" drawn as a candle, with its flame as the ascender's
 * dot. Stroke 2.4 on a 48 grid, round caps — the same 1.6-ish hairline weight the
 * icon set uses, scaled up.
 */
const markPaths = (stroke, flameHole) => `
  <path d="M16 36V12" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M16 24Q24 18 24 28T32 36" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M32 12Q34 9 32 6Q30 9 32 12Z" fill="${stroke}"/>
  <circle cx="32" cy="14" r="1.4" fill="${flameHole}"/>`;

const mark = (stroke, flameHole, size = 48) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none">${markPaths(stroke, flameHole)}
</svg>\n`;

/** Colourways. `hole` is the notch punched out of the flame, so it must match the surface behind. */
const MARK_VARIANTS = {
  amber: { stroke: BRAND.amber500, hole: BRAND.ink950 },
  ink: { stroke: BRAND.ink1000, hole: BRAND.ink50 },
  vellum: { stroke: BRAND.ink100, hole: BRAND.ink950 },
  inverted: { stroke: BRAND.ink950, hole: BRAND.amber500 },
  mono: { stroke: "currentColor", hole: "none" },
};

// ---------------------------------------------------------------- wordmark

const fontBuffer = readFileSync(
  join(ROOT, "public/assets/fonts/fraunces/fraunces-display-400.ttf"),
);
const font = opentype.parse(
  fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength),
);

/**
 * Renders text as outlines. Tracking is applied per glyph because the brand sets
 * the wordmark at -0.035em, which opentype.js will not do on its own.
 */
function outline(text, fontSize, trackingEm) {
  const scale = fontSize / font.unitsPerEm;
  const track = trackingEm * fontSize;
  let x = 0;
  let d = "";

  for (const glyph of font.stringToGlyphs(text)) {
    d += glyph.getPath(x, 0, fontSize).toPathData(3) + " ";
    x += glyph.advanceWidth * scale + track;
  }

  const ascent = font.ascender * scale;
  const descent = -font.descender * scale;
  return { d: d.trim(), width: x - track, ascent, descent };
}

/** The brand always sets the wordmark lowercase, with the period in accent. */
function wordmarkSvg(color = BRAND.ink100, accent = BRAND.amber500, fontSize = 120) {
  const word = outline("harystyles", fontSize, -0.035);
  const dot = outline(".", fontSize, -0.035);
  const pad = fontSize * 0.06;
  const w = Math.ceil(word.width + dot.width + pad * 2);
  const h = Math.ceil(word.ascent + word.descent + pad * 2);
  const baseline = pad + word.ascent;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
  <g transform="translate(${pad} ${baseline})">
    <path d="${word.d}" fill="${color}"/>
    <g transform="translate(${word.width} 0)"><path d="${dot.d}" fill="${accent}"/></g>
  </g>
</svg>\n`;
}

/** Mark + wordmark side by side, optically aligned on the wordmark's baseline. */
function lockupHorizontal(color = BRAND.ink100, accent = BRAND.amber500) {
  const size = 120;
  const word = outline("harystyles", size, -0.035);
  const dot = outline(".", size, -0.035);
  const markSize = size * 1.15;
  const gap = size * 0.28;
  const pad = size * 0.08;
  const w = Math.ceil(markSize + gap + word.width + dot.width + pad * 2);
  const h = Math.ceil(Math.max(markSize, word.ascent + word.descent) + pad * 2);
  const markY = (h - markSize) / 2;
  const baseline = pad + word.ascent;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
  <g transform="translate(${pad} ${markY}) scale(${markSize / 48})">${markPaths(accent, "none")}
  </g>
  <g transform="translate(${pad + markSize + gap} ${baseline})">
    <path d="${word.d}" fill="${color}"/>
    <g transform="translate(${word.width} 0)"><path d="${dot.d}" fill="${accent}"/></g>
  </g>
</svg>\n`;
}

function lockupStacked(color = BRAND.ink100, accent = BRAND.amber500) {
  const size = 96;
  const word = outline("harystyles", size, -0.035);
  const dot = outline(".", size, -0.035);
  const markSize = size * 1.6;
  const gap = size * 0.32;
  const pad = size * 0.16;
  const w = Math.ceil(Math.max(markSize, word.width + dot.width) + pad * 2);
  const h = Math.ceil(markSize + gap + word.ascent + word.descent + pad * 2);
  const markX = (w - markSize) / 2;
  const wordX = (w - (word.width + dot.width)) / 2;
  const baseline = pad + markSize + gap + word.ascent;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
  <g transform="translate(${markX} ${pad}) scale(${markSize / 48})">${markPaths(accent, "none")}
  </g>
  <g transform="translate(${wordX} ${baseline})">
    <path d="${word.d}" fill="${color}"/>
    <g transform="translate(${word.width} 0)"><path d="${dot.d}" fill="${accent}"/></g>
  </g>
</svg>\n`;
}

/** Wordmark over the tagline, set in the mono face's tracking. */
function taglineLockup() {
  const size = 96;
  const word = outline("harystyles", size, -0.035);
  const dot = outline(".", size, -0.035);
  const tag = outline("LETTERS, NOT POSTS", size * 0.2, 0.18);
  const pad = size * 0.1;
  const gap = size * 0.24;
  const w = Math.ceil(Math.max(word.width + dot.width, tag.width) + pad * 2);
  const h = Math.ceil(word.ascent + word.descent + gap + tag.ascent + tag.descent + pad * 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
  <g transform="translate(${pad} ${pad + word.ascent})">
    <path d="${word.d}" fill="${BRAND.ink100}"/>
    <g transform="translate(${word.width} 0)"><path d="${dot.d}" fill="${BRAND.amber500}"/></g>
  </g>
  <g transform="translate(${pad} ${pad + word.ascent + word.descent + gap + tag.ascent})">
    <path d="${tag.d}" fill="${BRAND.amber500}"/>
  </g>
</svg>\n`;
}

/** The stamp — mark inside a hairline circle. Used as a seal, never as an app icon. */
const stamp = () => `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
  <circle cx="48" cy="48" r="46" stroke="${BRAND.amber500}" stroke-width="1.5"/>
  <g transform="translate(24 24) scale(1)">${markPaths(BRAND.amber500, "none")}
  </g>
</svg>\n`;

/** App icon: the mark on a squircle-ish rounded field, safe-area padded. */
const appIcon = (bg, stroke, size = 512) => {
  const inset = size * 0.22;
  const markSize = size - inset * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
  <rect width="${size}" height="${size}" rx="${size * 0.2237}" fill="${bg}"/>
  <g transform="translate(${inset} ${inset}) scale(${markSize / 48})">${markPaths(stroke, "none")}
  </g>
</svg>\n`;
};

/** Maskable icons must survive a circular crop, so the mark sits in the inner 80%. */
const maskableIcon = (size = 512) => {
  const inset = size * 0.3;
  const markSize = size - inset * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
  <rect width="${size}" height="${size}" fill="${BRAND.ink950}"/>
  <g transform="translate(${inset} ${inset}) scale(${markSize / 48})">${markPaths(BRAND.amber500, "none")}
  </g>
</svg>\n`;
};

// ---------------------------------------------------------------- textures

/** Paper grain — deterministic seed so the tile never changes between runs. */
const grain = () => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <filter id="g">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="200" height="200" filter="url(#g)" opacity="0.5"/>
</svg>\n`;

/** The lamp — a soft amber pool, used as a background treatment on artboards. */
const lampRadial = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <radialGradient id="lamp" cx="50%" cy="38%" r="62%">
    <stop offset="0%" stop-color="${BRAND.amber500}" stop-opacity="0.30"/>
    <stop offset="55%" stop-color="${BRAND.amber700}" stop-opacity="0.10"/>
    <stop offset="100%" stop-color="${BRAND.ink950}" stop-opacity="0"/>
  </radialGradient>
  <rect width="1080" height="1080" fill="url(#lamp)"/>
</svg>\n`;

// ---------------------------------------------------------------- write

await Promise.all([LOGO, FAVICON, TEXTURES].map((d) => mkdir(d, { recursive: true })));

const written = [];
const put = async (path, contents) => {
  await writeFile(path, contents);
  written.push(path.replace(ROOT + "/", ""));
};

for (const [name, v] of Object.entries(MARK_VARIANTS)) {
  await put(join(LOGO, `logomark-${name}.svg`), mark(v.stroke, v.hole));
}
await put(join(LOGO, "wordmark.svg"), wordmarkSvg());
await put(join(LOGO, "wordmark-ink.svg"), wordmarkSvg(BRAND.ink1000, BRAND.amber500));
await put(join(LOGO, "lockup-horizontal.svg"), lockupHorizontal());
await put(join(LOGO, "lockup-horizontal-ink.svg"), lockupHorizontal(BRAND.ink1000));
await put(join(LOGO, "lockup-stacked.svg"), lockupStacked());
await put(join(LOGO, "tagline-lockup.svg"), taglineLockup());
await put(join(LOGO, "stamp.svg"), stamp());

// App icons — three surfaces, four sizes each.
const ICONS = {
  ink: [BRAND.ink1000, BRAND.amber500],
  amber: [BRAND.amber500, BRAND.ink1000],
  vellum: [BRAND.ink50, BRAND.ink1000],
};
for (const [name, [bg, fg]] of Object.entries(ICONS)) {
  const svg = Buffer.from(appIcon(bg, fg));
  await put(join(LOGO, `app-icon-${name}.svg`), appIcon(bg, fg));
  for (const size of [512, 256, 128, 64]) {
    await writeFile(
      join(LOGO, `app-icon-${name}-${size}.png`),
      await sharp(svg).resize(size, size).png().toBuffer(),
    );
    written.push(`public/assets/logo/app-icon-${name}-${size}.png`);
  }
}

// Favicons — the ink colourway is the canonical one.
const faviconSvg = Buffer.from(appIcon(BRAND.ink1000, BRAND.amber500));
await put(join(FAVICON, "favicon.svg"), appIcon(BRAND.ink1000, BRAND.amber500));

for (const [file, size] of [["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512]]) {
  await writeFile(join(FAVICON, file), await sharp(faviconSvg).resize(size, size).png().toBuffer());
  written.push(`public/assets/favicon/${file}`);
}
await writeFile(
  join(FAVICON, "icon-512-maskable.png"),
  await sharp(Buffer.from(maskableIcon())).resize(512, 512).png().toBuffer(),
);
written.push("public/assets/favicon/icon-512-maskable.png");

/**
 * .ico, hand-assembled: sharp cannot write ICO, and the format is simple enough
 * that a dependency for it would be silly. Three PNG-compressed entries.
 */
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map((s) => sharp(faviconSvg).resize(s, s).png().toBuffer()),
);
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);            // reserved
header.writeUInt16LE(1, 2);            // type: icon
header.writeUInt16LE(icoSizes.length, 4);
let offset = 6 + icoSizes.length * 16;
const entries = icoImages.map((png, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(icoSizes[i] === 256 ? 0 : icoSizes[i], 0); // width
  e.writeUInt8(icoSizes[i] === 256 ? 0 : icoSizes[i], 1); // height
  e.writeUInt8(0, 2);                  // palette size
  e.writeUInt8(0, 3);                  // reserved
  e.writeUInt16LE(1, 4);               // colour planes
  e.writeUInt16LE(32, 6);              // bits per pixel
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});
await writeFile(join(FAVICON, "favicon.ico"), Buffer.concat([header, ...entries, ...icoImages]));
written.push("public/assets/favicon/favicon.ico");

await put(
  join(FAVICON, "site.webmanifest"),
  JSON.stringify(
    {
      name: "harystyles",
      short_name: "harystyles",
      description: "Letters, not posts.",
      start_url: "/",
      display: "standalone",
      background_color: BRAND.ink950,
      theme_color: BRAND.ink950,
      icons: [
        { src: "/assets/favicon/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/assets/favicon/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/assets/favicon/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    null,
    2,
  ) + "\n",
);

await put(join(TEXTURES, "grain.svg"), grain());
await writeFile(
  join(TEXTURES, "grain.png"),
  await sharp(Buffer.from(grain())).resize(200, 200).png().toBuffer(),
);
written.push("public/assets/textures/grain.png");
await put(join(TEXTURES, "lamp-radial.svg"), lampRadial());

console.log(written.join("\n"));
console.log(`\n${written.length} brand assets written.`);
