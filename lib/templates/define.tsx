/**
 * Helpers for declaring templates.
 *
 * A template is mostly configuration — which layout, which fields, what the
 * defaults say — so these keep the catalog readable and stop a hundred and
 * fifty entries turning into a hundred and fifty bespoke components.
 *
 * Each layout gets a "kit": the arrangements it offers and the fields it needs.
 * A catalog entry picks a kit, supplies defaults, and is done.
 */
import {
  AvatarLayout,
  BannerLayout,
  ComparisonLayout,
  CtaLayout,
  EventLayout,
  HeadlineLayout,
  HookLayout,
  ListLayout,
  QuestionLayout,
  QuoteLayout,
  SpotlightLayout,
  SplitLayout,
  StatLayout,
  StepsLayout,
} from "./layouts";
import type { CategoryId, Ctx, FieldDef, FieldValues, TemplateDef, Variant } from "./types";
import type { Size } from "./sizes";

type Base = {
  id: string;
  name: string;
  blurb: string;
  sizes: Size[];
  variantDefaults?: Partial<Variant>;
  slides?: number;
};

export function template(
  category: CategoryId,
  base: Base,
  spec: {
    layouts: string[];
    fields: FieldDef[];
    defaults: FieldValues;
    render: TemplateDef["render"];
  },
): TemplateDef {
  return { category, ...base, ...spec };
}

/** A reusable bundle of arrangements and fields, spread into a template spec. */
export type Kit = { layouts: string[]; fields: FieldDef[]; render: TemplateDef["render"] };

// ---------------------------------------------------------------- shared fields

const SIGNOFF: FieldDef[] = [
  { key: "footLeft", kind: "text", label: "Sign-off, left" },
  { key: "footRight", kind: "text", label: "Sign-off, right" },
];

const EYEBROW: FieldDef = {
  key: "eyebrow",
  kind: "text",
  label: "Eyebrow",
  hint: "Set in mono and uppercased for you.",
};

// ---------------------------------------------------------------- kits

export const HEADLINE_KIT: Kit = {
  layouts: ["Anchored", "Centred", "Headline first", "Ruled"],
  fields: [
    EYEBROW,
    {
      key: "headline",
      kind: "textarea",
      label: "Headline",
      hint: "Everything after a | goes on its own line, in accent italic.",
      rows: 2,
    },
    { key: "body", kind: "textarea", label: "Supporting line", rows: 3 },
    ...SIGNOFF,
  ],
  render: (ctx) => (
    <HeadlineLayout
      ctx={ctx}
      props={{
        eyebrow: ctx.text("eyebrow"),
        headline: ctx.text("headline"),
        body: ctx.text("body"),
        footLeft: ctx.text("footLeft"),
        footRight: ctx.text("footRight"),
      }}
    />
  ),
};

export const STAT_KIT: Kit = {
  layouts: ["Stacked", "Centred", "Beside", "Framed"],
  fields: [
    EYEBROW,
    { key: "figure", kind: "text", label: "Figure", hint: "Kept short — it is set very large." },
    { key: "label", kind: "text", label: "What it counts" },
    { key: "body", kind: "textarea", label: "Context", rows: 3 },
    ...SIGNOFF,
  ],
  render: (ctx) => (
    <StatLayout
      ctx={ctx}
      props={{
        eyebrow: ctx.text("eyebrow"),
        figure: ctx.text("figure"),
        label: ctx.text("label"),
        body: ctx.text("body"),
        footLeft: ctx.text("footLeft"),
        footRight: ctx.text("footRight"),
      }}
    />
  ),
};

export const QUOTE_KIT: Kit = {
  layouts: ["Fleuron", "Ruled", "Centred", "Carded"],
  fields: [
    { key: "quote", kind: "textarea", label: "Quote", hint: "Quotation marks are added for you.", rows: 4 },
    { key: "attribution", kind: "text", label: "Who said it" },
    { key: "detail", kind: "text", label: "Their detail" },
    { key: "hue", kind: "number", label: "Avatar hue", hint: "0–360. Stable per person.", min: 0, max: 360 },
    ...SIGNOFF,
  ],
  render: (ctx) => (
    <QuoteLayout
      ctx={ctx}
      props={{
        quote: ctx.text("quote"),
        attribution: ctx.text("attribution"),
        detail: ctx.text("detail"),
        hue: ctx.num("hue") || 25,
        footLeft: ctx.text("footLeft"),
        footRight: ctx.text("footRight"),
      }}
    />
  ),
};

export const SPLIT_KIT: Kit = {
  layouts: ["Stacked", "Side by side", "Weighted", "Carded"],
  fields: [
    EYEBROW,
    { key: "headline", kind: "text", label: "Headline" },
    { key: "leftLabel", kind: "text", label: "First label" },
    { key: "leftBody", kind: "textarea", label: "First half", rows: 2 },
    { key: "rightLabel", kind: "text", label: "Second label" },
    { key: "rightBody", kind: "textarea", label: "Second half", rows: 2 },
    ...SIGNOFF,
  ],
  render: (ctx) => (
    <SplitLayout
      ctx={ctx}
      props={{
        eyebrow: ctx.text("eyebrow"),
        headline: ctx.text("headline"),
        leftLabel: ctx.text("leftLabel"),
        leftBody: ctx.text("leftBody"),
        rightLabel: ctx.text("rightLabel"),
        rightBody: ctx.text("rightBody"),
        footLeft: ctx.text("footLeft"),
        footRight: ctx.text("footRight"),
      }}
    />
  ),
};

export const LIST_KIT: Kit = {
  layouts: ["Fleuron", "Numbered", "Ruled", "Carded"],
  fields: [
    EYEBROW,
    { key: "headline", kind: "text", label: "Headline" },
    { key: "items", kind: "list", label: "Items", itemLabel: "Item", max: 8 },
    ...SIGNOFF,
  ],
  render: (ctx) => (
    <ListLayout
      ctx={ctx}
      props={{
        eyebrow: ctx.text("eyebrow"),
        headline: ctx.text("headline"),
        items: ctx.list("items"),
        footLeft: ctx.text("footLeft"),
        footRight: ctx.text("footRight"),
      }}
    />
  ),
};

export const HOOK_KIT: Kit = {
  layouts: ["Anchored", "Centred", "Numbered", "Banded"],
  fields: [
    { key: "kicker", kind: "text", label: "Kicker" },
    { key: "hook", kind: "textarea", label: "Hook", hint: "Two or three words carry furthest.", rows: 2 },
    { key: "cue", kind: "text", label: "Cue" },
    { key: "index", kind: "text", label: "Slide number" },
  ],
  render: (ctx) => (
    <HookLayout
      ctx={ctx}
      props={{
        kicker: ctx.text("kicker"),
        hook: ctx.text("hook"),
        cue: ctx.text("cue"),
        index: ctx.text("index"),
      }}
    />
  ),
};

export const COMPARISON_KIT: Kit = {
  layouts: ["Columns", "Rows", "Carded", "Stacked"],
  fields: [
    EYEBROW,
    { key: "headline", kind: "text", label: "Headline" },
    { key: "theirsLabel", kind: "text", label: "The alternative" },
    { key: "oursLabel", kind: "text", label: "Ours" },
    { key: "points", kind: "list", label: "Points", itemLabel: "Point", max: 7 },
    ...SIGNOFF,
  ],
  render: (ctx) => (
    <ComparisonLayout
      ctx={ctx}
      props={{
        eyebrow: ctx.text("eyebrow"),
        headline: ctx.text("headline"),
        theirsLabel: ctx.text("theirsLabel"),
        oursLabel: ctx.text("oursLabel"),
        points: ctx.list("points"),
        footLeft: ctx.text("footLeft"),
        footRight: ctx.text("footRight"),
      }}
    />
  ),
};

export const CTA_KIT: Kit = {
  layouts: ["Anchored", "Centred", "Banded", "No button"],
  fields: [
    EYEBROW,
    { key: "headline", kind: "textarea", label: "The ask", rows: 2 },
    { key: "body", kind: "textarea", label: "Supporting line", rows: 2 },
    { key: "button", kind: "text", label: "Button" },
    { key: "url", kind: "text", label: "Where to go" },
    { key: "lit", kind: "toggle", label: "Show the lit-lamp dot" },
  ],
  render: (ctx) => (
    <CtaLayout
      ctx={ctx}
      props={{
        eyebrow: ctx.text("eyebrow"),
        headline: ctx.text("headline"),
        body: ctx.text("body"),
        button: ctx.text("button"),
        url: ctx.text("url"),
        lit: ctx.bool("lit"),
      }}
    />
  ),
};

export const SPOTLIGHT_KIT: Kit = {
  layouts: ["Stacked", "Carded", "Beside", "Framed"],
  fields: [
    EYEBROW,
    { key: "title", kind: "text", label: "Title" },
    { key: "body", kind: "textarea", label: "Description", rows: 4 },
    { key: "evidenceLabel", kind: "text", label: "Evidence label" },
    { key: "evidence", kind: "text", label: "Evidence" },
    ...SIGNOFF,
  ],
  render: (ctx) => (
    <SpotlightLayout
      ctx={ctx}
      props={{
        eyebrow: ctx.text("eyebrow"),
        title: ctx.text("title"),
        body: ctx.text("body"),
        evidenceLabel: ctx.text("evidenceLabel"),
        evidence: ctx.text("evidence"),
        footLeft: ctx.text("footLeft"),
        footRight: ctx.text("footRight"),
      }}
    />
  ),
};

export const BANNER_KIT: Kit = {
  layouts: ["Centred", "Flush left", "Split", "Stacked"],
  fields: [
    EYEBROW,
    { key: "headline", kind: "text", label: "Headline" },
    { key: "detail", kind: "text", label: "Detail" },
  ],
  render: (ctx) => (
    <BannerLayout
      ctx={ctx}
      props={{
        eyebrow: ctx.text("eyebrow"),
        headline: ctx.text("headline"),
        detail: ctx.text("detail"),
      }}
    />
  ),
};

export const AVATAR_KIT: Kit = {
  layouts: ["Mark", "Stamp", "Initial", "Disc"],
  fields: [
    { key: "markColor", kind: "text", label: "Mark colour", hint: "A hex value. Leave empty to use the accent." },
    { key: "discColor", kind: "text", label: "Disc colour", hint: "Only used by the disc arrangement." },
  ],
  render: (ctx) => (
    <AvatarLayout
      ctx={ctx}
      props={{
        markColor: ctx.text("markColor") || undefined,
        discColor: ctx.text("discColor") || undefined,
      }}
    />
  ),
};

export const QUESTION_KIT: Kit = {
  layouts: ["Options", "Centred", "Two halves", "Open"],
  fields: [
    EYEBROW,
    { key: "question", kind: "textarea", label: "Question", rows: 2 },
    { key: "options", kind: "list", label: "Options", itemLabel: "Option", max: 4 },
    { key: "prompt", kind: "textarea", label: "Prompt", rows: 2 },
    ...SIGNOFF,
  ],
  render: (ctx) => (
    <QuestionLayout
      ctx={ctx}
      props={{
        eyebrow: ctx.text("eyebrow"),
        question: ctx.text("question"),
        options: ctx.list("options"),
        prompt: ctx.text("prompt"),
        footLeft: ctx.text("footLeft"),
        footRight: ctx.text("footRight"),
      }}
    />
  ),
};

export const STEPS_KIT: Kit = {
  layouts: ["Numbered", "Timeline", "Row", "Carded"],
  fields: [
    EYEBROW,
    { key: "headline", kind: "text", label: "Headline" },
    {
      key: "steps",
      kind: "list",
      label: "Steps",
      hint: "Use :: to separate a step's title from its description.",
      itemLabel: "Step",
      max: 6,
    },
    ...SIGNOFF,
  ],
  render: (ctx) => (
    <StepsLayout
      ctx={ctx}
      props={{
        eyebrow: ctx.text("eyebrow"),
        headline: ctx.text("headline"),
        steps: ctx.list("steps"),
        footLeft: ctx.text("footLeft"),
        footRight: ctx.text("footRight"),
      }}
    />
  ),
};

export const EVENT_KIT: Kit = {
  layouts: ["Stacked", "Centred", "Beside", "Ticket"],
  fields: [
    EYEBROW,
    { key: "title", kind: "text", label: "What it is" },
    { key: "date", kind: "text", label: "When" },
    { key: "detail", kind: "text", label: "Where, or at what time" },
    { key: "body", kind: "textarea", label: "Supporting line", rows: 3 },
    ...SIGNOFF,
  ],
  render: (ctx) => (
    <EventLayout
      ctx={ctx}
      props={{
        eyebrow: ctx.text("eyebrow"),
        title: ctx.text("title"),
        date: ctx.text("date"),
        detail: ctx.text("detail"),
        body: ctx.text("body"),
        footLeft: ctx.text("footLeft"),
        footRight: ctx.text("footRight"),
      }}
    />
  ),
};
