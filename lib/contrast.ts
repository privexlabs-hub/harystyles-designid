/**
 * WCAG contrast reporting for the colour page.
 *
 * The maths lives in lib/color.ts, which is also what the asset editor and the
 * build scripts use — there is one definition of OKLCH → sRGB in this codebase
 * and this file is not it.
 *
 * Token values come from lib/color.ts's OKLCH_TOKENS, transcribed from
 * app/tokens.css. Reading them from getComputedStyle instead would force this
 * section client-only, flash empty before hydration, and pre-render wrong under
 * static export. scripts/check-tokens.mjs guards the transcription.
 */
import { contrastRatio, HEX, type TokenName } from "@/lib/color";

export type { TokenName };

/** Contrast between two named tokens, with the AA verdicts spelled out. */
export function tokenContrast(fg: TokenName, bg: TokenName) {
  const ratio = contrastRatio(HEX[fg], HEX[bg]);
  return {
    ratio,
    label: `${ratio.toFixed(2)}:1`,
    /** WCAG AA, normal text (below 18.66px regular). */
    passesNormal: ratio >= 4.5,
    /** WCAG AA, large text (24px and up, or 18.66px bold and up). */
    passesLarge: ratio >= 3,
  };
}
