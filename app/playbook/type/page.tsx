import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Grid, PlaybookPage, Sample, Section } from "@/components/playbook/Page";
import styles from "./type.module.css";

export const metadata: Metadata = {
  title: "Type",
  description:
    "Three families. Fraunces for display and reading, Inter Tight for UI, JetBrains Mono for metadata.",
};

const FAMILIES = [
  {
    name: "Fraunces",
    role: "Display + reading",
    note: "Variable. opsz 9→144, SOFT 0→100, italic. Used for titles, body reading, pull quotes.",
    family: "var(--font-display)",
    style: "italic" as const,
    weight: 400,
    soft: 100,
  },
  {
    name: "Inter Tight",
    role: "UI",
    note: "Tight, clean, performant at small sizes. Used for nav, buttons, captions, system copy.",
    family: "var(--font-ui)",
    weight: 500,
  },
  {
    name: "JetBrains Mono",
    role: "Metadata",
    note: "Used for read-time, dates, eyebrows, reaction counts, IDs. Always uppercase, tracked wide.",
    family: "var(--font-mono)",
    weight: 500,
  },
];

type Spec = {
  label: string;
  size: number;
  lh: number;
  ls: string;
  family: string;
  weight: number;
  italic?: boolean;
  sample: string;
  varSettings?: string;
  /** Prose samples may wrap; short display samples keep their true width. */
  wrap?: boolean;
};

/** One row of the scale. Metadata, the specimen at its real size, the family. */
function Row({ label, size, lh, ls, family, weight, italic, sample, varSettings, wrap }: Spec) {
  const type: CSSProperties = {
    fontFamily: family,
    fontSize: size,
    lineHeight: lh,
    letterSpacing: ls,
    fontWeight: weight,
    fontStyle: italic ? "italic" : "normal",
    fontVariationSettings: varSettings,
  };

  return (
    <div className={styles.row}>
      <div>
        <div className={`mono ${styles.rowLabel}`}>{label}</div>
        <div className={`caption ${styles.rowMeta}`}>
          {size}px / {lh} / {ls}
        </div>
      </div>

      {wrap ? (
        <div className={styles.specimenWrap} style={type}>
          {sample}
        </div>
      ) : (
        <div className={styles.specimenRail}>
          <div className={styles.specimen} style={type}>
            {sample}
          </div>
        </div>
      )}

      <div className={`caption ${styles.rowFamily}`}>
        {family.split(",")[0].replace(/"/g, "")}
      </div>
    </div>
  );
}

const DISPLAY_SCALE: Spec[] = [
  { label: "HERO · 7XL", size: 120, lh: 1.0, ls: "-0.04em", family: "var(--font-display)", weight: 400, sample: "Letters, tonight.", varSettings: '"opsz" 144, "SOFT" 30' },
  { label: "DISPLAY · 6XL", size: 88, lh: 1.05, ls: "-0.035em", family: "var(--font-display)", weight: 400, sample: "The lamp is lit.", varSettings: '"opsz" 144, "SOFT" 50' },
  { label: "DISPLAY ITALIC · 5XL", size: 64, lh: 1.05, ls: "-0.025em", family: "var(--font-display)", weight: 400, italic: true, sample: "for tonight.", varSettings: '"opsz" 144, "SOFT" 100' },
  { label: "TITLE · 4XL", size: 48, lh: 1.1, ls: "-0.022em", family: "var(--font-display)", weight: 400, sample: "On the small grief of leaving", varSettings: '"opsz" 144, "SOFT" 50' },
  { label: "TITLE · 3XL", size: 36, lh: 1.15, ls: "-0.018em", family: "var(--font-display)", weight: 500, sample: "A letter to the version that stayed", varSettings: '"opsz" 96, "SOFT" 30' },
  { label: "TITLE · 2XL", size: 28, lh: 1.2, ls: "-0.012em", family: "var(--font-display)", weight: 500, sample: "Notes from a sleepless April" },
  { label: "TITLE · XL", size: 23, lh: 1.25, ls: "-0.01em", family: "var(--font-display)", weight: 500, sample: "What the river kept" },
];

const READING: Spec[] = [
  { label: "BODY · LG · 19", size: 19, lh: 1.7, ls: "0", family: "var(--font-body-serif)", weight: 400, wrap: true, sample: "I packed the kettle last. It seemed important — the last warm thing in the apartment that had ever held me." },
  { label: "BODY · MD · 17", size: 17, lh: 1.8, ls: "0", family: "var(--font-body-serif)", weight: 400, wrap: true, sample: "The grief of leaving a place is not the grief of a person. It does not require permission, or warning." },
  { label: "PULLQUOTE · 28", size: 28, lh: 1.25, ls: "-0.012em", family: "var(--font-display)", weight: 400, italic: true, wrap: true, sample: "They unfasten from us, slowly, the way a coat slips off a chair.", varSettings: '"opsz" 144, "SOFT" 100' },
];

const UI: Spec[] = [
  { label: "UI · LG · 17", size: 17, lh: 1.5, ls: "0", family: "var(--font-ui)", weight: 500, wrap: true, sample: "Become a patron" },
  { label: "UI · MD · 15", size: 15, lh: 1.5, ls: "0.005em", family: "var(--font-ui)", weight: 400, wrap: true, sample: "Read every letter Ines writes — including patron-only pieces." },
  { label: "UI · SM · 13", size: 13, lh: 1.45, ls: "0.01em", family: "var(--font-ui)", weight: 400, wrap: true, sample: "3 letters this month · 412 patrons" },
  { label: "CAPTION · 12", size: 12, lh: 1.4, ls: "0.01em", family: "var(--font-ui)", weight: 400, wrap: true, sample: "Cancel any time. 90% goes to the writer." },
];

const METADATA: Spec[] = [
  { label: "MONO · 11", size: 11, lh: 1.4, ls: "0.18em", family: "var(--font-mono)", weight: 500, wrap: true, sample: "7 MIN · MELANCHOLY · MAR 14" },
  { label: "EYEBROW · 11", size: 11, lh: 1.4, ls: "0.18em", family: "var(--font-ui)", weight: 500, wrap: true, sample: "ESSAY · MARCH 14, 2026" },
];

export default function TypePage() {
  return (
    <PlaybookPage
      href="/playbook/type"
      eyebrow="02 · TYPE"
      title={
        <>
          Three families, one{" "}
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            literary register.
          </span>
        </>
      }
      lede="Fraunces carries the display and the reading, Inter Tight carries the interface, JetBrains Mono carries the metadata. Nothing else is allowed on the page. Every specimen below shows its real size — the wide ones scroll rather than shrink."
    >
      <Section title="THE THREE FAMILIES">
        <Grid min={280}>
          {FAMILIES.map((f) => (
            <Sample key={f.name}>
              <div
                className={styles.familyGlyph}
                style={{
                  fontFamily: f.family,
                  fontWeight: f.weight,
                  fontStyle: f.style ?? "normal",
                  fontVariationSettings: f.soft ? `"opsz" 144, "SOFT" ${f.soft}` : undefined,
                }}
              >
                Aa
              </div>
              <div className="title-sm">{f.name}</div>
              <div className={`mono ${styles.familyRole}`}>{f.role.toUpperCase()}</div>
              <p className={`body-sm ${styles.familyNote}`}>{f.note}</p>
            </Sample>
          ))}
        </Grid>
      </Section>

      <Section title="DISPLAY SCALE — FRAUNCES">
        {DISPLAY_SCALE.map((s) => (
          <Row key={s.label} {...s} />
        ))}
      </Section>

      <Section title="READING — FRAUNCES BODY">
        {READING.map((s) => (
          <Row key={s.label} {...s} />
        ))}
      </Section>

      <Section title="UI — INTER TIGHT">
        {UI.map((s) => (
          <Row key={s.label} {...s} />
        ))}
      </Section>

      <Section title="METADATA — JETBRAINS MONO">
        {METADATA.map((s) => (
          <Row key={s.label} {...s} />
        ))}
      </Section>

      <Section title="SPECIMEN — A LETTER, IN FULL">
        <div className={styles.letter}>
          <div className={`mono ${styles.letterMeta}`}>ESSAY · 7 MIN · MELANCHOLY</div>
          <h2 className={`title-display ${styles.letterTitle}`}>
            On the small grief
            <br />
            <span className="italic-display">of leaving a city.</span>
          </h2>
          <p className={`italic-display ${styles.letterStanding}`}>
            A small inventory of what was left behind, and what came along by mistake.
          </p>
          <p className={`body-reading dropcap ${styles.letterBody}`}>
            I packed the kettle last. It seemed important — the last warm thing in the apartment
            that had ever held me. The radiator had been broken since November, and for four months
            I had boiled water just to feel something hot in the kitchen.
          </p>
          <blockquote className={styles.letterQuote}>
            <p className="pullquote" style={{ margin: 0 }}>
              We do not leave cities, I think. They unfasten from us, slowly, the way a coat slips
              off a chair.
            </p>
          </blockquote>
          <p className="body-reading">
            The boxes had agreed-upon names: <em>books</em>, <em>winter</em>, <em>kitchen</em>,{" "}
            <em>misc</em>. The last one swelled with the things that did not deserve a category. A
            single earring whose pair I had been mourning for two years.
          </p>
        </div>
      </Section>
    </PlaybookPage>
  );
}
