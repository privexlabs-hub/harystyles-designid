/**
 * Artboard palettes, resolved to literal colours.
 *
 * The playbook renders against CSS custom properties. Artboards cannot: Satori
 * resolves no variables and parses no oklch(), and an exported PNG has no
 * cascade to inherit from anyway. So every template reads its colours from a
 * resolved Palette object handed down by <Artboard>.
 *
 * The three themes and nine accents combine freely — 27 palettes from one
 * table — which is what keeps 150 templates consistent without 150 decisions.
 */
import { HEX, mix, tokenAlpha, contrastRatio, type TokenName } from "@/lib/color";

export const THEMES = ["ink", "dusk", "paper"] as const;
export type ThemeId = (typeof THEMES)[number];

export const ACCENTS = [
  "amber",
  "wine",
  "indigo",
  "tender",
  "restless",
  "melancholy",
  "still",
  "burning",
  "untethered",
] as const;
export type AccentId = (typeof ACCENTS)[number];

export const THEME_LABELS: Record<ThemeId, string> = {
  ink: "Ink",
  dusk: "Dusk",
  paper: "Paper",
};

export const ACCENT_LABELS: Record<AccentId, string> = {
  amber: "Amber",
  wine: "Wine",
  indigo: "Indigo",
  tender: "Tender",
  restless: "Restless",
  melancholy: "Melancholy",
  still: "Still",
  burning: "Burning",
  untethered: "Untethered",
};

export type Palette = {
  theme: ThemeId;
  accentId: AccentId;
  /** True when the surface is light, so templates can flip a shadow or a rule. */
  light: boolean;

  bg: string;
  bgRaised: string;
  bgCard: string;
  bgElevated: string;

  fg: string;
  fgStrong: string;
  fgMuted: string;
  fgSubtle: string;
  fgFaint: string;

  border: string;
  borderSoft: string;
  borderStrong: string;

  /** The accent, plus a wash of it and the text colour that sits on top. */
  accent: string;
  accentSoft: string;
  accentDeep: string;
  accentFg: string;

  premium: string;
  premiumSoft: string;
};

/** Each accent's light, mid and deep steps. Mood hues have only one, so the
 *  neighbouring steps are mixed from it against the theme's surfaces. */
const ACCENT_STEPS: Record<AccentId, { soft: TokenName | null; mid: TokenName; deep: TokenName | null }> = {
  amber: { soft: "amber-200", mid: "amber-500", deep: "amber-900" },
  wine: { soft: "wine-100", mid: "wine-500", deep: "wine-900" },
  indigo: { soft: "indigo-100", mid: "indigo-500", deep: "indigo-900" },
  tender: { soft: null, mid: "mood-tender", deep: null },
  restless: { soft: null, mid: "mood-restless", deep: null },
  melancholy: { soft: null, mid: "mood-melancholy", deep: null },
  still: { soft: null, mid: "mood-still", deep: null },
  burning: { soft: null, mid: "mood-burning", deep: null },
  untethered: { soft: null, mid: "mood-untethered", deep: null },
};

const SURFACES: Record<ThemeId, Omit<Palette, "theme" | "accentId" | "light" | "accent" | "accentSoft" | "accentDeep" | "accentFg" | "premium" | "premiumSoft">> = {
  ink: {
    bg: HEX["ink-950"],
    bgRaised: HEX["ink-900"],
    bgCard: HEX["ink-900"],
    bgElevated: HEX["ink-800"],
    fg: HEX["ink-100"],
    fgStrong: HEX["ink-50"],
    fgMuted: HEX["ink-300"],
    fgSubtle: HEX["ink-400"],
    fgFaint: HEX["ink-500"],
    border: HEX["ink-700"],
    borderSoft: HEX["ink-800"],
    borderStrong: HEX["ink-600"],
  },
  dusk: {
    bg: HEX["dusk-bg"],
    bgRaised: HEX["dusk-raised"],
    bgCard: HEX["dusk-card"],
    bgElevated: HEX["dusk-elevated"],
    fg: HEX["ink-100"],
    fgStrong: HEX["ink-50"],
    fgMuted: HEX["ink-300"],
    fgSubtle: HEX["ink-400"],
    fgFaint: HEX["ink-500"],
    border: HEX["dusk-border"],
    borderSoft: HEX["dusk-border-soft"],
    borderStrong: HEX["ink-600"],
  },
  paper: {
    bg: HEX["paper-bg"],
    bgRaised: HEX["paper-raised"],
    bgCard: HEX["paper-card"],
    bgElevated: HEX["paper-elevated"],
    fg: HEX["paper-fg"],
    fgStrong: HEX["paper-fg-strong"],
    fgMuted: HEX["paper-fg-muted"],
    fgSubtle: HEX["paper-fg-subtle"],
    fgFaint: HEX["paper-fg-faint"],
    border: HEX["paper-border"],
    borderSoft: HEX["paper-border-soft"],
    borderStrong: HEX["paper-fg-faint"],
  },
};

const LIGHT_THEMES: ThemeId[] = ["paper"];

export function resolvePalette(theme: ThemeId, accentId: AccentId): Palette {
  const surface = SURFACES[theme];
  const light = LIGHT_THEMES.includes(theme);
  const steps = ACCENT_STEPS[accentId];
  const accent = HEX[steps.mid];

  // Mood accents have no ramp, so their soft and deep steps are derived by
  // mixing toward the theme's own surfaces — that keeps a mood-accented
  // artboard in the same tonal world as an amber one.
  const accentSoft = steps.soft
    ? light
      ? HEX[steps.soft]
      : mix(accent, surface.bg, 0.18)
    : mix(accent, light ? surface.bg : surface.bg, light ? 0.22 : 0.18);
  const accentDeep = steps.deep ? HEX[steps.deep] : mix(accent, HEX["ink-1000"], 0.35);

  return {
    theme,
    accentId,
    light,
    ...surface,
    accent,
    accentSoft,
    accentDeep,
    // Text on an accent fill: whichever of ink or vellum actually contrasts.
    accentFg:
      contrastRatio(accent, HEX["ink-1000"]) >= contrastRatio(accent, HEX["ink-50"])
        ? HEX["ink-1000"]
        : HEX["ink-50"],
    premium: HEX["wine-500"],
    premiumSoft: light ? HEX["wine-100"] : HEX["wine-900"],
  };
}

/** A translucent wash of the page colour, for scrims over imagery. */
export function scrim(theme: ThemeId, alpha: number): string {
  return theme === "paper"
    ? tokenAlpha("paper-fg-strong", alpha)
    : tokenAlpha("ink-1000", alpha);
}

/** Every palette, precomputed — 27 of them, cheap enough to build eagerly. */
export const PALETTES: Record<string, Palette> = Object.fromEntries(
  THEMES.flatMap((t) => ACCENTS.map((a) => [`${t}:${a}`, resolvePalette(t, a)])),
);

export const getPalette = (theme: ThemeId, accent: AccentId): Palette =>
  PALETTES[`${theme}:${accent}`] ?? resolvePalette("ink", "amber");
