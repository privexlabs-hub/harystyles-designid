/**
 * Colour maths shared by the app and the build scripts.
 *
 * Two consumers need this and neither can read the CSS:
 *   - standalone assets (favicons, app icons) are consumed by tools that
 *     predate OKLCH
 *   - Satori resolves no CSS custom properties and does not parse oklch(), so
 *     every artboard style must carry a literal value
 *
 * So the token values live here in the same OKLCH coordinates as app/tokens.css
 * and are resolved on demand. scripts/check-tokens.mjs asserts the two stay in
 * step.
 */

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Linear-light → gamma-encoded sRGB. */
const encode = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

export type Rgb = { r: number; g: number; b: number };

/** OKLCH → sRGB, each channel 0–255. Out-of-gamut values are clipped. */
export function oklchToRgb(L: number, C: number, hDeg: number): Rgb {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const bb = C * Math.sin(h);

  // Oklab → LMS (cube), then LMS → linear sRGB.
  const l = (L + 0.3963377774 * a + 0.2158037573 * bb) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * bb) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * bb) ** 3;

  return {
    r: Math.round(clamp01(encode(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)) * 255),
    g: Math.round(clamp01(encode(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)) * 255),
    b: Math.round(clamp01(encode(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)) * 255),
  };
}

const hex2 = (n: number) => n.toString(16).padStart(2, "0");

export function oklch(L: number, C: number, h: number): string {
  const { r, g, b } = oklchToRgb(L, C, h);
  return `#${hex2(r)}${hex2(g)}${hex2(b)}`;
}

/** Same, with alpha — emitted as #rrggbbaa, which Satori does parse. */
export function oklcha(L: number, C: number, h: number, alpha: number): string {
  return oklch(L, C, h) + hex2(Math.round(clamp01(alpha) * 255));
}

/** WCAG relative luminance from an sRGB triple. */
export function luminance({ r, g, b }: Rgb): number {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/** WCAG contrast ratio, 1–21. Accepts sRGB triples or hex strings. */
export function contrastRatio(a: Rgb | string, b: Rgb | string): number {
  const toRgb = (v: Rgb | string) => (typeof v === "string" ? hexToRgb(v) : v);
  const [hi, lo] = [luminance(toRgb(a)), luminance(toRgb(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// =========================================================
// Token values, mirroring app/tokens.css.
// =========================================================

/** [L, C, h] triples, exactly as written in app/tokens.css. */
export const OKLCH_TOKENS = {
  "ink-1000": [0.13, 0.022, 285],
  "ink-950": [0.165, 0.022, 285],
  "ink-900": [0.205, 0.022, 285],
  "ink-800": [0.255, 0.02, 285],
  "ink-700": [0.32, 0.018, 285],
  "ink-600": [0.42, 0.015, 285],
  "ink-500": [0.55, 0.012, 285],
  "ink-400": [0.68, 0.01, 80],
  "ink-300": [0.8, 0.012, 75],
  "ink-200": [0.88, 0.014, 72],
  "ink-100": [0.94, 0.015, 75],
  "ink-50": [0.97, 0.012, 78],

  "amber-50": [0.96, 0.025, 75],
  "amber-100": [0.92, 0.045, 70],
  "amber-200": [0.85, 0.08, 65],
  "amber-300": [0.78, 0.11, 60],
  "amber-400": [0.72, 0.135, 55],
  "amber-500": [0.66, 0.15, 45],
  "amber-600": [0.56, 0.14, 38],
  "amber-700": [0.46, 0.12, 32],
  "amber-800": [0.36, 0.09, 30],
  "amber-900": [0.26, 0.06, 30],

  "wine-100": [0.85, 0.04, 15],
  "wine-300": [0.65, 0.11, 10],
  "wine-500": [0.5, 0.13, 10],
  "wine-700": [0.34, 0.09, 12],
  "wine-900": [0.22, 0.055, 14],

  "indigo-100": [0.85, 0.055, 275],
  "indigo-300": [0.65, 0.13, 275],
  "indigo-500": [0.55, 0.16, 275],
  "indigo-700": [0.4, 0.13, 275],
  "indigo-900": [0.26, 0.075, 277],

  "mood-tender": [0.78, 0.075, 25],
  "mood-restless": [0.72, 0.135, 55],
  "mood-melancholy": [0.65, 0.06, 250],
  "mood-still": [0.74, 0.045, 160],
  "mood-burning": [0.62, 0.165, 25],
  "mood-untethered": [0.78, 0.05, 290],

  // Paper theme.
  "paper-bg": [0.97, 0.012, 78],
  "paper-raised": [0.945, 0.015, 78],
  "paper-card": [0.99, 0.008, 80],
  "paper-elevated": [0.93, 0.018, 75],
  "paper-fg": [0.2, 0.02, 80],
  "paper-fg-strong": [0.13, 0.022, 75],
  "paper-fg-muted": [0.38, 0.02, 75],
  "paper-fg-subtle": [0.5, 0.018, 75],
  "paper-fg-faint": [0.62, 0.015, 75],
  "paper-border": [0.85, 0.015, 75],
  "paper-border-soft": [0.92, 0.012, 75],

  // Dusk theme.
  "dusk-bg": [0.18, 0.04, 35],
  "dusk-raised": [0.22, 0.045, 35],
  "dusk-card": [0.215, 0.045, 35],
  "dusk-elevated": [0.27, 0.045, 35],
  "dusk-border": [0.34, 0.035, 35],
  "dusk-border-soft": [0.27, 0.04, 35],
} as const satisfies Record<string, readonly [number, number, number]>;

export type TokenName = keyof typeof OKLCH_TOKENS;

/** Every token resolved to #rrggbb. */
export const HEX = Object.fromEntries(
  Object.entries(OKLCH_TOKENS).map(([k, v]) => [k, oklch(v[0], v[1], v[2])]),
) as Record<TokenName, string>;

/** A token with alpha, for scrims and washes. */
export function tokenAlpha(name: TokenName, alpha: number): string {
  const [l, c, h] = OKLCH_TOKENS[name];
  return oklcha(l, c, h, alpha);
}

/** Blend two resolved colours — the literal stand-in for CSS color-mix(). */
export function mix(a: string, b: string, amountOfA: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const t = clamp01(amountOfA);
  const ch = (x: number, y: number) => Math.round(x * t + y * (1 - t));
  return `#${hex2(ch(A.r, B.r))}${hex2(ch(A.g, B.g))}${hex2(ch(A.b, B.b))}`;
}
