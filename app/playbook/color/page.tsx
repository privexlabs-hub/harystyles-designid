import type { Metadata } from "next";
import { Grid, PlaybookPage, Section } from "@/components/playbook/Page";
import { type TokenName, tokenContrast } from "@/lib/contrast";
import styles from "./color.module.css";

export const metadata: Metadata = {
  title: "Colour",
  description:
    "An OKLCH ink palette with a single warm amber accent. Mood swatches for discovery only.",
};

function Swatch({ token, role, value }: { token: string; role?: string; value: string }) {
  return (
    <div className={styles.swatch}>
      <div className={styles.chip} style={{ background: value }} />
      <div className={`mono ${styles.swatchToken}`}>{token}</div>
      <div className={`caption ${styles.swatchRole}`}>{role}</div>
    </div>
  );
}

const AMBER = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const WINE = [100, 300, 500, 700, 900];
const INDIGO = [100, 300, 500, 700, 900];

const INK_ROLES: Record<number, string> = {
  950: "page bg",
  900: "card",
  800: "elevated",
  700: "divider",
  500: "subtle",
  400: "muted",
  200: "body",
  100: "vellum text",
};

const SEMANTIC: Array<[string, string]> = [
  ["--bg", "page"],
  ["--bg-card", "card"],
  ["--bg-elevated", "raised"],
  ["--bg-scrim", "modal scrim"],
  ["--fg-strong", "display"],
  ["--fg", "body"],
  ["--fg-muted", "secondary"],
  ["--fg-subtle", "tertiary"],
  ["--border", "hairline"],
  ["--border-strong", "strong rule"],
  ["--accent", "brand action"],
  ["--premium", "patron"],
];

const MOODS: Array<[string, string, string]> = [
  ["Tender", "var(--mood-tender)", "soft, ached, gentle"],
  ["Restless", "var(--mood-restless)", "won't sit still"],
  ["Melancholy", "var(--mood-melancholy)", "blue, low-lit"],
  ["Still", "var(--mood-still)", "quiet, observed"],
  ["Burning", "var(--mood-burning)", "alive, urgent"],
  ["Untethered", "var(--mood-untethered)", "drifting, light"],
];

/**
 * Each pairing names the *ramp* tokens behind its semantic roles, because the
 * ratio has to be computed from real coordinates, and --bg / --fg-strong are
 * aliases. The alias is what the tile paints with; the ramp token is what the
 * number is measured from.
 */
const PAIRINGS: Array<{
  bg: string;
  fg: string;
  bgToken: TokenName;
  fgToken: TokenName;
  label: string;
  sample: string;
}> = [
  { bg: "var(--bg)", fg: "var(--fg-strong)", bgToken: "ink-950", fgToken: "ink-50", label: "Display on page", sample: "the lamp is lit" },
  { bg: "var(--bg)", fg: "var(--accent)", bgToken: "ink-950", fgToken: "amber-500", label: "Accent on page", sample: "for tonight." },
  { bg: "var(--accent)", fg: "var(--ink-1000)", bgToken: "amber-500", fgToken: "ink-1000", label: "Primary CTA", sample: "Become a patron" },
  { bg: "var(--bg-card)", fg: "var(--fg)", bgToken: "ink-900", fgToken: "ink-100", label: "Body in card", sample: "I packed the kettle last." },
  { bg: "var(--premium)", fg: "var(--ink-100)", bgToken: "wine-500", fgToken: "ink-100", label: "Patron CTA", sample: "Support Ines" },
  { bg: "var(--bg-elevated)", fg: "var(--fg-muted)", bgToken: "ink-800", fgToken: "ink-300", label: "Tertiary chip", sample: "7 MIN · MAR 14" },
];

export default function ColorPage() {
  return (
    <PlaybookPage
      href="/playbook/color"
      eyebrow="03 · COLOR"
      title={
        <>
          Ink, lamp, wine, and a{" "}
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            palette of moods.
          </span>
        </>
      }
      lede="Defined in OKLCH so the dark and paper themes share the same perceptual brightness curve. Every neutral has a warm bias — never cool. Shadow tint is warm-purple, never black."
    >
      <Section
        title="BRAND · LAMPLIGHT (AMBER)"
        note="The single brand accent. Used sparingly: titles, primary CTAs, the lit lamp. Never gradients, never glows except on the lamp itself."
      >
        <Grid min={128}>
          {AMBER.map((s) => (
            <Swatch
              key={s}
              token={`--amber-${s}`}
              role={s === 500 ? "primary" : ""}
              value={`var(--amber-${s})`}
            />
          ))}
        </Grid>
      </Section>

      <Section
        title="SECONDARY · WINE"
        note="Reserved for patron / premium signals. Never compete with brand amber."
      >
        <Grid min={128}>
          {WINE.map((s) => (
            <Swatch
              key={s}
              token={`--wine-${s}`}
              role={s === 500 ? "patron" : ""}
              value={`var(--wine-${s})`}
            />
          ))}
        </Grid>
      </Section>

      <Section
        title="THIRD ACCENT · INDIGO"
        note="Added to the palette after the original artboards were drawn. The asset editor's avatar and ad variants are specified by colour in the brand brief, and neither amber nor wine could carry a cool option. Lightness steps match the amber and wine ramps, so swapping --accent between the three never changes contrast. Indigo is never the brand accent — it is a variant colour only."
      >
        <Grid min={128}>
          {INDIGO.map((s) => (
            <Swatch
              key={s}
              token={`--indigo-${s}`}
              role={s === 500 ? "editor variant" : ""}
              value={`var(--indigo-${s})`}
            />
          ))}
        </Grid>
      </Section>

      <Section
        title="INK NEUTRALS · WARM-VIOLET BIAS"
        note={`Page surfaces. Top end (50–200) is the cream "vellum" — used as text in dark mode, as paper in light mode.`}
      >
        <Grid min={128}>
          {[1000, 950, 900, 800, 700, 600].map((s) => (
            <Swatch key={s} token={`--ink-${s}`} role={INK_ROLES[s] ?? ""} value={`var(--ink-${s})`} />
          ))}
        </Grid>
        <div className={styles.sectionSpacer} />
        <Grid min={128}>
          {[500, 400, 300, 200, 100, 50].map((s) => (
            <Swatch key={s} token={`--ink-${s}`} role={INK_ROLES[s] ?? ""} value={`var(--ink-${s})`} />
          ))}
        </Grid>
      </Section>

      <Section title="SEMANTIC ROLES">
        <Grid min={150}>
          {SEMANTIC.map(([token, role]) => (
            <Swatch key={token} token={token} role={role} value={`var(${token})`} />
          ))}
        </Grid>
      </Section>

      <Section
        title="MOOD SWATCHES · DISCOVERY ONLY"
        note="Used only on mood pickers, mood pills, and mood-tinted notebook cards. Never as primary brand color."
      >
        <Grid min={150}>
          {MOODS.map(([k, v, d]) => (
            <div key={k}>
              <div className={styles.chipBare} style={{ background: v }} />
              <div className={`title-sm ${styles.moodName}`}>{k}</div>
              <div className={`caption ${styles.moodDesc}`}>{d}</div>
            </div>
          ))}
        </Grid>
      </Section>

      <Section
        title="PAIRINGS · CONTRAST CHECK (WCAG AA)"
        note="The ratios below are computed from the OKLCH token values, not asserted. AA wants 4.5:1 for normal text and 3:1 for large text (24px+, or 18.66px+ bold). Each sample is set at 22px, so it is judged as normal text."
      >
        <Grid min={280}>
          {PAIRINGS.map((p) => {
            const c = tokenContrast(p.fgToken, p.bgToken);
            return (
              <div key={p.label} className={styles.pairing} style={{ background: p.bg, color: p.fg }}>
                <div className={`mono ${styles.pairingLabel}`}>{p.label}</div>
                <div className={styles.pairingSample}>{p.sample}</div>
                <div className={styles.pairingResult}>
                  <span className={`mono-num ${styles.pairingRatio}`}>{c.label}</span>
                  <span className={`mono ${styles.pairingVerdict}`}>
                    {c.passesNormal ? "✓ AA NORMAL" : "✗ AA NORMAL"} ·{" "}
                    {c.passesLarge ? "✓ AA LARGE" : "✗ AA LARGE"}
                  </span>
                </div>
              </div>
            );
          })}
        </Grid>
      </Section>
    </PlaybookPage>
  );
}
