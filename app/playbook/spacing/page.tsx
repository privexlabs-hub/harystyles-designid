import type { Metadata } from "next";
import { Grid, PlaybookPage, Rail, Sample, Section } from "@/components/playbook/Page";
import styles from "./spacing.module.css";

export const metadata: Metadata = {
  title: "Spacing",
  description:
    "The 4px spacing scale, radii, warm-violet shadows, unhurried motion, and the reading measure.",
};

const SPACES: [string, number][] = [
  ["--s-1", 4], ["--s-2", 8], ["--s-3", 12], ["--s-4", 16], ["--s-5", 24],
  ["--s-6", 32], ["--s-7", 40], ["--s-8", 48], ["--s-9", 64], ["--s-10", 80], ["--s-11", 96],
];

const RADII: [string, number][] = [
  ["--r-xs", 3], ["--r-sm", 6], ["--r-md", 10], ["--r-lg", 14],
  ["--r-xl", 20], ["--r-2xl", 28], ["--r-pill", 999],
];

const SHADOWS = ["xs", "sm", "md", "lg", "glow"] as const;

const MOTION = [
  { t: "--dur-1", v: "120ms", note: "press / micro" },
  { t: "--dur-2", v: "220ms", note: "default state change" },
  { t: "--dur-3", v: "360ms", note: "modal / sheet" },
  { t: "--dur-4", v: "600ms", note: "scenic / lamp" },
];

const EASING = [
  { t: "--ease-out", d: "default", c: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
  { t: "--ease-in-out", d: "transitions", c: "cubic-bezier(0.45, 0, 0.2, 1)" },
  { t: "--ease-overshoot", d: "arrival", c: "cubic-bezier(0.34, 1.4, 0.6, 1)" },
];

const MEASURES: [string, string, string][] = [
  ["--measure-narrow", "38ch", "verse, lists, captions"],
  ["--measure", "62ch", "default body — long-form"],
  ["--measure-wide", "72ch", "essays, dense reading"],
];

export default function SpacingPage() {
  return (
    <PlaybookPage
      href="/playbook/spacing"
      eyebrow="04 · SPACING · RADII · SHADOWS · MOTION"
      title={
        <>
          Quiet rules for{" "}
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            generous space.
          </span>
        </>
      }
      lede="Everything sits on a 4px base. Radii soften as surfaces grow, shadows carry a warm-violet tint rather than neutral black, and nothing moves faster than it has to."
    >
      <Section title="SPACING · 4PX BASE">
        {/* Each bar's width IS its token value, so the row can't be allowed to
            shrink — it scrolls inside a Rail on a narrow screen instead. */}
        <Sample>
          <Rail>
            <div className={styles.scale}>
              {SPACES.map(([t, px]) => (
                <div key={t} className={styles.scaleRow}>
                  <div className="mono" style={{ fontSize: 10 }}>{t}</div>
                  <div className="caption">{px}px</div>
                  <div className={styles.bar} style={{ width: px }} />
                </div>
              ))}
            </div>
          </Rail>
        </Sample>
      </Section>

      <Section title="RADII">
        <Grid min={120}>
          {RADII.map(([t, r]) => (
            <div key={t}>
              <div className={styles.radiusTile} style={{ borderRadius: r }}>
                {r === 999 ? "pill" : `${r}`}
              </div>
              <div className="mono" style={{ fontSize: 9, marginTop: 6 }}>{t}</div>
            </div>
          ))}
        </Grid>
      </Section>

      <Section title="SHADOWS · WARM-VIOLET TINT">
        <Grid min={200}>
          {SHADOWS.map((s) => (
            <div
              key={s}
              className={styles.shadowTile}
              style={{
                boxShadow: s === "glow" ? "var(--shadow-glow)" : `var(--shadow-${s})`,
                border: s === "glow" ? "1px solid var(--accent)" : "1px solid var(--border-soft)",
              }}
            >
              <div className="mono" style={{ fontSize: 10 }}>--shadow-{s}</div>
            </div>
          ))}
        </Grid>
      </Section>

      <Section title="MOTION · UNHURRIED">
        <Grid min={200}>
          {MOTION.map((m) => (
            <Sample key={m.t}>
              <div className="mono" style={{ fontSize: 10 }}>{m.t}</div>
              <div className="title-md" style={{ marginTop: 8, fontSize: 22 }}>{m.v}</div>
              <div className="caption" style={{ marginTop: 4 }}>{m.note}</div>
            </Sample>
          ))}
        </Grid>

        <Sample style={{ marginTop: "var(--s-4)" }}>
          <div className="mono" style={{ fontSize: 10, marginBottom: 10 }}>EASING</div>
          <ul className={styles.easingList}>
            {EASING.map((e) => (
              <li key={e.t} className="body-sm" style={{ color: "var(--fg)" }}>
                <strong>{e.t}</strong> · {e.d}
                <br />
                <span className="mono" style={{ fontSize: 9 }}>{e.c}</span>
              </li>
            ))}
          </ul>
        </Sample>
      </Section>

      <Section title="READING MEASURE">
        <Grid min={220}>
          {MEASURES.map(([t, v, d]) => (
            <Sample key={t}>
              <div className="mono" style={{ fontSize: 10 }}>{t}</div>
              <div className="title-md" style={{ marginTop: 6, fontSize: 22 }}>{v}</div>
              <div className="caption" style={{ marginTop: 4 }}>{d}</div>
            </Sample>
          ))}
        </Grid>
      </Section>
    </PlaybookPage>
  );
}
