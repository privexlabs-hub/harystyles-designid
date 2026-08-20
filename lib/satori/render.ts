/**
 * The Satori half of the render pipeline: React element tree → SVG.
 *
 * The same element tree is handed to React DOM for the live preview, so a
 * template is authored once. What that buys in consistency it costs in CSS:
 * see constraints.ts for the properties Satori silently ignores.
 */
import satori from "satori";
import type { ReactElement } from "react";
import { loadBrandFonts, loadFallbackFonts, type SatoriFont } from "./fonts";

export type RenderSize = { width: number; height: number };

/**
 * Satori asks for an asset when it meets a codepoint no loaded font covers.
 * We answer with Noto — fetched once, on first need — so a pasted emoji or a
 * non-Latin name exports as itself rather than as a row of empty boxes.
 */
async function loadAdditionalAsset(code: string, segment: string) {
  // `emoji` is Satori's signal for a pictographic run; anything else is a
  // language code for a script we have no brand face for.
  if (code === "emoji") {
    const fonts = await loadFallbackFonts();
    const emoji = fonts.find((f) => f.name === "Noto Emoji");
    return emoji ? [{ ...emoji, name: "Noto Emoji" }] : [];
  }

  const fonts = await loadFallbackFonts();
  const sans = fonts.filter((f) => f.name === "Noto Sans");
  if (sans.length) return sans;

  console.warn(`No font covers "${segment}" (${code}); it will render blank.`);
  return [];
}

export async function renderToSvg(
  element: ReactElement,
  { width, height }: RenderSize,
  extraFonts: SatoriFont[] = [],
): Promise<string> {
  const fonts = [...(await loadBrandFonts()), ...extraFonts];

  return satori(element, {
    width,
    height,
    fonts,
    loadAdditionalAsset: loadAdditionalAsset as never,
  });
}
