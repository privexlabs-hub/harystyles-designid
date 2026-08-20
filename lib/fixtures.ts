/**
 * The sample content the design system documents itself with.
 *
 * One set, shared by every screen. The source had two divergent copies — the
 * mobile screens said "Daniyar Khan" and "Marisol Cruz", the web reader said
 * "Daniyar Ahn" and "Marisol Ortiz". The mobile spellings win, because PIECES
 * was the exported fixture and the web copy was the drift.
 */

export type Mood = "tender" | "restless" | "melancholy" | "still" | "burning" | "untethered";

export type Piece = {
  id: string;
  title: string;
  author: string;
  /** Drives the author's avatar colour. Stable per writer. */
  hue: number;
  date: string;
  readTime: number;
  mood: Uppercase<Mood>;
  excerpt: string;
  hearts: number;
  premium: boolean;
};

export const PIECES: Piece[] = [
  {
    id: "p1",
    title: "On the small grief of leaving a city",
    author: "Ines Marlowe",
    hue: 25,
    date: "March 14",
    readTime: 7,
    mood: "MELANCHOLY",
    excerpt:
      "I packed the kettle last. It seemed important — the last warm thing in the apartment that had ever held me.",
    hearts: 412,
    premium: false,
  },
  {
    id: "p2",
    title: "A letter to the version of me who stayed",
    author: "Tomás Vega",
    hue: 280,
    date: "March 12",
    readTime: 12,
    mood: "TENDER",
    excerpt:
      "You are not weaker for having stayed. Some people leave to find themselves; some find themselves by refusing to.",
    hearts: 1208,
    premium: true,
  },
  {
    id: "p3",
    title: "Notes from a sleepless April",
    author: "Saoirse Linn",
    hue: 200,
    date: "March 10",
    readTime: 5,
    mood: "RESTLESS",
    excerpt: "The 4 a.m. honesty is dangerous because it is real. I write it down anyway.",
    hearts: 893,
    premium: false,
  },
  {
    id: "p4",
    title: "What the river kept",
    author: "Daniyar Khan",
    hue: 160,
    date: "March 8",
    readTime: 9,
    mood: "STILL",
    excerpt: "My grandmother told me the river forgets nothing. I did not understand her then.",
    hearts: 2104,
    premium: true,
  },
  {
    id: "p5",
    title: "Loving someone who is leaving",
    author: "Marisol Cruz",
    hue: 10,
    date: "March 6",
    readTime: 6,
    mood: "BURNING",
    excerpt:
      "There is a tenderness in the way we hold things we are losing. I learn it again every spring.",
    hearts: 1567,
    premium: false,
  },
];

export type MoodDef = { id: Mood; label: string; color: string; descriptor: string };

/** The six moods are fixed. Discovery is by feeling, never by topic tag. */
export const MOODS: MoodDef[] = [
  { id: "tender", label: "Tender", color: "var(--mood-tender)", descriptor: "soft, ached, gentle" },
  { id: "restless", label: "Restless", color: "var(--mood-restless)", descriptor: "the kind that won't sit" },
  { id: "melancholy", label: "Melancholy", color: "var(--mood-melancholy)", descriptor: "blue, low-lit, beautiful" },
  { id: "still", label: "Still", color: "var(--mood-still)", descriptor: "quiet, even, observed" },
  { id: "burning", label: "Burning", color: "var(--mood-burning)", descriptor: "alive, vivid, urgent" },
  { id: "untethered", label: "Untethered", color: "var(--mood-untethered)", descriptor: "drifting, unanchored, light" },
];

export const MOOD_BY_ID = Object.fromEntries(MOODS.map((m) => [m.id, m])) as Record<Mood, MoodDef>;

/**
 * The reaction glyphs, drawn from the display serif rather than an icon set.
 *
 * Each carries U+FE0E, the text-presentation selector. Without it the browser
 * hands ❦ ♡ ◐ to the colour emoji font and the marks arrive as pictures — which
 * is precisely what the brand says reactions must not be.
 */
const TEXT_PRESENTATION = "\uFE0E";

export const REACTIONS = [
  { glyph: "❦" + TEXT_PRESENTATION, label: "kept" },
  { glyph: "♡" + TEXT_PRESENTATION, label: "tender" },
  { glyph: "✦" + TEXT_PRESENTATION, label: "spark" },
  { glyph: "◐" + TEXT_PRESENTATION, label: "staying" },
  { glyph: "—", label: "held" },
] as const;
