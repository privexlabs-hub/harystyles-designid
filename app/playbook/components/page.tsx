import type { Metadata } from "next";
import { Grid, PlaybookPage, Sample, Section } from "@/components/playbook/Page";
import { InputsDemo } from "@/components/playbook/InputsDemo";
import { TabsDemo } from "@/components/playbook/TabsDemo";
import {
  ArticleCard,
  Avatar,
  Btn,
  EmptyState,
  FieldNote,
  Icon,
  MoodPill,
  Placeholder,
  Skeleton,
  TabBar,
} from "@/components/ui";
import { PIECES } from "@/lib/fixtures";
import styles from "./components.module.css";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Buttons, badges, inputs, cards, tabs, menus, toasts, modals and avatars — every piece in isolation.",
};

const SIZES = ["sm", "md", "lg"] as const;

const BADGES = [
  { l: "PATRON", c: "var(--wine-300)", bg: "var(--wine-900)", icon: <Icon.lock /> },
  { l: "MELANCHOLY", c: "var(--mood-melancholy)", bg: "color-mix(in oklch, var(--mood-melancholy) 18%, var(--bg-card))" },
  { l: "TENDER", c: "var(--mood-tender)", bg: "color-mix(in oklch, var(--mood-tender) 18%, var(--bg-card))" },
  { l: "RESTLESS", c: "var(--mood-restless)", bg: "color-mix(in oklch, var(--mood-restless) 18%, var(--bg-card))" },
  { l: "BURNING", c: "var(--mood-burning)", bg: "color-mix(in oklch, var(--mood-burning) 18%, var(--bg-card))" },
  { l: "NEW", c: "var(--accent)", bg: "var(--accent-soft)" },
];

const CHIPS = ["7 min", "essay", "patron-only", "march 2026"];

const MENU: [string, React.ReactNode][] = [
  ["Keep this line", <Icon.bookmark key="b" />],
  ["Highlight", <Icon.highlight key="h" />],
  ["Reply privately", <Icon.reply key="r" />],
  ["Save as image card", <Icon.share key="s" />],
];

const PILL_MOODS: Array<[string, string]> = [
  ["Tender", "var(--mood-tender)"],
  ["Restless", "var(--mood-restless)"],
  ["Melancholy", "var(--mood-melancholy)"],
  ["Still", "var(--mood-still)"],
];

const TONES = [
  { tone: "hint" as const, text: "Your letters are private until you send them." },
  { tone: "ok" as const, text: "Kept. This draft is on your shelf." },
  { tone: "caution" as const, text: "This letter has been open for an hour. It has not been kept yet." },
  { tone: "alarm" as const, text: "That address didn\u2019t take. Check it and try once more." },
];

export default function ComponentsPage() {
  return (
    <PlaybookPage
      href="/playbook/components"
      eyebrow="06 · COMPONENTS"
      title={
        <>
          The pieces,{" "}
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            in isolation.
          </span>
        </>
      }
      lede="Every control in the system, shown on its own so the tokens can be read off it. Nothing here is decorative — if a variant isn't in this catalogue, it doesn't exist."
    >
      <Section title="BUTTONS · 3 SIZES × 5 VARIANTS">
        <Sample>
          <div className={styles.btnStack}>
            {SIZES.map((s) => (
              <div key={s} className={styles.btnRow}>
                <div className="mono" style={{ fontSize: 9, width: 36 }}>{s.toUpperCase()}</div>
                <Btn size={s} variant="primary">Become a patron</Btn>
                <Btn size={s} variant="secondary">Read later</Btn>
                <Btn size={s} variant="outline">Follow</Btn>
                <Btn size={s} variant="ghost">Cancel</Btn>
                <Btn size={s} variant="premium" icon={<Icon.candle />}>Patron · $4/mo</Btn>
              </div>
            ))}
            <div className={styles.btnRow} style={{ marginTop: 8 }}>
              <div className="mono" style={{ fontSize: 9, width: 36 }}>ICN</div>
              <Btn size="md" variant="primary" icon={<Icon.feather />}>Write a letter</Btn>
              <Btn size="md" variant="secondary" iconRight={<Icon.arrowRight />}>Continue reading</Btn>
              <Btn size="md" variant="ghost" icon={<Icon.bookmark />}>Keep</Btn>
            </div>
          </div>
        </Sample>
      </Section>

      <Section title="BADGES + CHIPS">
        <Sample>
          <div className={styles.wrapRow}>
            {BADGES.map((b) => (
              <span key={b.l} className={styles.badge} style={{ background: b.bg, color: b.c }}>
                {b.icon}
                {b.l}
              </span>
            ))}
          </div>
          <div className={styles.wrapRow} style={{ marginTop: 16 }}>
            {CHIPS.map((t) => (
              <span key={t} className={styles.chip}>{t}</span>
            ))}
          </div>
        </Sample>
      </Section>

      <Section title="INPUTS">
        <Sample>
          <InputsDemo />
        </Sample>
      </Section>

      <Section title="CARDS">
        <Sample>
          <Grid min={240}>
            <div className={styles.card}>
              <div className="mono" style={{ fontSize: 9, marginBottom: 12 }}>LETTER · ESSAY</div>
              <div className="title-sm" style={{ marginBottom: 6 }}>On small grief</div>
              <p className="body-sm" style={{ margin: 0 }}>I packed the kettle last. It seemed important.</p>
            </div>
            <div
              className={styles.card}
              style={{ border: "1px solid var(--accent)", boxShadow: "var(--shadow-glow)" }}
            >
              <div className="mono" style={{ fontSize: 9, marginBottom: 12, color: "var(--accent)" }}>FEATURED · TONIGHT</div>
              <div className="title-sm" style={{ marginBottom: 6 }}>What the river kept</div>
              <p className="body-sm" style={{ margin: 0 }}>My grandmother told me the river forgets nothing.</p>
            </div>
            <div className={styles.card} style={{ borderLeft: "3px solid var(--mood-melancholy)" }}>
              <div className="mono" style={{ fontSize: 9, marginBottom: 12, color: "var(--mood-melancholy)" }}>NOTEBOOK · 8 LETTERS</div>
              <div className="title-sm" style={{ marginBottom: 6 }}>Letters from a leaving city</div>
              <p className="body-sm" style={{ margin: 0 }}>A series. Read in order, or any order.</p>
            </div>
          </Grid>
        </Sample>
      </Section>

      <Section title="TABS">
        <Sample>
          <TabsDemo />
        </Sample>
      </Section>

      <Section title="MENU">
        <Sample>
          <div className={styles.menu}>
            {MENU.map(([l, i]) => (
              <button key={l} type="button" className={styles.menuItem}>
                {i}
                {l}
              </button>
            ))}
            <div className={styles.menuRule} />
            <button
              type="button"
              className={styles.menuItem}
              style={{ color: "var(--mood-burning)" }}
            >
              Report this letter
            </button>
          </div>
        </Sample>
      </Section>

      <Section title="TOAST · NOTIFICATION">
        <Sample>
          <div className={styles.toastStack}>
            <div
              className={styles.toast}
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--accent)",
                boxShadow: "var(--shadow-md)",
                color: "var(--fg)",
              }}
            >
              <Icon.candle style={{ color: "var(--accent)", flexShrink: 0 }} />
              <span className="body-sm" style={{ color: "var(--fg)" }}>Kept. The line is on your shelf.</span>
            </div>
            <div
              className={styles.toast}
              style={{
                background: "var(--wine-900)",
                border: "1px solid var(--wine-500)",
                color: "var(--wine-100)",
              }}
            >
              <Icon.lock style={{ flexShrink: 0 }} />
              <span className="body-sm" style={{ color: "var(--wine-100)" }}>You&rsquo;re now a patron of Ines. Welcome.</span>
            </div>
            <div
              className={styles.toast}
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--fg-muted)",
              }}
            >
              <Icon.moon style={{ flexShrink: 0 }} />
              <span className="body-sm" style={{ color: "var(--fg)" }}>The lamp will be lit again at sunset.</span>
            </div>
          </div>
        </Sample>
      </Section>

      <Section title="MODAL · PATRONAGE PROMPT">
        <Sample>
          <div className={styles.modal}>
            <div className={styles.modalMark}>
              <Icon.candle />
            </div>
            <div className="title-md" style={{ textAlign: "center", marginBottom: 8 }}>Keep the lamp lit</div>
            <p className="body-sm" style={{ textAlign: "center", margin: 0, marginBottom: 20 }}>
              For Ines, and for the writers like her.
            </p>
            <Btn variant="primary" size="md" full>Become a patron · $4/mo</Btn>
          </div>
        </Sample>
      </Section>

      <Section
        title="LETTER CARD · MOOD PILLS · TAB BAR · PLACEHOLDER"
        note="Four pieces the catalogue had been shipping without ever showing. The letter card carries a heart count but no share count and no follower count; the tab bar carries five destinations and no notifications tab, because there is nothing to notify about."
      >
        <Grid min={280}>
          <Sample label="ARTICLECARD">
            <ArticleCard piece={PIECES[0]} />
          </Sample>

          <Sample label="MOODPILL">
            <div className={styles.wrapRow}>
              {PILL_MOODS.map(([label, color], i) => (
                <MoodPill key={label} label={label} color={color} selected={i === 0} />
              ))}
            </div>
            <div className={styles.wrapRow} style={{ marginTop: 16 }}>
              <MoodPill label="Burning" color="var(--mood-burning)" size="lg" selected />
              <MoodPill label="Untethered" color="var(--mood-untethered)" size="lg" />
            </div>
          </Sample>

          <Sample label="TABBAR · IN A SCREEN">
            <div className={styles.screen}>
              <div className={styles.screenBody}>
                <div className="mono" style={{ fontSize: 9 }}>TONIGHT</div>
                <div className="title-sm">What the river kept</div>
                <p className="body-sm" style={{ margin: 0 }}>
                  My grandmother told me the river forgets nothing.
                </p>
              </div>
              <TabBar active="home" />
            </div>
          </Sample>

          <Sample label="PLACEHOLDER">
            <Placeholder h={120} label="cover" />
            <div style={{ marginTop: 12 }}>
              <Placeholder h={64} label="portrait" />
            </div>
          </Sample>
        </Grid>
      </Section>

      <Section
        title="STATES · EMPTY, LOADING, ANNOTATED"
        note={`The brand's own empty state is "That's all for tonight." — an evening that has ended, not a failure to produce content. Loading is a slow pulse rather than a shimmer, and a field note keeps the same box whatever it has to say, so telling someone something went wrong never moves the page under them.`}
      >
        <Grid min={280}>
          <Sample label="EMPTYSTATE">
            <EmptyState
              title="That&rsquo;s all for tonight."
              body="The lamp will be lit again at sunset. Six new letters are already being written."
              action={<Btn size="sm" variant="ghost">Browse by mood</Btn>}
            />
          </Sample>

          <Sample label="SKELETON">
            <div className={styles.skeletonCard}>
              <div className={styles.skeletonRow}>
                <Skeleton width={20} height={20} radius="999px" />
                <Skeleton width="40%" height={10} />
              </div>
              <Skeleton width="85%" height={22} />
              <Skeleton height={12} />
              <Skeleton width="60%" height={12} />
            </div>
          </Sample>

          <Sample label="FIELDNOTE · FOUR TONES">
            <div className={styles.noteStack}>
              {TONES.map((t) => (
                <FieldNote key={t.tone} tone={t.tone}>
                  <span className="mono" style={{ fontSize: 9, color: "inherit" }}>
                    {t.tone.toUpperCase()}
                  </span>{" "}
                  {t.text}
                </FieldNote>
              ))}
            </div>
          </Sample>

          <Sample label="THE SAME FIELD, TWICE">
            <div className={styles.field}>
              <label className="mono" htmlFor="pb-note-hint" style={{ fontSize: 9 }}>
                WHERE TO SEND IT
              </label>
              <input
                id="pb-note-hint"
                className={styles.fieldInput}
                type="email"
                defaultValue="ines@"
                readOnly
                aria-describedby="pb-note-hint-note"
              />
              <FieldNote id="pb-note-hint-note" tone="hint">
                We send one letter a week. Nothing else, ever.
              </FieldNote>
            </div>
            <div className={styles.field} style={{ marginTop: 20 }}>
              <label className="mono" htmlFor="pb-note-alarm" style={{ fontSize: 9 }}>
                WHERE TO SEND IT
              </label>
              <input
                id="pb-note-alarm"
                className={`${styles.fieldInput} ${styles.fieldInputAlarm}`}
                type="email"
                defaultValue="ines@"
                readOnly
                aria-describedby="pb-note-alarm-note"
              />
              <FieldNote id="pb-note-alarm-note" tone="alarm">
                That address didn&rsquo;t take. Check it and try once more.
              </FieldNote>
            </div>
          </Sample>
        </Grid>
      </Section>

      <Section title="AVATARS">
        <Sample>
          <div className={styles.avatarRow}>
            <Avatar name="Ines" hue={25} size={32} />
            <Avatar name="Tomás" hue={280} size={40} />
            <Avatar name="Saoirse" hue={200} size={56} />
            <Avatar name="Daniyar" hue={160} size={72} />
            <Avatar name="Marisol" hue={10} size={88} ring />
          </div>
        </Sample>
      </Section>
    </PlaybookPage>
  );
}
