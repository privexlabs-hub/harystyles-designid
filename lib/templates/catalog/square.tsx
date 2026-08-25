/**
 * Square · 1080×1080 — the everyday feed post.
 *
 * Twenty shapes covering what the brand actually posts. The default copy is
 * real brand copy, not lorem: these are the examples a writer edits from, so
 * they have to sound like harystyles — letters not posts, patrons not
 * subscribers, no "unlock", no "join the community".
 */
import { SIZES } from "../sizes";
import {
  COMPARISON_KIT,
  GRID_KIT,
  PHOTO_KIT,
  TIMELINE_KIT,
  CTA_KIT,
  EVENT_KIT,
  HEADLINE_KIT,
  LIST_KIT,
  QUOTE_KIT,
  SPLIT_KIT,
  SPOTLIGHT_KIT,
  STAT_KIT,
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
    "square",
    { id: `square/${id}`, name, blurb, sizes: [SIZES.square], variantDefaults },
    { ...kit, defaults },
  );

export const SQUARE_TEMPLATES = [
  square("normal-post", "Normal post", "The everyday letter-shaped post.", HEADLINE_KIT, {
    eyebrow: "Tonight",
    headline: "Five letters,|every evening.",
    body: "Hand-picked for the mood you arrived in. No infinite feed, no algorithm, no likes.",
    footLeft: "harystyles.com",
    footRight: "Letters, not posts",
  }),

  square("feature-announcement", "Feature announcement", "Something new, said quietly.", HEADLINE_KIT, {
    eyebrow: "New",
    headline: "Notebooks.|Read a series in order.",
    body: "A writer can now gather letters into a notebook, so a reader can follow the thread from the first one.",
    footLeft: "harystyles.com",
    footRight: "New this week",
  }),

  square("product-update", "Product update", "A smaller change, worth saying.", HEADLINE_KIT, {
    eyebrow: "Update",
    headline: "The lamp now follows|your own sunset.",
    body: "Tonight's five arrive when it gets dark where you are, not where our servers are.",
    footLeft: "harystyles.com",
    footRight: "",
  }, { background: "lamp" }),

  square("customer-quote", "Customer quote", "A reader, in their own words.", QUOTE_KIT, {
    quote: "It's the only place online I read slowly anymore.",
    attribution: "Saoirse L.",
    detail: "reader · 2 years",
    hue: 200,
    footLeft: "harystyles.com",
    footRight: "",
  }),

  square("customer-testimonial", "Customer testimonial", "A longer piece of praise, with a face.", QUOTE_KIT, {
    quote: "I became a patron of one writer. Now I look forward to the evening in a way I had rather stopped doing.",
    attribution: "Tomás V.",
    detail: "patron of Ines Marlowe",
    hue: 280,
    footLeft: "harystyles.com",
    footRight: "❦",
  }, { layout: 1 }),

  square("big-stat", "Big stat card", "One number, given room.", STAT_KIT, {
    eyebrow: "This month",
    figure: "1,204",
    label: "lines kept by readers",
    body: "Every one of them private. Never shown to writers, never used to recommend anything.",
    footLeft: "harystyles.com",
    footRight: "❦",
  }),

  square("data-insight", "Data / insight", "A number with an argument behind it.", STAT_KIT, {
    eyebrow: "What we noticed",
    figure: "94%",
    label: "of letters are finished",
    body: "When there are only five, people read to the end. Turns out the scarcity was the feature.",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 2 }),

  square("launch-milestone", "Launch / milestone", "A moment worth marking.", STAT_KIT, {
    eyebrow: "A year of letters",
    figure: "10,000",
    label: "letters written here",
    body: "Written by 412 people, mostly at night, mostly about leaving. Thank you for every one of them.",
    footLeft: "harystyles.com",
    footRight: "❦",
  }, { background: "lamp", layout: 1 }),

  square("event-announcement", "Event announcement", "Something happening, at a time.", EVENT_KIT, {
    eyebrow: "An evening of letters",
    title: "Reading aloud, together.",
    date: "March 28",
    detail: "20:00 GMT · online · free",
    body: "Six writers read the letter they were most afraid to publish. Come and listen.",
    footLeft: "harystyles.com/events",
    footRight: "",
  }),

  square("hot-take", "Industry hot take", "An opinion, held quietly but held.", HEADLINE_KIT, {
    eyebrow: "An opinion",
    headline: "The feed was never|the problem.",
    body: "The problem was that it never ended. A thing that never ends cannot be finished, and a thing that cannot be finished cannot be enjoyed.",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 3 }),

  square("did-you-know", "Educational / did you know", "One fact, well told.", SPOTLIGHT_KIT, {
    eyebrow: "Did you know",
    title: "The word 'essay' means an attempt.",
    body: "Montaigne called them essais because he was trying something out, not settling it. Every letter here is an attempt at something.",
    evidenceLabel: "From",
    evidence: "Essais, 1580",
    footLeft: "harystyles.com",
    footRight: "",
  }),

  square("blog-promo", "Blog promo", "Pointing at something longer.", SPOTLIGHT_KIT, {
    eyebrow: "New letter",
    title: "On the small grief of leaving a city",
    body: "I packed the kettle last. It seemed important — the last warm thing in the apartment that had ever held me.",
    evidenceLabel: "By",
    evidence: "Ines Marlowe · 7 min",
    footLeft: "harystyles.com/ines",
    footRight: "",
  }),

  square("case-study", "Case study", "What happened when someone used it.", SPOTLIGHT_KIT, {
    eyebrow: "A writer's year",
    title: "Ines went from 0 to 412 patrons.",
    body: "No launch, no list, no funnel. Thirty-four letters, one a week, written at night and posted before she could think better of it.",
    evidenceLabel: "Her share",
    evidence: "$1,648 / month",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 2 }),

  square("feature-spotlight", "Product / feature spotlight", "One feature, up close.", SPOTLIGHT_KIT, {
    eyebrow: "How it works",
    title: "Keep a line.",
    body: "Highlight a sentence and it goes to your shelf. Private, permanently — never shown to the writer, never used to recommend anything.",
    evidenceLabel: "So far",
    evidence: "1,204 lines kept",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 1 }),

  square("comparison", "Comparison / vs alternatives", "What we do differently.", COMPARISON_KIT, {
    eyebrow: "The difference",
    headline: "What we left out.",
    theirsLabel: "Elsewhere",
    oursLabel: "Here",
    points: ["A finite number of pieces", "Reactions kept private", "90% to the writer", "No follower counts", "An ending, every night"],
    footLeft: "harystyles.com",
    footRight: "",
  }),

  square("community-spotlight", "Community spotlight", "Someone in the community, named.", SPOTLIGHT_KIT, {
    eyebrow: "Writer spotlight",
    title: "Saoirse Linn",
    body: "Writes about bad sleep and good light. Six letters in her notebook 'Sleepless April', all of them written between three and five in the morning.",
    evidenceLabel: "Notebook",
    evidence: "Sleepless April · 6 letters",
    footLeft: "harystyles.com/saoirse",
    footRight: "",
  }),

  square("hiring", "Hiring / careers", "An open role, described honestly.", HEADLINE_KIT, {
    eyebrow: "We're hiring",
    headline: "A designer|who reads.",
    body: "Someone to look after the reading experience — type, rhythm, restraint. Remote, four days, no growth targets.",
    footLeft: "harystyles.com/work",
    footRight: "Open until filled",
  }),

  square("partnership", "Partnership announcement", "Two names, one line.", HEADLINE_KIT, {
    eyebrow: "Together",
    headline: "harystyles|× The Reading Room.",
    body: "Members of The Reading Room get a year of patronage for a writer of their choosing. We are very glad about this.",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 1 }),

  square("lighthearted", "Lighthearted", "The brand, off duty. Still not shouting.", HEADLINE_KIT, {
    eyebrow: "Observed",
    headline: "It is 2am|and you are fine.",
    body: "Nobody has ever written anything good at a reasonable hour. We are not going to be the ones to tell you to go to bed.",
    footLeft: "harystyles.com",
    footRight: "",
  }, { background: "lamp", layout: 1 }),

  square("cta-sign-up", "CTA · sign up", "The ask.", CTA_KIT, {
    eyebrow: "The lamp is lit",
    headline: "Read tonight.",
    body: "Five letters, hand-picked. Free to read, always. $4 a month if one of them moves you.",
    button: "Begin reading",
    url: "harystyles.com",
    lit: true,
  }, { background: "lamp" }),

  // ---------------------------------------------------------------- additions
  //
  // Shapes the brand publishes that the original set had no home for. Each one
  // earns its place by being something harystyles would actually post, not by
  // filling a slot in a checklist.

  square("timeline", "Timeline", "How something got here, in dated moments.", TIMELINE_KIT, {
    eyebrow: "A writer's year",
    headline: "Thirty-four letters, one at a time.",
    moments: [
      "March :: Ines posts her first letter. Four people read it.",
      "June :: A notebook — 'Letters from a leaving city' — eight letters, read in order.",
      "September :: The hundredth patron. She writes to every one of them by hand.",
      "December :: 412 patrons. She gives up the other job.",
    ],
    footLeft: "harystyles.com/ines",
    footRight: "",
  }),

  square("feature-grid", "Feature grid", "Several things at once, given equal weight.", GRID_KIT, {
    eyebrow: "What you get",
    headline: "Everything, and nothing else.",
    cells: [
      "Five letters :: Hand-picked each evening, then the lamp goes out.",
      "Six moods :: Read by feeling rather than by topic.",
      "A private shelf :: The lines you kept, shown to nobody.",
      "One price :: $4 a month, to one writer. 90% goes to them.",
    ],
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 2 }),

  square("patronage", "What patronage costs", "One price, said plainly.", STAT_KIT, {
    eyebrow: "Patronage",
    figure: "$4",
    label: "a month, to one writer",
    body: "Not a tier, not a plan, not an unlock. Ninety per cent of it goes to them. Cancel any time, and nothing you kept goes away.",
    footLeft: "harystyles.com",
    footRight: "90% to the writer",
  }, { background: "lamp", layout: 1 }),

  square("thank-you", "Thank you", "Gratitude, without a campaign attached.", HEADLINE_KIT, {
    eyebrow: "A year of letters",
    headline: "10,000 letters,|and every one of you.",
    body: "Written mostly at night, mostly about leaving. We did not expect this and we are not taking it for granted.",
    footLeft: "harystyles.com",
    footRight: "❦",
  }, { background: "lamp", layout: 1 }),

  square("seasonal", "Seasonal", "The turning of a season, in the brand's own weather.", HEADLINE_KIT, {
    eyebrow: "The longest night",
    headline: "Midwinter.|The lamp stays on.",
    body: "Tonight's five are all about the dark — not to cheer you out of it, but to sit in it with you for a while.",
    footLeft: "harystyles.com",
    footRight: "December 21",
  }, { background: "lamp", layout: 2 }),

  square("press", "Press announcement", "For the record, stated flatly.", SPOTLIGHT_KIT, {
    eyebrow: "For the record",
    title: "harystyles raises nothing, hires two.",
    body: "We are not announcing a round. We are announcing that two people who care about reading are joining, and that the price stays at four pounds.",
    evidenceLabel: "Press",
    evidence: "press@harystyles.com",
    footLeft: "harystyles.com/press",
    footRight: "",
  }, { background: "rule", layout: 3 }),

  square("award", "Recognition", "Someone else said it, so we do not have to.", QUOTE_KIT, {
    quote: "The most humane reading experience on the internet right now.",
    attribution: "The Quiet Review",
    detail: "Reading apps of the year",
    hue: 160,
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 3 }),

  square("resource", "Something to take away", "A notebook, offered rather than gated.", SPOTLIGHT_KIT, {
    eyebrow: "Free to keep",
    title: "Letters from a leaving city",
    body: "Ines's first notebook — eight letters about departure, gathered in order and set for print. No address required; it is simply there.",
    evidenceLabel: "Download",
    evidence: "8 letters · PDF",
    footLeft: "harystyles.com/notebooks",
    footRight: "",
  }, { layout: 1 }),

  square("podcast-episode", "Podcast episode", "A letter, read aloud.", SPOTLIGHT_KIT, {
    eyebrow: "Read aloud · 12",
    title: "On the small grief of leaving a city",
    body: "Ines Marlowe reads her own letter, and talks for a while afterwards about the kettle, and why it was the last thing she packed.",
    evidenceLabel: "Listen",
    evidence: "24 min · wherever you listen",
    footLeft: "harystyles.com/aloud",
    footRight: "",
  }, { background: "grain", layout: 2 }),

  square("photo-post", "Photograph", "A picture, with the words kept off it.", PHOTO_KIT, {
    eyebrow: "From the desk",
    headline: "Where the letters get written.",
    body: "A kitchen table, a lamp, and a kettle that has outlived two apartments.",
    photo: "",
    caption: "",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 0 }),

  square("founder-portrait", "Portrait", "One person, named.", PHOTO_KIT, {
    eyebrow: "Who writes here",
    headline: "Ines Marlowe",
    body: "",
    photo: "",
    caption: "writes from somewhere coastal · 34 letters",
    footLeft: "harystyles.com/ines",
    footRight: "",
  }, { layout: 3 }),
];
