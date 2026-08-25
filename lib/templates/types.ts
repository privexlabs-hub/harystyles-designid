/**
 * The template contract.
 *
 * A template is authored once as a function returning a React element tree.
 * That tree is handed to React DOM for the live preview and to Satori for the
 * export, so preview and output cannot describe different designs.
 *
 * The cost is that templates are written against Satori's CSS subset — see
 * lib/satori/constraints.ts for what that excludes.
 */
import type { ReactElement } from "react";
import type { AccentId, Palette, ThemeId } from "./theme";
import type { Size } from "./sizes";

export const CATEGORIES = [
  "square",
  "engagement",
  "carousel",
  "vertical",
  "portrait",
  "youtube",
  "cover",
  "avatar",
  "ads",
  "email",
  "web",
  "document",
] as const;
export type CategoryId = (typeof CATEGORIES)[number];

export const CATEGORY_META: Record<CategoryId, { label: string; blurb: string }> = {
  square: { label: "Square", blurb: "The everyday feed post. 1080×1080." },
  engagement: { label: "Engagement", blurb: "Posts that ask something of the reader. 1080×1080." },
  carousel: { label: "Carousel", blurb: "Ten slides that carry one argument. 1080×1080." },
  vertical: { label: "Vertical", blurb: "Stories and Reels. 1080×1920, with a safe area." },
  portrait: { label: "Portrait", blurb: "The taller feed post. 1080×1350." },
  youtube: { label: "YouTube", blurb: "Thumbnails that read at 210px wide. 1280×720." },
  cover: { label: "Covers & banners", blurb: "One shape per platform, each with its own crop." },
  avatar: { label: "Avatar", blurb: "The mark, in every colourway. 400×400." },
  ads: { label: "Ads", blurb: "Paid placements across three shapes." },
  email: { label: "Email", blurb: "600px-wide blocks for the newsletter." },
  web: { label: "Web", blurb: "Hero art, share cards and page banners." },
  document: { label: "Documents", blurb: "Print pages at 300 dpi — notebooks, letters, press kits." },
};

// ---------------------------------------------------------------- variation

export const BACKGROUNDS = ["flat", "lamp", "grain", "rule", "gradient"] as const;
export type BackgroundId = (typeof BACKGROUNDS)[number];

export const BACKGROUND_LABELS: Record<BackgroundId, string> = {
  flat: "Flat",
  lamp: "Lamplight",
  grain: "Grain",
  rule: "Ruled frame",
  gradient: "Gradient",
};

export const LOCKUPS = ["wordmark", "mark", "stamp", "tagline", "none"] as const;
export type LockupId = (typeof LOCKUPS)[number];

export const LOCKUP_LABELS: Record<LockupId, string> = {
  wordmark: "Mark + wordmark",
  mark: "Mark only",
  stamp: "Stamp",
  tagline: "Wordmark + tagline",
  none: "None",
};

export const CORNERS = ["top-left", "top-right", "bottom-left", "bottom-right"] as const;
export type CornerId = (typeof CORNERS)[number];

export const DENSITIES = ["comfortable", "compact"] as const;
export type DensityId = (typeof DENSITIES)[number];

/** The axes every template answers to. Changing one updates all 150 at once. */
export type Variant = {
  theme: ThemeId;
  accent: AccentId;
  background: BackgroundId;
  lockup: LockupId;
  corner: CornerId;
  density: DensityId;
  /** Index into the template's own `layouts` list. */
  layout: number;
};

export const DEFAULT_VARIANT: Variant = {
  theme: "ink",
  accent: "amber",
  background: "flat",
  lockup: "wordmark",
  corner: "top-left",
  density: "comfortable",
  layout: 0,
};

// ---------------------------------------------------------------- fields

export type FieldDef =
  | { key: string; kind: "text"; label: string; hint?: string; max?: number }
  | { key: string; kind: "textarea"; label: string; hint?: string; max?: number; rows?: number }
  | { key: string; kind: "number"; label: string; hint?: string; min?: number; max?: number }
  | { key: string; kind: "select"; label: string; hint?: string; options: { value: string; label: string }[] }
  | { key: string; kind: "toggle"; label: string; hint?: string }
  | { key: string; kind: "list"; label: string; hint?: string; itemLabel: string; max: number }
  | { key: string; kind: "image"; label: string; hint?: string };

export type FieldValue = string | number | boolean | string[];
export type FieldValues = Record<string, FieldValue>;

// ---------------------------------------------------------------- render

/**
 * What a template's render function is given.
 *
 * `u` is the scale unit: it converts a measurement authored against a 1080
 * artboard into the current one, so a single layout serves a 1080×1080 post, a
 * 400×400 avatar and a 2560×1440 channel banner without three sets of numbers.
 */
export type Ctx = {
  p: Palette;
  size: Size;
  variant: Variant;
  /** Scale a 1080-grid measurement to this artboard. */
  u: (n: number) => number;
  /** The artboard's content area, inside the margin. */
  inner: { w: number; h: number };
  /**
   * A source for an <img>, or "" when the field is empty.
   *
   * Deliberately opaque: the DOM preview is handed object URLs and the exporter
   * data URIs, because each engine can only draw one of those — but the element
   * tree is identical either way, which is what keeps preview and export honest.
   */
  image: (key: string) => string;
  /** Field accessors, typed at the call site and never undefined. */
  text: (key: string) => string;
  num: (key: string) => number;
  bool: (key: string) => boolean;
  list: (key: string) => string[];
};

export type TemplateDef = {
  id: string;
  category: CategoryId;
  name: string;
  /** What this template is for, shown in the library. */
  blurb: string;
  /** The shapes it can be produced at. The first is the default. */
  sizes: Size[];
  /** Named layout arrangements; `variant.layout` indexes this. */
  layouts: string[];
  fields: FieldDef[];
  defaults: FieldValues;
  /** Variant defaults this template prefers over DEFAULT_VARIANT. */
  variantDefaults?: Partial<Variant>;
  /** Carousels render this many slides; everything else renders one. */
  slides?: number;
  render: (ctx: Ctx, slide: number) => ReactElement;
};

export type { Palette, ThemeId, AccentId, Size };
