import type { Metadata } from "next";
import { Grid, PlaybookPage, Sample, Section } from "@/components/playbook/Page";
import { HSLogomark, HSWordmark, Icon, ICON_NAMES } from "@/components/ui";
import { REACTIONS } from "@/lib/fixtures";
import styles from "./brand.module.css";

export const metadata: Metadata = {
  title: "Brand",
  description:
    "Voice, lockups, iconography, and the words we use — and the ones we don't.",
};

const VOICE = [
  {
    t: "Quiet, not loud",
    d: "Lowercase ‘harystyles’. Sentence case everywhere. We never shout — and we never use marketing-speak like ‘unlock’, ‘join the community’, or ‘exclusive’.",
  },
  {
    t: "Literary, not technical",
    d: "Letters, not posts. Patrons, not subscribers. Notebooks, not collections. Shelf, not library. The lamp is lit, not ‘5 unread items’.",
  },
  {
    t: "Tender, not breezy",
    d: "We can be sad. We can be slow. We can use a semicolon. We trust readers with long sentences and quiet pauses.",
  },
  {
    t: "Specific, never generic",
    d: "Replace ‘story’ with ‘letter’ or the actual title. Replace ‘creator’ with the writer's name. We name things, including the dark.",
  },
];

const WE_SAY = [
  "letter · piece · essay",
  "writer · author",
  "patron · reader",
  "notebook · series",
  "the lamp is lit",
  "kept · saved a line",
  "tonight, gently",
];

const WE_DONT = [
  "post · article · content",
  "creator · influencer",
  "subscriber · user",
  "collection · feed",
  "new content available",
  "liked · clapped · bookmarked",
  "trending now",
];

export default function BrandPage() {
  return (
    <PlaybookPage
      href="/playbook/brand"
      eyebrow="01 · BRAND"
      title={
        <>
          The lamp, the letter, the{" "}
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            quiet voice.
          </span>
        </>
      }
      lede="harystyles is a place for emotional long-form writing. The brand reads as a literary publication that happens to be digital — not a tech product that happens to publish writing."
    >
      <Section title="LOGO + LOCKUPS">
        <Grid min={280}>
          <Sample label="PRIMARY · WORDMARK">
            <div className={styles.lockup}>
              <HSLogomark size={48} />
              <HSWordmark size={42} />
            </div>
          </Sample>

          <Sample label="MARK ONLY · APP ICON">
            <div className={styles.iconRow}>
              <div className={styles.appIcon} style={{ background: "var(--ink-1000)", border: "1px solid var(--border)" }}>
                <HSLogomark size={36} hole="var(--ink-1000)" />
              </div>
              <div className={styles.appIcon} style={{ background: "var(--accent)" }}>
                <HSLogomark size={36} color="var(--ink-1000)" hole="var(--accent)" />
              </div>
              <div className={styles.appIcon} style={{ background: "var(--ink-100)" }}>
                <HSLogomark size={36} color="var(--ink-1000)" hole="var(--ink-100)" />
              </div>
            </div>
          </Sample>
        </Grid>

        <Grid min={220}>
          <Sample label="TAGLINE LOCKUP" style={{ marginTop: "var(--s-4)" }}>
            <HSWordmark size={28} />
            <div className="mono" style={{ marginTop: 10, fontSize: 11, color: "var(--accent)" }}>
              LETTERS, NOT POSTS
            </div>
          </Sample>
          <Sample label="SMALL · UI" style={{ marginTop: "var(--s-4)" }}>
            <div className={styles.lockupSm}>
              <HSLogomark size={20} />
              <HSWordmark size={18} />
            </div>
          </Sample>
          <Sample label="STAMP" style={{ marginTop: "var(--s-4)" }}>
            <div className={styles.stamp}>
              <HSLogomark size={32} />
            </div>
          </Sample>
        </Grid>
      </Section>

      <Section title="VOICE & TONE">
        <Grid min={400}>
          {VOICE.map((c) => (
            <Sample key={c.t}>
              <div className="title-md" style={{ marginBottom: 8 }}>
                {c.t}
              </div>
              <p className="body-sm" style={{ margin: 0 }}>
                {c.d}
              </p>
            </Sample>
          ))}
        </Grid>
      </Section>

      <Section title="WORDS WE USE — AND DON'T">
        <Grid min={400}>
          <div className={styles.wordCard} style={{ borderLeft: "3px solid var(--mood-still)" }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--mood-still)", marginBottom: 12 }}>
              WE SAY
            </div>
            <ul className={styles.wordList}>
              {WE_SAY.map((w) => (
                <li key={w} className="body-reading" style={{ fontSize: 16 }}>
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.wordCard} style={{ borderLeft: "3px solid var(--mood-burning)" }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--mood-burning)", marginBottom: 12 }}>
              WE DON&rsquo;T
            </div>
            <ul className={styles.wordList}>
              {WE_DONT.map((w) => (
                <li
                  key={w}
                  className="body-reading"
                  style={{ fontSize: 16, color: "var(--fg-faint)", textDecoration: "line-through" }}
                >
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </Grid>
      </Section>

      <Section
        title="ICONOGRAPHY · 1.6PX STROKE · ROUNDED CAPS"
        note="Hairline icons inspired by editorial bookmark glyphs. We avoid filled UI icons except as toggle-on states. Reactions use typographic glyphs (❦ ♡ ✦ ◐) drawn from the display serif rather than icons — they belong to the letter, not the chrome."
      >
        <Sample>
          <div className={styles.iconGrid}>
            {ICON_NAMES.map((name) => {
              const Glyph = Icon[name];
              return (
                <div key={name} className={styles.iconCell}>
                  <Glyph />
                  <div className="mono" style={{ fontSize: 9 }}>
                    {name}
                  </div>
                </div>
              );
            })}
          </div>
        </Sample>
      </Section>

      <Section title="REACTION GLYPHS · DRAWN FROM THE SERIF">
        <Sample>
          <div className={styles.glyphRow}>
            {REACTIONS.map((r) => (
              <div key={r.label} className={styles.glyphCell}>
                <div className="title-display" style={{ fontSize: 48, color: "var(--accent)", lineHeight: 1 }}>
                  {r.glyph}
                </div>
                <div className="caption" style={{ marginTop: 8 }}>
                  {r.label}
                </div>
              </div>
            ))}
          </div>
        </Sample>
      </Section>

      <Section
        title="DOWNLOADS"
        note="Every lockup below is generated from the same path data these components use, so the files and the code cannot drift apart."
      >
        <Grid min={200}>
          {[
            ["Wordmark", "/assets/logo/wordmark.svg"],
            ["Horizontal lockup", "/assets/logo/lockup-horizontal.svg"],
            ["Stacked lockup", "/assets/logo/lockup-stacked.svg"],
            ["Tagline lockup", "/assets/logo/tagline-lockup.svg"],
            ["Stamp", "/assets/logo/stamp.svg"],
            ["Mark · amber", "/assets/logo/logomark-amber.svg"],
            ["App icon · ink", "/assets/logo/app-icon-ink-512.png"],
            ["Favicon", "/assets/favicon/favicon.ico"],
          ].map(([label, href]) => (
            <a key={href} href={href} download className={styles.download}>
              <span className="body-sm" style={{ color: "var(--fg)" }}>
                {label}
              </span>
              <span className="mono" style={{ fontSize: 9 }}>
                {href.split(".").pop()?.toUpperCase()}
              </span>
            </a>
          ))}
        </Grid>
      </Section>
    </PlaybookPage>
  );
}
