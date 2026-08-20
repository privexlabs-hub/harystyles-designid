/**
 * Ads — paid placements, across three shapes.
 *
 * Every one of these is offered square, landscape and vertical, because an ad
 * is never bought for one slot. That means the copy has to survive being
 * reflowed into a 1200×628 letterbox and a 1080×1920 story, so it is written
 * short and the supporting line is always optional to the argument.
 *
 * They are still letters, not adverts: no shouting, no countdowns, and the
 * price is said plainly rather than hidden behind a click.
 */
import { SIZES } from "../sizes";
import {
  CTA_KIT,
  EVENT_KIT,
  HEADLINE_KIT,
  QUOTE_KIT,
  SPOTLIGHT_KIT,
  STAT_KIT,
  template,
  type Kit,
} from "../define";
import type { FieldValues } from "../types";

const PLACEMENTS = [SIZES.square, SIZES.adLandscape, SIZES.vertical];

const ad = (
  id: string,
  name: string,
  blurb: string,
  kit: Kit,
  defaults: FieldValues,
  variantDefaults?: Parameters<typeof template>[1]["variantDefaults"],
) =>
  template(
    "ads",
    { id: `ads/${id}`, name, blurb, sizes: PLACEMENTS, variantDefaults },
    { ...kit, defaults },
  );

export const ADS_TEMPLATES = [
  ad(
    "product-launch",
    "Product launch",
    "The place itself, introduced to someone who has never heard of it.",
    HEADLINE_KIT,
    {
      eyebrow: "Now open",
      headline: "Five letters,|every evening.",
      body: "Hand-picked for the mood you arrived in. Free to read, always.",
      footLeft: "harystyles.com",
      footRight: "Letters, not posts",
    },
    { background: "lamp", layout: 1 },
  ),

  ad(
    "feature-announcement",
    "Feature announcement",
    "One new thing, explained to a reader who already knows the rest.",
    SPOTLIGHT_KIT,
    {
      eyebrow: "New",
      title: "Notebooks.",
      body: "A writer can gather letters into a notebook, so you can follow the thread from the first one.",
      evidenceLabel: "Now",
      evidence: "1,140 notebooks kept",
      footLeft: "harystyles.com",
      footRight: "",
    },
    { layout: 1 },
  ),

  ad(
    "lead-generation",
    "Lead generation",
    "The ask, made once. An address, and what arrives at it.",
    CTA_KIT,
    {
      eyebrow: "Thursday evenings",
      headline: "One letter a week,|to your inbox.",
      body: "Chosen by hand, sent once. Nothing else, ever.",
      button: "Leave an address",
      url: "harystyles.com/evening",
      lit: false,
    },
    { layout: 0 },
  ),

  ad(
    "brand-awareness",
    "Brand awareness",
    "No offer and no button — just the idea, said well enough to be remembered.",
    HEADLINE_KIT,
    {
      eyebrow: "An opinion",
      headline: "The feed was never|the problem.",
      body: "The problem was that it never ended. Five letters end.",
      footLeft: "harystyles.com",
      footRight: "",
    },
    { background: "grain", accent: "melancholy", layout: 1 },
  ),

  ad(
    "retargeting",
    "Retargeting",
    "For someone who came, read one, and left. Said gently, because they will see it more than once.",
    CTA_KIT,
    {
      eyebrow: "You left one open",
      headline: "It is still here.",
      body: "The letter you started is on your shelf, where you put it. Tonight's five are waiting behind it.",
      button: "Go back to it",
      url: "harystyles.com/shelf",
      lit: true,
    },
    { background: "lamp", layout: 1 },
  ),

  ad(
    "customer-proof",
    "Customer proof",
    "A reader, in their own words. The most convincing ad we have.",
    QUOTE_KIT,
    {
      quote: "It's the only place online I read slowly anymore.",
      attribution: "Saoirse L.",
      detail: "reader · 2 years",
      hue: 200,
      footLeft: "harystyles.com",
      footRight: "",
    },
    { layout: 0 },
  ),

  ad(
    "big-stat",
    "Big stat",
    "One number, given the whole placement.",
    STAT_KIT,
    {
      eyebrow: "Last month",
      figure: "90%",
      label: "of what patrons pay reaches the writer",
      body: "The rest keeps the lamp on. There is no third party in the middle.",
      footLeft: "harystyles.com",
      footRight: "❦",
    },
    { layout: 1 },
  ),

  ad(
    "offer",
    "Offer / promotion",
    "An offer with an end date, stated once and without urgency.",
    CTA_KIT,
    {
      eyebrow: "Until Sunday",
      headline: "A year of patronage,|two months given.",
      body: "Ninety per cent of it reaches the writer you choose.",
      button: "Become a patron",
      url: "harystyles.com/patron",
      lit: false,
    },
    { background: "gradient", accent: "wine", layout: 0 },
  ),

  ad(
    "event",
    "Event",
    "An evening, advertised to people who have not been to one.",
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
    { accent: "wine", layout: 1 },
  ),

  ad(
    "app-download",
    "App / product download",
    "The install ad. What it does at night, and where to get it.",
    CTA_KIT,
    {
      eyebrow: "For the evening",
      headline: "The lamp,|in your pocket.",
      body: "Tonight's five arrive when it gets dark where you are. Read them offline, keep the lines you want.",
      button: "Get the app",
      url: "harystyles.com/app",
      lit: true,
    },
    { background: "lamp", layout: 2 },
  ),
];
