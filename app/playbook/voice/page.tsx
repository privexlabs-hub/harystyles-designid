import type { Metadata } from "next";
import { Grid, PlaybookPage, Sample, Section } from "@/components/playbook/Page";
import styles from "./voice.module.css";

export const metadata: Metadata = {
  title: "Voice",
  description:
    "Messaging pillars, headline and CTA patterns, and the sentences we would and would not publish.",
};

/**
 * What the brand keeps saying, in four claims.
 *
 * A pillar is not a slogan — it is the thing a piece of copy is allowed to be
 * about. If a sentence does not serve one of these, it does not go out.
 */
const PILLARS = [
  {
    claim: "There is an end to it.",
    holds:
      "Five letters, then the lamp goes out. Everything we say about the product eventually comes back to the fact that it finishes.",
    proof: "Five letters a night. When you finish them, the app puts itself away.",
  },
  {
    claim: "The writer is a person, not a channel.",
    holds:
      "We name writers. We never call them creators, never aggregate them into a feed, never describe their readers as an audience.",
    proof: "412 patrons of Ines Marlowe. 90% goes to her.",
  },
  {
    claim: "What you keep is yours.",
    holds:
      "Reactions are private. The shelf is private. We say so plainly and often, because everyone has learned to assume the opposite.",
    proof: "Never shown to writers, never used to recommend things, never shared.",
  },
  {
    claim: "Slow is the feature.",
    holds:
      "Long sentences, quiet pauses, an evening rather than a session. We never apologise for asking someone to read.",
    proof: "It's the only place online I read slowly anymore.",
  },
];

/**
 * Headline shapes that recur. Not templates to fill in blindly — the point is
 * the *turn* each one makes, which is where this brand's headlines get their
 * character.
 */
const HEADLINE_PATTERNS = [
  {
    shape: "The refusal",
    note: "Name the thing everyone else does, then decline it. The whole brand in six words.",
    examples: ["Letters, not posts.", "No infinite feed. No algorithm. No likes."],
  },
  {
    shape: "The plain count",
    note: "A number and a time. No adjective, because the number is already the argument.",
    examples: ["Five letters, every evening.", "10,000 letters written here."],
  },
  {
    shape: "The turn into italic",
    note: "A flat first line, then the accent clause that carries the feeling. In the editor this is the | in a headline field.",
    examples: ["The lamp, the letter, the quiet voice.", "You came home a little tender."],
  },
  {
    shape: "The admission",
    note: "Say the sad or awkward thing first. It earns the sentence that follows.",
    examples: ["That's all for tonight.", "It is 2am and you are fine."],
  },
];

/**
 * Sentence-level rewrites. The word lists on the brand page cover vocabulary;
 * these cover the harder problem, which is register.
 */
const REWRITES = [
  {
    flat: "Unlock exclusive content and join our community of creators today!",
    ours: "Become a patron of one writer. Read every letter she writes, including the ones too tender for the open feed.",
    why: "No unlocking, no exclusivity, no community. One writer, named, and what you actually get.",
  },
  {
    flat: "You have 5 unread items in your feed.",
    ours: "The lamp is lit. Five letters, hand-picked for the mood you arrived in.",
    why: "An inbox count is a debt. The same fact, said as an invitation.",
  },
  {
    flat: "Trending now — see what everyone's reading",
    ours: "Read by feeling. Tender, restless, melancholy, still, burning, untethered.",
    why: "Popularity is not a reason to read something. The mood is.",
  },
  {
    flat: "Oops! Something went wrong. Please try again later.",
    ours: "That letter would not open. It is not gone — try once more, or come back at sunset.",
    why: "No 'oops'. Say what failed, say the thing is safe, and offer the next move.",
  },
  {
    flat: "Upgrade to Premium to support your favourite creators",
    ours: "$4 a month, to one writer, for as long as you like. Cancel any time.",
    why: "Patronage is not a tier. The price, the person and the exit, in one line.",
  },
];

/** Calls to action, as the brand writes them. */
const CTAS_GOOD = [
  "Begin reading tonight",
  "Become a patron · $4/mo",
  "Write a letter",
  "Keep this line",
  "Read for melancholy",
  "Find a writer",
];

const CTAS_BAD = [
  "Get started now",
  "Unlock full access",
  "Join the community",
  "Sign up free →",
  "Don't miss out",
  "Learn more",
];

/** The small print, where a quiet brand usually breaks character. */
const MICROCOPY = [
  {
    moment: "Nothing here yet",
    say: "That's all for tonight. The lamp will be lit again at sunset.",
    dont: "No results found.",
  },
  {
    moment: "Still loading",
    say: "Lighting the lamp…",
    dont: "Loading, please wait…",
  },
  {
    moment: "It failed",
    say: "That would not send. Your letter is still here — nothing was lost.",
    dont: "Error: request failed. Try again.",
  },
  {
    moment: "Are you sure",
    say: "Discard this draft? It is not recoverable.",
    dont: "Warning! This action cannot be undone!!",
  },
  {
    moment: "It worked",
    say: "Kept. The line is on your shelf.",
    dont: "Success! Item saved to your collection.",
  },
  {
    moment: "A field is wrong",
    say: "That address is missing an @ — we cannot send to it yet.",
    dont: "Invalid input.",
  },
];

export default function VoicePage() {
  return (
    <PlaybookPage
      href="/playbook/voice"
      eyebrow="02 · VOICE"
      title={
        <>
          Say less, and{" "}
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            mean it more.
          </span>
        </>
      }
      lede="The brand page lists the words we use. This page is about the harder part — the register underneath them. Everything here is a rule you could hand to someone who had never seen the product and still get a sentence that sounds like us."
    >
      <Section
        title="MESSAGING PILLARS"
        note="Four claims the copy is allowed to be about. A sentence that serves none of them is a sentence about something else."
      >
        <Grid min={400}>
          {PILLARS.map((p) => (
            <div key={p.claim} className={styles.pillar}>
              <div className="title-md">{p.claim}</div>
              <p className={`body-sm ${styles.pillarLine}`}>{p.holds}</p>
              <p className="body-reading" style={{ fontSize: 16, margin: 0, color: "var(--fg)" }}>
                “{p.proof}”
              </p>
            </div>
          ))}
        </Grid>
      </Section>

      <Section
        title="HEADLINE PATTERNS"
        note="Not fill-in-the-blank formulas. Each one names the turn the sentence makes, which is where the character comes from."
      >
        <Grid min={420}>
          {HEADLINE_PATTERNS.map((p) => (
            <div key={p.shape} className={styles.pattern}>
              <span className={styles.patternShape}>{p.shape}</span>
              {p.examples.map((e) => (
                <p key={e} className={`title-sm ${styles.example}`}>
                  {e}
                </p>
              ))}
              <p className="body-sm" style={{ margin: 0 }}>
                {p.note}
              </p>
            </div>
          ))}
        </Grid>
      </Section>

      <Section
        title="THE SAME SENTENCE, TWICE"
        note="Vocabulary is the easy half. These are rewrites of copy that uses none of the banned words and is still wrong."
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
          {REWRITES.map((r) => (
            <div key={r.flat} className={styles.rewrite}>
              <div className={styles.rewriteHalf}>
                <span className="mono" style={{ fontSize: 10, color: "var(--alarm)" }}>
                  NOT THIS
                </span>
                <p className={`body-reading ${styles.struck}`} style={{ fontSize: 16, margin: 0 }}>
                  {r.flat}
                </p>
              </div>
              <div className={styles.rewriteHalf}>
                <span className="mono" style={{ fontSize: 10, color: "var(--ok)" }}>
                  THIS
                </span>
                <p className="body-reading" style={{ fontSize: 16, margin: 0, color: "var(--fg)" }}>
                  {r.ours}
                </p>
                <p className="caption" style={{ margin: 0 }}>
                  {r.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="CALLS TO ACTION"
        note="A button says what happens next, in the reader's terms. It never says how urgent it is, and it never says 'now'."
      >
        <Grid min={320}>
          <Sample label="WE SAY">
            <div className={styles.cta}>
              {CTAS_GOOD.map((c) => (
                <span key={c} className={styles.ctaChip}>
                  {c}
                </span>
              ))}
            </div>
          </Sample>
          <Sample label="WE DON'T">
            <div className={styles.cta}>
              {CTAS_BAD.map((c) => (
                <span key={c} className={styles.ctaChipBad}>
                  {c}
                </span>
              ))}
            </div>
          </Sample>
        </Grid>
      </Section>

      <Section
        title="MICROCOPY"
        note="Empty states, errors and confirmations are where a quiet brand usually breaks character — the copy gets written last, by whoever is closest, in whatever voice is going."
      >
        <Sample>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.microcopy}>
              <thead>
                <tr>
                  <th scope="col">Moment</th>
                  <th scope="col">We say</th>
                  <th scope="col">Not</th>
                </tr>
              </thead>
              <tbody>
                {MICROCOPY.map((m) => (
                  <tr key={m.moment}>
                    <td>{m.moment}</td>
                    <td style={{ color: "var(--fg)" }}>{m.say}</td>
                    <td className={styles.struck}>{m.dont}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sample>
      </Section>

      <Section
        title="WRITING PRINCIPLES"
        note="When none of the above settles it."
      >
        <Grid min={300}>
          {[
            ["Name the thing", "Not 'a piece' — the title. Not 'a writer' — Ines. The specific noun is almost always the better one."],
            ["One idea per sentence", "If it needs a comma splice to hold together, it was two sentences."],
            ["Never say now", "No urgency, no countdown, no scarcity. The lamp goes out at midnight and that is the only deadline the brand has."],
            ["Let it be sad", "We can say a thing is hard, or over, or lost. Copy that is relentlessly upbeat reads as an advertisement, and this is not one."],
            ["Cut the adverb", "'Beautifully written' is a claim the reader makes, not us."],
            ["Read it aloud", "If you would not say it to one person, in a room, at night, it is not ready."],
          ].map(([title, body]) => (
            <Sample key={title}>
              <div className="title-md" style={{ marginBottom: 8 }}>
                {title}
              </div>
              <p className="body-sm" style={{ margin: 0 }}>
                {body}
              </p>
            </Sample>
          ))}
        </Grid>
      </Section>
    </PlaybookPage>
  );
}
