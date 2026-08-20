/**
 * The template catalog.
 *
 * Everything the editor knows about is registered here. Ids are stable, because
 * they end up in exported filenames.
 */
import { SQUARE_TEMPLATES } from "./catalog/square";
import { ENGAGEMENT_TEMPLATES } from "./catalog/engagement";
import { CAROUSEL_TEMPLATES } from "./catalog/carousel";
import { VERTICAL_TEMPLATES } from "./catalog/vertical";
import { PORTRAIT_TEMPLATES } from "./catalog/portrait";
import { YOUTUBE_TEMPLATES } from "./catalog/youtube";
import { COVER_TEMPLATES } from "./catalog/cover";
import { AVATAR_TEMPLATES } from "./catalog/avatar";
import { ADS_TEMPLATES } from "./catalog/ads";
import { EMAIL_TEMPLATES } from "./catalog/email";
import { WEB_TEMPLATES } from "./catalog/web";
import { CATEGORIES, type CategoryId, type TemplateDef } from "./types";

/** Declaration order is the order the library shows them in. */
export const TEMPLATES: TemplateDef[] = [
  ...SQUARE_TEMPLATES,
  ...ENGAGEMENT_TEMPLATES,
  ...CAROUSEL_TEMPLATES,
  ...VERTICAL_TEMPLATES,
  ...PORTRAIT_TEMPLATES,
  ...YOUTUBE_TEMPLATES,
  ...COVER_TEMPLATES,
  ...AVATAR_TEMPLATES,
  ...ADS_TEMPLATES,
  ...EMAIL_TEMPLATES,
  ...WEB_TEMPLATES,
];

/** Guards against two catalog files claiming the same id. */
const duplicates = TEMPLATES.map((t) => t.id).filter((id, i, all) => all.indexOf(id) !== i);
if (duplicates.length) {
  throw new Error(`Duplicate template ids: ${[...new Set(duplicates)].join(", ")}`);
}

const byId = new Map(TEMPLATES.map((t) => [t.id, t]));

export function getTemplate(id: string): TemplateDef | undefined {
  return byId.get(id);
}

export function templatesIn(category: CategoryId): TemplateDef[] {
  return TEMPLATES.filter((t) => t.category === category);
}

/** Categories that actually have templates, in declaration order. */
export function populatedCategories(): CategoryId[] {
  return CATEGORIES.filter((c) => TEMPLATES.some((t) => t.category === c));
}
