/**
 * Shared pieces used by more than one layout.
 */
import { FONT_STACK } from "@/lib/satori/fonts";
import { Col, Dot, Eyebrow, Row, Rule, UIText } from "../primitives";
import type { Ctx } from "../types";

/** The footer line: a handle, a rule, and whatever the artboard wants to sign off with. */
export function FootLine({
  ctx,
  left,
  right,
}: {
  ctx: Ctx;
  left?: string;
  right?: string;
}) {
  if (!left && !right) return null;
  return (
    <Col gap={ctx.u(18)}>
      <Rule ctx={ctx} color={ctx.p.borderSoft} />
      <Row justify="space-between" align="center">
        <Eyebrow ctx={ctx} size={14} color={ctx.p.fgFaint}>
          {left ?? ""}
        </Eyebrow>
        {right ? (
          <Eyebrow ctx={ctx} size={14} color={ctx.p.accent}>
            {right}
          </Eyebrow>
        ) : null}
      </Row>
    </Col>
  );
}

/** "● THE LAMP IS LIT" — the brand's status line. */
export function LitLine({ ctx, children }: { ctx: Ctx; children: string }) {
  return (
    <Row gap={ctx.u(12)} align="center">
      <Dot ctx={ctx} size={12} />
      <Eyebrow ctx={ctx} size={15} color={ctx.p.accent}>
        {children}
      </Eyebrow>
    </Row>
  );
}

/**
 * Splits a headline at the `|` that marks where the accent italic clause begins.
 *
 * Templates express this as one field so the editor stays a single input rather
 * than asking a writer to think about spans.
 *
 * The two halves are always set on separate lines. That is how the brand sets
 * them — "Letters, / not posts." — and it is also the only arrangement the two
 * renderers agree on: as inline siblings, the DOM wraps at the span boundary
 * and Satori runs them together without even a space.
 */
export function splitEmphasis(value: string): [string, string | null] {
  const at = value.indexOf("|");
  if (at === -1) return [value.trim(), null];
  return [value.slice(0, at).trim(), value.slice(at + 1).trim()];
}

/** A caption pinned under a block, in the UI face. */
export function Caption({ ctx, children }: { ctx: Ctx; children: string }) {
  return (
    <UIText ctx={ctx} size={20} color={ctx.p.fgFaint}>
      {children}
    </UIText>
  );
}

/** Numerals want tabular figures wherever they are compared. */
export const TABULAR = {
  fontFamily: FONT_STACK.mono,
  fontVariantNumeric: "tabular-nums",
} as const;

/**
 * A measure, in pixels rather than a percentage.
 *
 * A percentage max-width resolves against the containing block, and inside an
 * auto-sized flex column the browser and yoga do not always agree on what that
 * block is — enough to wrap a paragraph one word differently between the
 * preview and the export. Resolving against the artboard's own content width
 * removes the ambiguity.
 */
export const measure = (ctx: Ctx, fraction: number) => Math.round(ctx.inner.w * fraction);
