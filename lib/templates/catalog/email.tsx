/**
 * Email · 600px wide — the blocks the evening letter is built from.
 *
 * Six hundred pixels is the whole world here, and some of these will be opened
 * in Outlook on a work laptop. So the copy is shorter than it would be in the
 * feed, the lists are five items at most, and nothing depends on being read at
 * a size email will not give it.
 */
import { SIZES } from "../sizes";
import {
  BANNER_KIT,
  CTA_KIT,
  EVENT_KIT,
  HEADLINE_KIT,
  LIST_KIT,
  QUOTE_KIT,
  SPOTLIGHT_KIT,
  template,
  type Kit,
} from "../define";
import type { FieldValues } from "../types";

const email = (
  id: string,
  name: string,
  blurb: string,
  size: (typeof SIZES)[keyof typeof SIZES],
  kit: Kit,
  defaults: FieldValues,
  variantDefaults?: Parameters<typeof template>[1]["variantDefaults"],
) =>
  template(
    "email",
    { id: `email/${id}`, name, blurb, sizes: [size], variantDefaults },
    { ...kit, defaults },
  );

export const EMAIL_TEMPLATES = [
  email(
    "header",
    "Header",
    "600×240. The strip at the top of every letter — the lamp, and the evening it was lit.",
    SIZES.emailHeader,
    BANNER_KIT,
    {
      eyebrow: "Thursday evening",
      headline: "The lamp is lit.",
      detail: "Five letters, hand-picked",
    },
    { background: "lamp", accent: "amber", layout: 0 },
  ),

  email(
    "product-announcement",
    "Product announcement",
    "600×600. Something new, said in three lines, because nobody reads the fourth in an inbox.",
    SIZES.emailBlock,
    HEADLINE_KIT,
    {
      eyebrow: "New",
      headline: "Notebooks.|Read a series in order.",
      body: "A writer can gather letters into a notebook, so you can follow the thread from the first one.",
      footLeft: "harystyles.com",
      footRight: "",
    },
    { layout: 0 },
  ),

  email(
    "feature-launch",
    "Feature launch",
    "600×800. One feature with room to explain itself, and a small piece of evidence at the foot.",
    SIZES.emailTall,
    SPOTLIGHT_KIT,
    {
      eyebrow: "How it works",
      title: "Keep a line.",
      body: "Highlight a sentence and it goes to your shelf. Private, permanently — never shown to the writer, never used to recommend anything to you.",
      evidenceLabel: "So far",
      evidence: "1,204 lines kept",
      footLeft: "harystyles.com",
      footRight: "",
    },
    { background: "rule", layout: 1 },
  ),

  email(
    "newsletter",
    "Newsletter",
    "600×800. Tonight's five, named. The list is the letter; there is nothing else to say.",
    SIZES.emailTall,
    LIST_KIT,
    {
      eyebrow: "Tonight",
      headline: "Five letters.",
      items: [
        "On the small grief of leaving a city",
        "What my father kept in the shed",
        "Sleepless April, the fourth night",
        "A short defence of doing nothing",
        "The last warm thing in the flat",
      ],
      footLeft: "harystyles.com",
      footRight: "❦",
    },
    { layout: 0 },
  ),

  email(
    "event",
    "Event",
    "600×600. When, where, and one line about why. The date is the point.",
    SIZES.emailBlock,
    EVENT_KIT,
    {
      eyebrow: "An evening of letters",
      title: "Reading aloud, together.",
      date: "March 28",
      detail: "20:00 GMT · online · free",
      body: "Six writers read the letter they were most afraid to publish.",
      footLeft: "harystyles.com/events",
      footRight: "",
    },
    { accent: "wine", layout: 3 },
  ),

  email(
    "promotion",
    "Promotion",
    "600×600. An offer, made once and quietly. No countdown, no shouting.",
    SIZES.emailBlock,
    CTA_KIT,
    {
      eyebrow: "Until Sunday",
      headline: "A year of patronage,|two months given.",
      body: "Become a patron of one writer before Sunday and we will add two months. Ninety per cent of it reaches them.",
      button: "Become a patron",
      url: "harystyles.com/patron",
      lit: false,
    },
    { background: "gradient", accent: "wine", layout: 1 },
  ),

  email(
    "customer-story",
    "Customer story",
    "600×600. A reader in their own words, kept short enough to survive an inbox.",
    SIZES.emailBlock,
    QUOTE_KIT,
    {
      quote: "I became a patron of one writer, and now I look forward to the evening again.",
      attribution: "Tomás V.",
      detail: "patron of Ines Marlowe",
      hue: 280,
      footLeft: "harystyles.com",
      footRight: "",
    },
    { layout: 0 },
  ),

  email(
    "cta-banner",
    "CTA banner",
    "600×320. The block at the foot of the letter, where the ask goes.",
    SIZES.emailBanner,
    CTA_KIT,
    {
      eyebrow: "The lamp is lit",
      headline: "Read tonight.",
      body: "Free to read, always. $4 a month if one of them moves you.",
      button: "Begin reading",
      url: "harystyles.com",
      lit: true,
    },
    { background: "lamp", layout: 2 },
  ),
];
