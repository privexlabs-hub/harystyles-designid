/**
 * Vertical · 1080×1920 — Stories and Reels.
 *
 * A Story is held at arm's length and read in about two seconds, and the
 * platform paints its own chrome over the top and bottom of the frame. So the
 * copy here is shorter than anywhere else in the catalog, the arrangements are
 * mostly centred — the 1015×1350 safe area is centred too — and the lockup
 * prefers a bottom corner, where the reply bar is at least thin, over the top
 * bar with its avatar and its close button.
 *
 * The sign-off line and any eyebrow that pins itself to the top of the frame
 * are left empty here on purpose: on a 1920-tall artboard both land well
 * outside the safe area, where the story bar and the reply bar cover them. The
 * lockup carries the brand instead, and the link belongs on the platform's own
 * sticker.
 *
 * The defaults are real brand copy. A writer edits these; they are not
 * placeholders, so they say letters and patrons and notebooks, and they never
 * shout.
 */
import { SIZES } from "../sizes";
import {
  CTA_KIT,
  EVENT_KIT,
  HEADLINE_KIT,
  HOOK_KIT,
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

const vertical = (
  id: string,
  name: string,
  blurb: string,
  kit: Kit,
  defaults: FieldValues,
  variantDefaults?: Parameters<typeof template>[1]["variantDefaults"],
) =>
  template(
    "vertical",
    { id: `vertical/${id}`, name, blurb, sizes: [SIZES.vertical], variantDefaults },
    { ...kit, defaults },
  );

export const VERTICAL_TEMPLATES = [
  vertical("launch", "Launch", "Something arriving, said in one breath.", HEADLINE_KIT, {
    eyebrow: "Tonight",
    headline: "The lamp|is lit.",
    body: "Five letters, hand-picked, waiting for you.",
    footLeft: "",
    footRight: "",
  }, { background: "lamp", layout: 1, corner: "bottom-left" }),

  vertical("feature", "Feature", "One new thing, up close.", SPOTLIGHT_KIT, {
    eyebrow: "",
    title: "Notebooks.",
    body: "A writer can gather letters into a notebook, so you can follow the thread from the first one.",
    evidenceLabel: "Where",
    evidence: "On every writer's page",
    footLeft: "",
    footRight: "",
  }, { background: "rule", layout: 3, corner: "bottom-right" }),

  vertical("product-demo", "Product demo", "Three taps, in order, for a screen recording.", STEPS_KIT, {
    eyebrow: "",
    headline: "Keep a line: three taps.",
    steps: [
      "Press and hold :: on the sentence you want",
      "Keep :: it goes straight to your shelf",
      "Nobody is told :: not the writer, not us",
    ],
    footLeft: "",
    footRight: "",
  }, { layout: 0, corner: "bottom-right", density: "compact" }),

  vertical("big-stat", "Big stat", "One number, given the whole frame.", STAT_KIT, {
    eyebrow: "This month",
    figure: "1,204",
    label: "lines kept by readers",
    body: "Every one of them private.",
    footLeft: "",
    footRight: "",
  }, { layout: 1, corner: "bottom-left" }),

  vertical("quote", "Quote", "A line from a letter, set large.", QUOTE_KIT, {
    quote: "I packed the kettle last.",
    attribution: "Ines Marlowe",
    detail: "from 'On leaving a city'",
    hue: 25,
    footLeft: "",
    footRight: "",
  }, { background: "grain", layout: 2, corner: "bottom-right" }),

  vertical("testimonial", "Testimonial", "A reader, in their own words.", QUOTE_KIT, {
    quote: "It is the only place online I read slowly anymore.",
    attribution: "Saoirse L.",
    detail: "reader · 2 years",
    hue: 200,
    footLeft: "",
    footRight: "",
  }, { layout: 3, corner: "bottom-left" }),

  vertical("info", "Info", "What this place is, for someone who arrived by accident.", SPLIT_KIT, {
    eyebrow: "What this is",
    headline: "Five letters, every evening.",
    leftLabel: "To read",
    leftBody: "Free, always. No feed, no counts, no algorithm.",
    rightLabel: "To keep it going",
    rightBody: "$4 a month, and 90% of it goes to the writer.",
    footLeft: "",
    footRight: "",
  }, { layout: 1, corner: "bottom-right" }),

  vertical("educational", "Educational", "One idea, taught gently.", SPOTLIGHT_KIT, {
    eyebrow: "",
    title: "'Essay' means an attempt.",
    body: "Montaigne called them essais because he was trying something out, not settling it.",
    evidenceLabel: "From",
    evidence: "Essais, 1580",
    footLeft: "",
    footRight: "",
  }, { background: "grain", layout: 1, corner: "bottom-left" }),

  vertical("behind-the-scenes", "Behind the scenes", "The workroom, with the door left open.", SPOTLIGHT_KIT, {
    eyebrow: "",
    title: "How the five are chosen.",
    body: "Two people read everything published that day and argue about it until seven. There is no model in the room.",
    evidenceLabel: "Tonight's reader",
    evidence: "Ada",
    footLeft: "",
    footRight: "",
  }, { layout: 0, corner: "bottom-right", density: "compact" }),

  vertical("announcement", "Announcement", "Two lines and the mark. Nothing else.", HEADLINE_KIT, {
    eyebrow: "From tonight",
    headline: "Letters|in Irish.",
    body: "Eleven writers, starting this evening.",
    footLeft: "",
    footRight: "",
  }, { background: "gradient", layout: 1, corner: "bottom-left" }),

  vertical("countdown", "Countdown", "A number of days, and what happens after them.", STAT_KIT, {
    eyebrow: "Until the reading",
    figure: "3",
    label: "evenings from now",
    body: "Six writers read the letter they were most afraid to publish.",
    footLeft: "",
    footRight: "",
  }, { background: "lamp", layout: 1, corner: "bottom-right" }),

  vertical("poll", "Poll / question", "An honest question, with a sticker over the options.", QUESTION_KIT, {
    eyebrow: "Tell us",
    question: "When do you read?",
    options: ["On the bus", "In bed"],
    prompt: "Whatever you answer, tonight's five will be there.",
    footLeft: "",
    footRight: "",
  }, { layout: 1, corner: "bottom-left" }),

  vertical("cta", "CTA", "The ask, with room around it.", CTA_KIT, {
    eyebrow: "The lamp is lit",
    headline: "Read tonight.",
    body: "Five letters, hand-picked. Free, always.",
    button: "Begin reading",
    url: "harystyles.com",
    lit: true,
  }, { background: "lamp", layout: 1, corner: "bottom-right" }),

  vertical("event", "Event", "A date, a time, and one reason to come.", EVENT_KIT, {
    eyebrow: "An evening of letters",
    title: "Reading aloud, together.",
    date: "28 March",
    detail: "20:00 GMT · online · free",
    body: "Come and listen.",
    footLeft: "",
    footRight: "",
  }, { layout: 1, corner: "bottom-left" }),

  // ------------------------------------------------------------ additions
  //
  // Beyond the brief. A Reel is uploaded at the full 1080×1920 but the grid
  // and the cover picker only ever show the middle of it, so the cover needs
  // its own artboard with its own rule about where the words may go — which is
  // exactly the safe area this size already carries.
  vertical("reels-cover", "Reels cover", "The frame the grid shows: only the centred 1015×1350 survives.", HOOK_KIT, {
    kicker: "Tonight",
    hook: "The lamp is lit",
    cue: "harystyles.com",
    index: "",
  }, { background: "lamp", layout: 1, lockup: "none", corner: "bottom-right" }),
];
