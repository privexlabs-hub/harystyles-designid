import type { Metadata } from "next";
import { BrandKitButton } from "@/components/playbook/BrandKitButton";
import { ClearSpace } from "@/components/playbook/ClearSpace";
import { MinimumSize } from "@/components/playbook/MinimumSize";
import { Misuse } from "@/components/playbook/Misuse";
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

const FUNDAMENTALS = [
  {
    t: "What it is",
    d: "harystyles is a place for emotional long-form writing. One writer, one letter, one reader at a time. The product is a shelf, a lamp, and a way to pay the person who wrote the thing you stayed up finishing.",
  },
  {
    t: "Who it is for",
    d: "People who write about the parts of their life they have not finished thinking about, and people who would rather read one long letter a week than forty short ones a day. Patrons, not an audience.",
  },
  {
    t: "What it refuses",
    d: "No streaks, no follower counts, no algorithmic feed, no infinite scroll. We do not rank writers against each other and we do not tell anyone their letter is underperforming. Nothing here is designed to be checked.",
  },
  {
    t: "What it values",
    d: "Slowness, plain payment, and the writer's own words. A feature earns its place by making the reading or the writing better — not by making either more frequent.",
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

      <Section
        title="FUNDAMENTALS"
        note="What the brand is, before it is a logo. Everything on this page should be readable back against these four cards — if a lockup, a colour, or a sentence contradicts one of them, the lockup is wrong."
      >
        <Grid min={400}>
          {FUNDAMENTALS.map((c) => (
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

      <Section
        title="LOCKUPS · EVERY VARIATION"
        note="Horizontal is the default and covers most of the product. Stacked is for square and narrow spaces — app store cards, a centred sign-in. The mark alone is for favicons, avatars, and anywhere the name is already on the page. The wordmark alone is for letterheads and footers where the mark would be a second voice. The stamp signs a finished letter. The tagline lockup is for covers and first-run screens only, never in the chrome. Monochrome is for embossing, single-colour print, and any surface that cannot hold the amber. Inverted is the same artwork on a light field."
      >
        <Grid min={220}>
          <Sample label="HORIZONTAL · DEFAULT">
            <div className={styles.lockupStage}>
              <div className={styles.lockup}>
                <HSLogomark size={44} />
                <HSWordmark size={38} />
              </div>
            </div>
          </Sample>

          <Sample label="STACKED">
            <div className={styles.lockupStage}>
              <div className={styles.stackedLockup}>
                <HSLogomark size={40} />
                <HSWordmark size={28} />
              </div>
            </div>
          </Sample>

          <Sample label="MARK ALONE">
            <div className={styles.lockupStage}>
              <HSLogomark size={48} />
            </div>
          </Sample>

          <Sample label="WORDMARK ALONE">
            <div className={styles.lockupStage}>
              <HSWordmark size={34} />
            </div>
          </Sample>

          <Sample label="STAMP">
            <div className={styles.lockupStage}>
              <div className={styles.stamp}>
                <HSLogomark size={32} />
              </div>
            </div>
          </Sample>

          <Sample label="TAGLINE LOCKUP">
            <div className={styles.lockupStage}>
              <div className={styles.taglineStack}>
                <HSWordmark size={26} />
                <div className={`mono ${styles.tagline}`}>LETTERS, NOT POSTS</div>
              </div>
            </div>
          </Sample>

          <Sample label="MONOCHROME · NO ACCENT">
            <div className={styles.lockupStage}>
              <div className={styles.lockup}>
                <HSLogomark size={44} color="var(--fg-strong)" hole="var(--bg-card)" />
                <HSWordmark size={38} color="var(--fg-strong)" accent="var(--fg-strong)" />
              </div>
            </div>
          </Sample>

          <Sample label="INVERTED · LIGHT SURFACE">
            <div className={`${styles.lockupStage} ${styles.lockupStageInverted}`}>
              <div className={styles.lockup}>
                <HSLogomark size={44} color="var(--ink-1000)" hole="var(--ink-100)" />
                <HSWordmark size={38} color="var(--ink-1000)" accent="var(--amber-600)" />
              </div>
            </div>
          </Sample>
        </Grid>
      </Section>

      <Section
        title="CLEAR SPACE"
        note="One measure, x, taken from the height of the mark's stem — half the height of the mark itself. Keep x clear on all four sides of whatever is drawn inside the amber rule. Nothing crosses it: no type, no image edge, no button, no other logo. The dashed outer rule below is the boundary; it is a drawing aid and never ships."
      >
        <Grid min={280}>
          <Sample>
            <ClearSpace
              unit={24}
              label="MARK · 48PX"
              caption="At 48px the stem is 24px tall, so 24px stays clear on every side."
            >
              <HSLogomark size={48} />
            </ClearSpace>
          </Sample>

          <Sample>
            <ClearSpace
              unit={22}
              label="HORIZONTAL LOCKUP · 44PX MARK"
              caption="The measure comes from the mark, not the lockup — a 44px mark gives a 22px stem, so 22px stays clear around the whole lockup."
            >
              <HSLogomark size={44} />
              <HSWordmark size={38} />
            </ClearSpace>
          </Sample>
        </Grid>
      </Section>

      <Section
        title="MINIMUM SIZE"
        note="The mark stops at 20px. The wordmark stops at 90px wide. Below those the flame closes up into a blob and the accent full stop thins to a single pixel — the two details that carry the whole brand are the first two to go. Each rung below is drawn at its real size first, then repeated magnified, so the failure is visible rather than asserted."
      >
        <Grid min={220}>
          <MinimumSize
            measure="MARK · 20PX"
            verdict="floor"
            note="The flame still reads as a flame and the notch inside it still holds open."
            zoom={4}
          >
            <HSLogomark size={20} />
          </MinimumSize>

          <MinimumSize
            measure="MARK · 12PX"
            verdict="below"
            note="The notch has closed and the flame is a dot sitting above a hook."
            zoom={4}
          >
            <HSLogomark size={12} />
          </MinimumSize>

          <MinimumSize
            measure="WORDMARK · 90PX WIDE"
            verdict="floor"
            note="The full stop is still amber and still separate from the s before it."
            zoom={2}
          >
            <HSWordmark size={25} />
          </MinimumSize>

          <MinimumSize
            measure="WORDMARK · 58PX WIDE"
            verdict="below"
            note="The full stop is down to a single pixel at real size, and the joins in the y and the s begin to fill in."
            zoom={2}
          >
            <HSWordmark size={16} />
          </MinimumSize>
        </Grid>
      </Section>

      <Section
        title="MISUSE"
        note="Six things that have already happened to other marks. Each tile below is the mistake itself, rendered, not a description of it. If a deck, a partner asset, or a slide looks like one of these, it is wrong and there is a correct lockup above to replace it with."
      >
        <Grid min={220}>
          <Misuse
            distortion="stretch"
            title="STRETCHED"
            reason="Scaled non-uniformly. The stem thins, the flame flattens, and the serif loses its weight axis. Scale both dimensions together or not at all."
          >
            <HSLogomark size={32} />
            <HSWordmark size={24} />
          </Misuse>

          <Misuse
            distortion="recolour"
            title="OFF-PALETTE HUE"
            reason="Recoloured to a cold teal that belongs to nothing in the system. The mark is amber, monochrome, or inverted — there is no third colourway."
          >
            <HSLogomark size={40} />
            <HSWordmark size={30} />
          </Misuse>

          <Misuse
            distortion="shadow"
            title="DROP SHADOW"
            reason="The mark is flat artwork on a flat surface. A shadow makes it an object floating above the page, and the shadow is cold black besides."
          >
            <HSLogomark size={40} />
            <HSWordmark size={30} />
          </Misuse>

          <Misuse
            distortion="rotate"
            title="ROTATED"
            reason="A candle stands upright. Tilted, the flame reads as falling and the lockup reads as a sticker."
          >
            <HSLogomark size={40} />
            <HSWordmark size={30} />
          </Misuse>

          <Misuse
            distortion="busy"
            title="BUSY FIELD"
            reason="Placed over pattern and low contrast, so nothing holds its edge. Give the mark a plain field, or set the whole lockup in monochrome over a scrim."
          >
            <HSLogomark size={40} hole="transparent" />
            <HSWordmark size={30} />
          </Misuse>

          <Misuse
            distortion="typeface"
            title="RETYPED WORDMARK"
            reason="Set in Arial with the accent full stop dropped. The wordmark is artwork, not a text field — never retype it, always place the file."
          >
            <span className={styles.wrongType}>harystyles</span>
          </Misuse>
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
        <BrandKitButton />
      </Section>
    </PlaybookPage>
  );
}
