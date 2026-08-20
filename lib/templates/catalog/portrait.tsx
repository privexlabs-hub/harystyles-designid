/**
 * Portrait · 1080×1350 — the taller feed post.
 *
 * The extra 270px is the whole point of this shape: there is room for a
 * headline and the sentence underneath it that explains why the headline is
 * true. Every default here uses both, because a portrait post that only carries
 * a headline should have been a square.
 *
 * The copy is real brand copy, edited from rather than replaced.
 */
import { SIZES } from "../sizes";
import {
  CTA_KIT,
  HEADLINE_KIT,
  QUOTE_KIT,
  SPLIT_KIT,
  SPOTLIGHT_KIT,
  STAT_KIT,
  STEPS_KIT,
  template,
  type Kit,
} from "../define";
import type { FieldValues, Size } from "../types";

const portrait = (
  id: string,
  name: string,
  blurb: string,
  kit: Kit,
  defaults: FieldValues,
  variantDefaults?: Parameters<typeof template>[1]["variantDefaults"],
  size: Size = SIZES.portrait,
) =>
  template(
    "portrait",
    { id: `portrait/${id}`, name, blurb, sizes: [size], variantDefaults },
    { ...kit, defaults },
  );

export const PORTRAIT_TEMPLATES = [
  portrait("announcement", "Announcement", "News, with the reason underneath it.", HEADLINE_KIT, {
    eyebrow: "From tonight",
    headline: "Letters in Irish,|every evening.",
    body: "Eleven writers, one editor, and the same five-a-night rhythm. If you read in Irish, tonight is the first night there is something waiting.",
    footLeft: "harystyles.com/gaeilge",
    footRight: "New tonight",
  }, { background: "lamp" }),

  portrait("product", "Product", "One feature, and what it is for.", SPOTLIGHT_KIT, {
    eyebrow: "How it works",
    title: "Keep a line.",
    body: "Highlight a sentence and it goes to your shelf. Private, permanently — never shown to the writer, never used to recommend anything at you.",
    evidenceLabel: "So far",
    evidence: "1,204 lines kept",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 1 }),

  portrait("quote", "Quote", "A line from a letter, with its source.", QUOTE_KIT, {
    quote: "I packed the kettle last. It seemed important — the last warm thing in the flat that had ever held me.",
    attribution: "Ines Marlowe",
    detail: "from 'On the small grief of leaving a city'",
    hue: 25,
    footLeft: "harystyles.com/ines",
    footRight: "❦",
  }, { background: "grain" }),

  portrait("big-stat", "Big stat", "A number, and the argument it makes.", STAT_KIT, {
    eyebrow: "What we noticed",
    figure: "94%",
    label: "of letters are finished",
    body: "When there are only five, people read to the end. It turns out the scarcity was the feature all along, and the endlessness was the bug.",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 0 }),

  portrait("educational", "Educational", "Something taught, one step at a time.", STEPS_KIT, {
    eyebrow: "How the five are chosen",
    headline: "Read, argue, light the lamp.",
    steps: [
      "Everything published :: two readers see every letter written that day",
      "The argument :: they disagree until seven, out loud, in writing",
      "The five :: what survives goes out at your own sunset",
    ],
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 1 }),

  portrait("testimonial", "Testimonial", "A patron, at length.", QUOTE_KIT, {
    quote: "I became a patron of one writer. Now I look forward to the evening in a way I had rather stopped doing.",
    attribution: "Tomás V.",
    detail: "patron of Ines Marlowe · 14 months",
    hue: 280,
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 3 }),

  portrait("case-study", "Case study", "A writer's year, before and after.", SPLIT_KIT, {
    eyebrow: "A writer's year",
    headline: "Ines, twelve months apart.",
    leftLabel: "Last March",
    leftBody: "Writing at night, publishing nowhere, reading the analytics of a blog nobody had found.",
    rightLabel: "This March",
    rightBody: "Thirty-four letters, 412 patrons, and $1,648 a month. No launch, no list, no funnel.",
    footLeft: "harystyles.com/ines",
    footRight: "",
  }, { layout: 1 }),

  portrait("cta", "CTA", "The ask, with the terms said plainly.", CTA_KIT, {
    eyebrow: "The lamp is lit",
    headline: "Read tonight.",
    body: "Five letters, hand-picked for the mood you arrived in. Free to read, always. $4 a month if one of them moves you, and 90% of that goes to whoever wrote it.",
    button: "Begin reading",
    url: "harystyles.com",
    lit: true,
  }, { background: "lamp", layout: 1 }),

  // ------------------------------------------------------------ additions
  //
  // Beyond the brief, but they belong with the portrait shapes rather than in
  // a category of their own:
  //
  // · Pinterest saves at 2:3 and crops anything taller, and a pin is browsed
  //   in a column of pins — so it wants the same editorial restraint as a feed
  //   post at a slightly narrower gauge.
  // · The landscape feed post is the third crop the same feed accepts. It is
  //   here because a writer laying out a portrait announcement usually needs
  //   the wide version of it in the same sitting.
  portrait("pinterest-pin", "Pinterest pin", "The 2:3 pin — a letter, pointed at from a column of pins.", SPOTLIGHT_KIT, {
    eyebrow: "New letter",
    title: "On the small grief of leaving a city",
    body: "I packed the kettle last. It seemed important — the last warm thing in the flat that had ever held me.",
    evidenceLabel: "By",
    evidence: "Ines Marlowe · 7 min",
    footLeft: "harystyles.com/ines",
    footRight: "",
  }, { background: "grain", layout: 3 }, SIZES.pinterest),

  portrait("landscape-feed", "Landscape feed post", "The wide crop of the same feed. Short copy; the shape is not tall.", HEADLINE_KIT, {
    eyebrow: "Tonight",
    headline: "Five letters,|every evening.",
    body: "Hand-picked for the mood you arrived in.",
    footLeft: "harystyles.com",
    footRight: "",
  }, { layout: 1, density: "compact" }, SIZES.landscape),
];
