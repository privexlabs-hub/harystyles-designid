/**
 * Builds the render context a template is given.
 *
 * The scale unit `u` is the whole trick: a template is authored against a 1080
 * grid and `u` maps it onto the artboard in hand, so one layout serves a square
 * post, a 400px avatar and a 2560px channel banner. It scales on the SHORT edge,
 * because that is what governs how large type can be before it crowds.
 */
import { getPalette } from "./theme";
import type { Ctx, FieldValues, Variant } from "./types";
import type { Size } from "./sizes";

export function makeCtx({
  size,
  variant,
  values,
}: {
  size: Size;
  variant: Variant;
  values: FieldValues;
}): Ctx {
  const short = Math.min(size.w, size.h);
  // Very wide banners have almost no vertical room, so they are scaled off the
  // short edge but with a floor — otherwise a 191px LinkedIn cover would set
  // its wordmark at four pixels.
  const unit = Math.max(short / 1080, 0.24);

  const u = (n: number) => Math.round(n * unit * 100) / 100;
  const m = Math.round(short * 0.083);

  return {
    p: getPalette(variant.theme, variant.accent),
    size,
    variant,
    u,
    inner: { w: size.w - m * 2, h: size.h - m * 2 },
    text: (key) => {
      const v = values[key];
      return typeof v === "string" ? v : v == null ? "" : String(v);
    },
    num: (key) => {
      const v = values[key];
      return typeof v === "number" ? v : Number(v) || 0;
    },
    bool: (key) => values[key] === true || values[key] === "true",
    list: (key) => {
      const v = values[key];
      return Array.isArray(v) ? v : typeof v === "string" && v ? v.split("\n") : [];
    },
  };
}
