/**
 * OKLCH → sRGB hex.
 *
 * tokens.css defines every colour in OKLCH, but standalone .svg and .png assets
 * are consumed by tools that predate it (favicons, app icons, OG images), so the
 * generator resolves them to hex once, here, rather than guessing by eye.
 */
const clamp01 = (n) => Math.min(1, Math.max(0, n));

/** Linear-light channel → gamma-encoded sRGB. */
const encode = (c) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

export function oklch(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  // Oklab → LMS (cube roots), then LMS → linear sRGB.
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;

  const rgb = [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];

  return (
    "#" +
    rgb
      .map((c) => Math.round(clamp01(encode(c)) * 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** The subset of tokens.css that standalone assets need, resolved to hex. */
export const BRAND = {
  amber500: oklch(0.66, 0.15, 45),
  amber700: oklch(0.46, 0.12, 32),
  ink1000: oklch(0.13, 0.022, 285),
  ink950: oklch(0.165, 0.022, 285),
  ink100: oklch(0.94, 0.015, 75),
  ink50: oklch(0.97, 0.012, 78),
  wine500: oklch(0.5, 0.13, 10),
  indigo500: oklch(0.55, 0.16, 275),
};
