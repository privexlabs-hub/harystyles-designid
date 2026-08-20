/**
 * Renders a template to a React element tree.
 *
 * This is the single entry point both renderers go through — React DOM for the
 * preview, Satori for the export — so there is no way for the two to disagree
 * about what a template is.
 */
import type { ReactElement } from "react";
import { Artboard } from "./Artboard";
import { makeCtx } from "./context";
import { DEFAULT_VARIANT, type FieldValues, type TemplateDef, type Variant } from "./types";
import type { Size } from "./sizes";

export type RenderRequest = {
  template: TemplateDef;
  size?: Size;
  variant?: Partial<Variant>;
  values?: FieldValues;
  /** Which slide of a carousel. Ignored by everything else. */
  slide?: number;
};

export function resolveVariant(template: TemplateDef, override?: Partial<Variant>): Variant {
  return { ...DEFAULT_VARIANT, ...template.variantDefaults, ...override };
}

export function renderTemplate({
  template,
  size,
  variant,
  values,
  slide = 0,
}: RenderRequest): ReactElement {
  const resolvedSize = size ?? template.sizes[0];
  const resolvedVariant = resolveVariant(template, variant);

  // A layout index left over from a template with more arrangements would
  // silently fall through to the default branch; clamp it instead.
  const layout = Math.min(resolvedVariant.layout, Math.max(0, template.layouts.length - 1));

  const ctx = makeCtx({
    size: resolvedSize,
    variant: { ...resolvedVariant, layout },
    values: { ...template.defaults, ...values },
  });

  return <Artboard ctx={ctx}>{template.render(ctx, slide)}</Artboard>;
}
