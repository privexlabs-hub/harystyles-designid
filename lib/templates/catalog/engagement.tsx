/**
 * Engagement · 1080×1080 — the posts that ask something of the reader.
 *
 * Where the square set states things, this set opens a door: it argues, it
 * compares, it asks a question and then waits. The default copy is real brand
 * copy — a writer edits these rather than writing from nothing — so it has to
 * sound like harystyles: letters not posts, patrons not subscribers, no
 * shouting and nothing sold.
 */
import { SIZES } from "../sizes";
import {
  COMPARISON_KIT,
  CTA_KIT,
  HEADLINE_KIT,
  LIST_KIT,
  QUESTION_KIT,
  QUOTE_KIT,
  SPLIT_KIT,
  SPOTLIGHT_KIT,
  STAT_KIT,
  STEPS_KIT,
  template,
  type Kit,
} from "../define";
import type { FieldValues } from "../types";

const square = (
  id: string,
  name: string,
  blurb: string,
  kit: Kit,
  defaults: FieldValues,
  variantDefaults?: Parameters<typeof template>[1]["variantDefaults"],
) =>
  template(
    "engagement",
    { id: `engagement/${id}`, name, blurb, sizes: [SIZES.square], variantDefaults },
    { ...kit, defaults },
  );

export const ENGAGEMENT_TEMPLATES = [
  square("why-us", "Why us · founder story", "Why the thing exists, from the person who built it.", SPOTLIGHT_KIT, {
    eyebrow: "Why we built it",
    title: "I missed being finished.",
    body: "I used to read until the page ran out. Then the page stopped running out. harystyles gives you five letters and then the evening back.",
    evidenceLabel: "Written by",
    evidence: "Hary, who founded it",
    footLeft: "harystyles.com",
    footRight: "❦",
  }, { background: "grain" }),

  square("founder-story", "Founder / team story", "The origin, told plainly.", SPOTLIGHT_KIT, {
    eyebrow: "How it began",
    title: "A notebook, and a bad year.",
    body: "The first letters were written to one person who never read them. The shape stayed: something long, sent to someone, kept or not kept.",
    evidenceLabel: "Since",
    evidence: "A wet March, 2021",
    footLeft: "harystyles.com/about",
    footRight: "",
  }, { layout: 2, accent: "melancholy" }),

  square("manifesto", "Manifesto · what we believe", "The beliefs, listed and unhedged.", LIST_KIT, {
    eyebrow: "What we believe",
    headline: "Some things we hold to.",
    items: [
      "Writing is worth paying for",
      "An ending is a kindness",
      "A reader is not an audience",
      "Attention should be given, not taken",
      "The dark is worth naming",
    ],
    footLeft: "harystyles.com",
    footRight: "❦",
  }, { background: "rule" }),

  square("problem-solution", "Problem / solution split", "What is wrong, and what we did instead.", SPLIT_KIT, {
    eyebrow: "The trade",
    headline: "Endless, or finished.",
    leftLabel: "The problem",
    leftBody: "A feed that never ends cannot be read; it can only be scrolled until you feel worse.",
    rightLabel: "What we did",
    rightBody: "Five letters a night, chosen by a person. When they are done, the evening is yours.",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 1 }),

  square("before-after", "Before / after", "The evening, in two halves.", SPLIT_KIT, {
    eyebrow: "An evening",
    headline: "Before, and after.",
    leftLabel: "Before",
    leftBody: "Forty minutes of scrolling; nothing kept, nothing finished, and no memory of any of it.",
    rightLabel: "After",
    rightBody: "Two letters read to the end, one line kept to the shelf, the lamp out by eleven.",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 2, accent: "still" }),

  square("did-you-know", "Did you know · educational", "One fact, told slowly.", SPOTLIGHT_KIT, {
    eyebrow: "Did you know",
    title: "Patron once meant protector.",
    body: "From the Latin patronus — one who stands over. A patron here is not buying a thing; they are standing over a writer's next year.",
    evidenceLabel: "From",
    evidence: "Latin, patronus",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 3 }),

  square("how-it-works", "How it works", "The whole thing, in four steps.", STEPS_KIT, {
    eyebrow: "How it works",
    headline: "From dusk to the shelf.",
    steps: [
      "The lamp is lit :: At sunset where you are, five letters arrive.",
      "You read :: No counts, no reactions shown to anyone else.",
      "You keep a line :: Highlight a sentence; it goes to your shelf, privately.",
      "You become a patron :: $4 a month to one writer. 90% of it is theirs.",
    ],
    footLeft: "harystyles.com",
    footRight: "",
  }, { background: "lamp" }),

  square("use-case", "Use case · examples", "Who this is for, said specifically.", LIST_KIT, {
    eyebrow: "Who reads here",
    headline: "People who are up late.",
    items: [
      "A nurse, between two night shifts",
      "Someone learning a city alone",
      "A father reading before the house wakes",
      "Anyone who left something behind",
    ],
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 1 }),

  square("testimonial", "Customer testimonial · proof", "A reader, at length.", QUOTE_KIT, {
    quote: "I stopped reading at night years ago. I read here every evening now, and I could not tell you what changed except that it ends.",
    attribution: "Marged O.",
    detail: "patron of Ines Marlowe",
    hue: 210,
    footLeft: "harystyles.com",
    footRight: "❦",
  }, { layout: 1, background: "grain" }),

  square("social-proof", "Social proof", "The number of people already here.", STAT_KIT, {
    eyebrow: "Tonight",
    figure: "8,140",
    label: "readers with the lamp lit",
    body: "In 61 countries, mostly after dark. None of them are counted anywhere a writer can see.",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 3 }),

  square("faq", "FAQ", "The question people actually ask.", QUESTION_KIT, {
    eyebrow: "Asked often",
    question: "Do I have to pay to read?",
    options: ["No. Reading is free, always."],
    prompt: "Patronage is for when a letter stays with you and you want the writer to keep going. $4 a month; 90% of it is theirs.",
    footLeft: "harystyles.com/questions",
    footRight: "",
  }, { layout: 3 }),

  square("myth-vs-fact", "Myth vs fact", "What people assume, and what is true.", SPLIT_KIT, {
    eyebrow: "Set straight",
    headline: "Slow is not small.",
    leftLabel: "The myth",
    leftBody: "That long writing has no readers left, and that anything unhurried goes unread.",
    rightLabel: "The fact",
    rightBody: "94% of letters here are finished. The average one is nine minutes long.",
    footLeft: "harystyles.com",
    footRight: "",
  }, { background: "rule", accent: "wine" }),

  square("tips", "Tips / checklist", "Small practical help, kindly given.", LIST_KIT, {
    eyebrow: "For writers",
    headline: "Before you send a letter.",
    items: [
      "Read the first line aloud",
      "Cut the paragraph explaining the paragraph",
      "Name the place; name the season",
      "Let the last line be short",
      "Send it before you think better of it",
    ],
    footLeft: "harystyles.com/writing",
    footRight: "❦",
  }, { layout: 2 }),

  square("comparison", "Comparison · vs alternatives", "What we left out, next to what they left in.", COMPARISON_KIT, {
    eyebrow: "The difference",
    headline: "Held back on purpose.",
    theirsLabel: "Elsewhere",
    oursLabel: "Here",
    points: [
      "Five letters, then an ending",
      "Reactions kept private",
      "90% to the writer",
      "No follower counts",
      "Nothing recommended by a machine",
    ],
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 1 }),

  square("hot-take", "Opinion / hot take", "A position, held quietly.", HEADLINE_KIT, {
    eyebrow: "An opinion",
    headline: "Engagement is|the wrong word.",
    body: "It describes what a machine wants from you, not what a piece of writing does to you at eleven at night.",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 3, accent: "burning" }),

  square("question", "Question / conversation starter", "An open question, left open.", QUESTION_KIT, {
    eyebrow: "A question",
    question: "What was the last thing you read to the end?",
    options: [],
    prompt: "Not skimmed; finished. We are asking because we cannot remember ours either.",
    footLeft: "harystyles.com",
    footRight: "❦",
  }, { layout: 1, background: "lamp" }),

  square("poll", "Poll / vote", "Four answers; pick the honest one.", QUESTION_KIT, {
    eyebrow: "Tell us",
    question: "When do you read best?",
    options: ["Before anyone is awake", "On the way somewhere", "The hour before sleep", "Only when it rains"],
    prompt: "We ask because the lamp lights at dusk, and dusk is not everyone's hour.",
    footLeft: "harystyles.com",
    footRight: "",
  }),

  square("community-spotlight", "Community spotlight", "One writer, named and quoted.", QUOTE_KIT, {
    quote: "I wrote thirty-four letters in a year and none of them were for an algorithm. Somebody paid for all of them anyway.",
    attribution: "Ines Marlowe",
    detail: "writer · 412 patrons",
    hue: 285,
    footLeft: "harystyles.com/ines",
    footRight: "",
  }, { layout: 2 }),

  square("cta-sign-up", "CTA · sign up", "The ask, at dusk.", CTA_KIT, {
    eyebrow: "The lamp is lit",
    headline: "Five letters, tonight.",
    body: "Free to read, always. Become a patron only when one of them stays with you.",
    button: "Begin reading",
    url: "harystyles.com",
    lit: true,
  }, { background: "lamp" }),

  square("cta-learn-more", "CTA · learn more", "The quieter ask.", CTA_KIT, {
    eyebrow: "If you'd rather read first",
    headline: "How patronage works.",
    body: "Where the money goes, what a writer keeps, and why we never show them a follower count.",
    button: "Read how it works",
    url: "harystyles.com/patronage",
    lit: false,
  }, { layout: 3, background: "rule" }),
];
