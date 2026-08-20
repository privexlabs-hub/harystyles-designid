/**
 * Carousel · 1080×1080 — ten slides that carry one argument.
 *
 * The ten single-slide templates are for when someone needs one slide and not a
 * deck: a hook to open with, a proof slide to drop into an existing set. The
 * eleventh, `carousel/full-deck`, is the whole argument in one template — ten
 * slides written to be read in order.
 *
 * The default copy is the harystyles pitch as we would actually make it: the
 * feed is broken, five letters a night, patronage. No shouting, nothing sold.
 */
import { SIZES } from "../sizes";
import {
  CTA_KIT,
  HEADLINE_KIT,
  HOOK_KIT,
  LIST_KIT,
  QUOTE_KIT,
  SPOTLIGHT_KIT,
  STAT_KIT,
  STEPS_KIT,
  template,
  type Kit,
} from "../define";
import {
  CtaLayout,
  HeadlineLayout,
  HookLayout,
  ListLayout,
  QuoteLayout,
  SplitLayout,
  StatLayout,
  StepsLayout,
} from "../layouts";
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
    "carousel",
    { id: `carousel/${id}`, name, blurb, sizes: [SIZES.square], variantDefaults },
    { ...kit, defaults },
  );

export const CAROUSEL_TEMPLATES = [
  square("slide-1-hook", "Slide 1 · Hook", "The opening slide. Two or three words.", HOOK_KIT, {
    kicker: "harystyles",
    hook: "The feed is broken.",
    cue: "Swipe",
    index: "01",
  }, { background: "lamp" }),

  square("slide-2-problem", "Slide 2 · Problem", "What is wrong, named plainly.", HEADLINE_KIT, {
    eyebrow: "02 · The problem",
    headline: "Nothing ends,|so nothing lands.",
    body: "A page that refills itself cannot be finished, and a thing that cannot be finished is never quite read.",
    footLeft: "harystyles.com",
    footRight: "02 / 10",
  }, { layout: 2 }),

  square("slide-3-insight", "Slide 3 · Insight", "The turn — what we noticed.", SPOTLIGHT_KIT, {
    eyebrow: "03 · What we noticed",
    title: "The scarcity was the feature.",
    body: "When a reader is given five letters instead of five hundred, they read to the end of them. We tested nothing else and everything changed.",
    evidenceLabel: "Finished",
    evidence: "94% of letters",
    footLeft: "harystyles.com",
    footRight: "03 / 10",
  }, { background: "grain" }),

  square("slide-4-solution", "Slide 4 · Solution", "What we made instead.", HEADLINE_KIT, {
    eyebrow: "04 · What we made",
    headline: "Five letters,|every evening.",
    body: "Chosen by a person, at sunset where you are. When they are read, the evening is yours again.",
    footLeft: "harystyles.com",
    footRight: "04 / 10",
  }, { background: "lamp" }),

  square("slide-5-proof", "Slide 5 · Proof", "Someone who is already here.", QUOTE_KIT, {
    quote: "I read here every evening now. I could not tell you what changed, except that it ends.",
    attribution: "Marged O.",
    detail: "patron of Ines Marlowe",
    hue: 210,
    footLeft: "harystyles.com",
    footRight: "05 / 10",
  }, { layout: 1 }),

  square("slide-6-steps", "Slide 6 · Steps / how-to", "The four steps, in order.", STEPS_KIT, {
    eyebrow: "06 · How it works",
    headline: "From dusk to the shelf.",
    steps: [
      "The lamp is lit :: Five letters arrive at your own sunset.",
      "You read :: No counts, no reactions shown to anyone.",
      "You keep a line :: A sentence goes to your shelf, privately.",
      "You become a patron :: $4 a month; 90% of it is the writer's.",
    ],
    footLeft: "harystyles.com",
    footRight: "06 / 10",
  }),

  square("slide-7-examples", "Slide 7 · Examples", "What a night actually holds.", LIST_KIT, {
    eyebrow: "07 · Tonight's five",
    headline: "What arrives at dusk.",
    items: [
      "On the small grief of leaving a city",
      "Letters my mother never sent",
      "Nine minutes on the last cold morning",
      "A notebook kept through a bad April",
      "What I learned from sleeping badly",
    ],
    footLeft: "harystyles.com",
    footRight: "07 / 10",
  }, { layout: 2 }),

  square("slide-8-data", "Slide 8 · Data / stats", "The number that carries the argument.", STAT_KIT, {
    eyebrow: "08 · The number",
    figure: "90%",
    label: "goes to the writer",
    body: "Of every $4 a patron gives. We keep the rest, and we keep nothing else — not your reading, not your kept lines.",
    footLeft: "harystyles.com",
    footRight: "08 / 10",
  }, { layout: 3 }),

  square("slide-9-takeaways", "Slide 9 · Takeaways", "What to carry away from the deck.", LIST_KIT, {
    eyebrow: "09 · To carry away",
    headline: "Three things, then.",
    items: [
      "An ending is a kindness",
      "A reader is not an audience",
      "Writing is worth paying for",
    ],
    footLeft: "harystyles.com",
    footRight: "09 / 10",
  }, { background: "rule" }),

  square("slide-10-close", "Final slide · Close / CTA", "The last slide. The ask.", CTA_KIT, {
    eyebrow: "The lamp is lit",
    headline: "Read tonight.",
    body: "Five letters, free to read. Become a patron only when one of them stays with you.",
    button: "Begin reading",
    url: "harystyles.com",
    lit: true,
  }, { background: "lamp", layout: 1 }),

  // ------------------------------------------------------------ the whole deck

  template(
    "carousel",
    {
      id: "carousel/full-deck",
      name: "Full deck · ten slides",
      blurb: "The whole argument: the feed is broken, five letters a night, patronage.",
      sizes: [SIZES.square],
      slides: 10,
      variantDefaults: { background: "lamp" },
    },
    {
      layouts: ["Anchored", "Centred", "Headline first", "Ruled"],
      fields: [
        { key: "hook", kind: "textarea", label: "1 · Hook", rows: 2 },
        { key: "hookCue", kind: "text", label: "1 · Cue" },
        { key: "problem", kind: "textarea", label: "2 · Problem headline", rows: 2 },
        { key: "problemBody", kind: "textarea", label: "2 · Problem line", rows: 3 },
        { key: "costLeft", kind: "textarea", label: "3 · Before", rows: 2 },
        { key: "costRight", kind: "textarea", label: "3 · After", rows: 2 },
        { key: "insight", kind: "textarea", label: "4 · Insight headline", rows: 2 },
        { key: "insightBody", kind: "textarea", label: "4 · Insight line", rows: 3 },
        { key: "solution", kind: "textarea", label: "5 · Solution headline", rows: 2 },
        { key: "solutionBody", kind: "textarea", label: "5 · Solution line", rows: 3 },
        { key: "steps", kind: "list", label: "6 · Steps", hint: "Use :: to split title from description.", itemLabel: "Step", max: 4 },
        { key: "quote", kind: "textarea", label: "7 · Quote", rows: 3 },
        { key: "attribution", kind: "text", label: "7 · Who said it" },
        { key: "detail", kind: "text", label: "7 · Their detail" },
        { key: "figure", kind: "text", label: "8 · Figure" },
        { key: "figureLabel", kind: "text", label: "8 · What it counts" },
        { key: "figureBody", kind: "textarea", label: "8 · Context", rows: 3 },
        { key: "takeaways", kind: "list", label: "9 · Takeaways", itemLabel: "Takeaway", max: 4 },
        { key: "ask", kind: "textarea", label: "10 · The ask", rows: 2 },
        { key: "askBody", kind: "textarea", label: "10 · Supporting line", rows: 2 },
        { key: "button", kind: "text", label: "10 · Button" },
        { key: "url", kind: "text", label: "10 · Where to go" },
      ],
      defaults: {
        hook: "The feed is broken.",
        hookCue: "Swipe",
        problem: "Nothing ends,|so nothing lands.",
        problemBody:
          "A page that refills itself cannot be finished, and a thing that cannot be finished is never quite read.",
        costLeft: "Forty minutes of scrolling; nothing kept, nothing finished, no memory of any of it.",
        costRight: "Two letters read to the end, one line kept to the shelf, the lamp out by eleven.",
        insight: "The scarcity|was the feature.",
        insightBody:
          "Give a reader five letters instead of five hundred and they read to the end. We changed nothing else.",
        solution: "Five letters,|every evening.",
        solutionBody:
          "Chosen by a person, at sunset where you are. When they are read, the evening is yours again.",
        steps: [
          "The lamp is lit :: Five letters arrive at your own sunset.",
          "You read :: No counts, no reactions shown to anyone.",
          "You keep a line :: A sentence goes to your shelf, privately.",
          "You become a patron :: $4 a month to one writer.",
        ],
        quote: "I read here every evening now. I could not tell you what changed, except that it ends.",
        attribution: "Marged O.",
        detail: "patron of Ines Marlowe",
        figure: "90%",
        figureLabel: "goes to the writer",
        figureBody:
          "Of every $4 a patron gives. We keep the rest, and nothing else — not your reading, not your kept lines.",
        takeaways: ["An ending is a kindness", "A reader is not an audience", "Writing is worth paying for"],
        ask: "Read tonight.",
        askBody: "Free to read, always. Become a patron only when a letter stays with you.",
        button: "Begin reading",
        url: "harystyles.com",
      },
      render: (ctx, slide) => {
        const foot = (n: number) => ({ footLeft: "harystyles.com", footRight: `${n} / 10` });

        switch (slide) {
          case 0:
            return (
              <HookLayout
                ctx={ctx}
                props={{
                  kicker: "harystyles",
                  hook: ctx.text("hook"),
                  cue: ctx.text("hookCue"),
                  index: "01",
                }}
              />
            );
          case 1:
            return (
              <HeadlineLayout
                ctx={ctx}
                props={{
                  eyebrow: "02 · The problem",
                  headline: ctx.text("problem"),
                  body: ctx.text("problemBody"),
                  ...foot(2),
                }}
              />
            );
          case 2:
            return (
              <SplitLayout
                ctx={ctx}
                props={{
                  eyebrow: "03 · What it costs",
                  headline: "An evening, twice.",
                  leftLabel: "Before",
                  leftBody: ctx.text("costLeft"),
                  rightLabel: "After",
                  rightBody: ctx.text("costRight"),
                  ...foot(3),
                }}
              />
            );
          case 3:
            return (
              <HeadlineLayout
                ctx={ctx}
                props={{
                  eyebrow: "04 · What we noticed",
                  headline: ctx.text("insight"),
                  body: ctx.text("insightBody"),
                  ...foot(4),
                }}
              />
            );
          case 4:
            return (
              <HeadlineLayout
                ctx={ctx}
                props={{
                  eyebrow: "05 · What we made",
                  headline: ctx.text("solution"),
                  body: ctx.text("solutionBody"),
                  ...foot(5),
                }}
              />
            );
          case 5:
            return (
              <StepsLayout
                ctx={ctx}
                props={{
                  eyebrow: "06 · How it works",
                  headline: "From dusk to the shelf.",
                  steps: ctx.list("steps"),
                  ...foot(6),
                }}
              />
            );
          case 6:
            return (
              <QuoteLayout
                ctx={ctx}
                props={{
                  quote: ctx.text("quote"),
                  attribution: ctx.text("attribution"),
                  detail: ctx.text("detail"),
                  hue: 210,
                  ...foot(7),
                }}
              />
            );
          case 7:
            return (
              <StatLayout
                ctx={ctx}
                props={{
                  eyebrow: "08 · The number",
                  figure: ctx.text("figure"),
                  label: ctx.text("figureLabel"),
                  body: ctx.text("figureBody"),
                  ...foot(8),
                }}
              />
            );
          case 8:
            return (
              <ListLayout
                ctx={ctx}
                props={{
                  eyebrow: "09 · To carry away",
                  headline: "Three things, then.",
                  items: ctx.list("takeaways"),
                  ...foot(9),
                }}
              />
            );
          default:
            return (
              <CtaLayout
                ctx={ctx}
                props={{
                  eyebrow: "The lamp is lit",
                  headline: ctx.text("ask"),
                  body: ctx.text("askBody"),
                  button: ctx.text("button"),
                  url: ctx.text("url"),
                  lit: true,
                }}
              />
            );
        }
      },
    },
  ),
];
