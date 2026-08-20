/**
 * Web — hero art, share cards and page banners.
 *
 * These are the widest shapes in the system and the most likely to be seen at
 * full size, so they can carry a sentence rather than a phrase. The share cards
 * cannot: an Open Graph image is shown at about 500px in a timeline, so those
 * two are written to be read small.
 */
import { SIZES } from "../sizes";
import {
  BANNER_KIT,
  CTA_KIT,
  HEADLINE_KIT,
  QUOTE_KIT,
  SPLIT_KIT,
  SPOTLIGHT_KIT,
  template,
  type Kit,
} from "../define";
import type { FieldValues } from "../types";

const web = (
  id: string,
  name: string,
  blurb: string,
  size: (typeof SIZES)[keyof typeof SIZES],
  kit: Kit,
  defaults: FieldValues,
  variantDefaults?: Parameters<typeof template>[1]["variantDefaults"],
) =>
  template(
    "web",
    { id: `web/${id}`, name, blurb, sizes: [size], variantDefaults },
    { ...kit, defaults },
  );

export const WEB_TEMPLATES = [
  web(
    "hero",
    "Hero",
    "1920×1080. The first thing on the site — the promise, and what it costs.",
    SIZES.hd,
    HEADLINE_KIT,
    {
      eyebrow: "harystyles",
      headline: "Five letters,|every evening.",
      body: "Hand-picked for the mood you arrived in. No infinite feed, no algorithm, no likes. Free to read, always.",
      footLeft: "harystyles.com",
      footRight: "Letters, not posts",
    },
    { background: "lamp", layout: 1 },
  ),

  web(
    "feature",
    "Feature",
    "1600×900. One feature on a page of several, with its evidence beside it.",
    SIZES.wide,
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
    { layout: 2 },
  ),

  web(
    "product",
    "Product",
    "1600×900. Two halves of the same thing — what a reader gets, what a writer gets.",
    SIZES.wide,
    SPLIT_KIT,
    {
      eyebrow: "Both sides of it",
      headline: "One evening, two people.",
      leftLabel: "For readers",
      leftBody: "Five letters a night, chosen by hand. Keep the lines you want to keep.",
      rightLabel: "For writers",
      rightBody: "Ninety per cent of what your patrons pay, and no follower count to mind.",
      footLeft: "harystyles.com",
      footRight: "",
    },
    { layout: 1 },
  ),

  web(
    "testimonial",
    "Testimonial",
    "1600×900. A reader, given the width to say a whole sentence.",
    SIZES.wide,
    QUOTE_KIT,
    {
      quote: "It's the only place online I read slowly anymore.",
      attribution: "Saoirse L.",
      detail: "reader · 2 years",
      hue: 200,
      footLeft: "harystyles.com",
      footRight: "❦",
    },
    { background: "rule", layout: 1 },
  ),

  web(
    "case-study",
    "Case study",
    "1600×900. What happened to one writer, with the number that matters at the foot.",
    SIZES.wide,
    SPOTLIGHT_KIT,
    {
      eyebrow: "A writer's year",
      title: "Ines went from nobody to 412 patrons.",
      body: "No launch, no list, no funnel. Thirty-four letters, one a week, written at night and posted before she could think better of it.",
      evidenceLabel: "Her share",
      evidence: "$1,648 / month",
      footLeft: "harystyles.com/ines",
      footRight: "",
    },
    { accent: "wine", layout: 1 },
  ),

  web(
    "cta",
    "CTA",
    "1600×900. The band near the foot of a page, where the ask goes.",
    SIZES.wide,
    CTA_KIT,
    {
      eyebrow: "The lamp is lit",
      headline: "Read tonight.",
      body: "Five letters, hand-picked. Free to read, always. $4 a month if one of them moves you.",
      button: "Begin reading",
      url: "harystyles.com",
      lit: true,
    },
    { background: "lamp", layout: 2 },
  ),

  web(
    "blog-hero",
    "Blog hero",
    "1600×900. The head of a single letter — its title, and the line that pulls you in.",
    SIZES.wide,
    HEADLINE_KIT,
    {
      eyebrow: "Ines Marlowe · 7 min",
      headline: "On the small grief|of leaving a city.",
      body: "I packed the kettle last. It seemed important — the last warm thing in the flat that had ever held me.",
      footLeft: "harystyles.com/ines",
      footRight: "",
    },
    { accent: "melancholy", layout: 0 },
  ),

  web(
    "og",
    "Open Graph",
    "1200×630, shown at about 500px wide in a timeline. Six words and the address.",
    SIZES.og,
    HEADLINE_KIT,
    {
      eyebrow: "harystyles.com",
      headline: "Five letters,|every evening.",
      body: "Free to read. Ninety per cent to the writer.",
      footLeft: "harystyles.com",
      footRight: "",
    },
    { background: "lamp", lockup: "tagline", layout: 1 },
  ),

  web(
    "social-share",
    "Social share",
    "1200×630. The card a shared letter becomes — a line from it, and who wrote it.",
    SIZES.og,
    QUOTE_KIT,
    {
      quote: "I packed the kettle last. It seemed important.",
      attribution: "Ines Marlowe",
      detail: "On the small grief of leaving a city",
      hue: 320,
      footLeft: "harystyles.com",
      footRight: "",
    },
    { accent: "tender", layout: 2 },
  ),

  web(
    "banner",
    "Banner",
    "1600×900 cropped to a strip in use — a lockup and a line, for the top of a page.",
    SIZES.wide,
    BANNER_KIT,
    {
      eyebrow: "Now open",
      headline: "The reading room.",
      detail: "Slow talk about letters",
    },
    { background: "grain", accent: "still", layout: 2 },
  ),
];
