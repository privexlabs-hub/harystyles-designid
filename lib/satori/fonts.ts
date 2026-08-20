/**
 * Font loading for Satori.
 *
 * Satori takes raw TTF/OTF buffers — it cannot use the browser's loaded
 * @font-face set, and it has no variable-axis API, which is why the fetch
 * script bakes static instances.
 *
 * The brand faces (~2.4 MB) load once and are cached for the session. The Noto
 * fallbacks (~1.9 MB) are deliberately excluded from that set and fetched only
 * when a template actually contains a glyph the brand faces lack.
 */
import { assetUrl } from "@/lib/assetUrl";
import manifest from "@/public/assets/fonts/manifest.json";

export type SatoriFont = {
  name: string;
  data: ArrayBuffer;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: "normal" | "italic";
};

type ManifestEntry = {
  family: string;
  weight: number;
  style: string;
  ttf: string;
  woff2: string | null;
};

const ENTRIES = manifest as ManifestEntry[];

/**
 * Families loaded before any render.
 *
 * "Noto Symbols" is in here despite being a Noto face: it carries ❦ ♡ ✦ ◐,
 * which none of the three brand families have and which the brand uses as its
 * bullet, its reactions and its full stop. It is subsetted to those glyphs, so
 * it costs 3 KiB rather than 700.
 */
export const BRAND_FAMILIES = [
  "Fraunces",
  "Fraunces Text",
  "Inter Tight",
  "JetBrains Mono",
  "Noto Symbols",
];

/** Fetched only when a glyph turns up that nothing above covers. */
const FALLBACK_FAMILIES = ["Noto Sans", "Noto Emoji"];

async function fetchFonts(entries: ManifestEntry[]): Promise<SatoriFont[]> {
  return Promise.all(
    entries.map(async (e) => {
      const res = await fetch(assetUrl(e.ttf));
      if (!res.ok) throw new Error(`Font fetch failed: ${e.ttf} (${res.status})`);
      return {
        name: e.family,
        data: await res.arrayBuffer(),
        weight: e.weight as SatoriFont["weight"],
        style: e.style as SatoriFont["style"],
      };
    }),
  );
}

let brandPromise: Promise<SatoriFont[]> | null = null;
let fallbackPromise: Promise<SatoriFont[]> | null = null;

/** The brand faces. Cached — every render after the first is free. */
export function loadBrandFonts(): Promise<SatoriFont[]> {
  brandPromise ??= fetchFonts(ENTRIES.filter((e) => BRAND_FAMILIES.includes(e.family)));
  return brandPromise;
}

/** Noto Sans + Noto Emoji, fetched only when a glyph needs them. */
export function loadFallbackFonts(): Promise<SatoriFont[]> {
  fallbackPromise ??= fetchFonts(ENTRIES.filter((e) => FALLBACK_FAMILIES.includes(e.family)));
  return fallbackPromise;
}

/** How much the brand set weighs, for the editor's loading copy. */
export const BRAND_FONT_COUNT = ENTRIES.filter((e) => BRAND_FAMILIES.includes(e.family)).length;

/**
 * The font stacks templates use. Written out rather than referencing CSS
 * variables, because Satori and the DOM must be given the same list and only
 * one of them can read a variable.
 */
export const FONT_STACK = {
  display: '"Fraunces", "Noto Symbols", "Noto Sans", Georgia, serif',
  reading: '"Fraunces Text", "Fraunces", "Noto Symbols", "Noto Sans", Georgia, serif',
  ui: '"Inter Tight", "Noto Symbols", "Noto Sans", system-ui, sans-serif',
  mono: '"JetBrains Mono", "Noto Symbols", "Noto Sans", ui-monospace, monospace',
} as const;

export type FontRole = keyof typeof FONT_STACK;
