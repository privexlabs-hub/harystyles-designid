/**
 * The workhorse layout: an eyebrow, a display headline, supporting copy and a
 * sign-off. Announcements, launches, updates, blog promos and hot takes are all
 * this shape with different words.
 *
 * Four arrangements, selected by `variant.layout`:
 *   0 · bottom    — headline anchored to the foot, the editorial default
 *   1 · centred   — everything centred, for a poster feel
 *   2 · top       — headline first, supporting copy below
 *   3 · rule      — headline split from the supporting copy by a hairline
 */
import { Col, Display, Eyebrow, Reading, Rule, Spacer } from "../primitives";
import type { Ctx } from "../types";
import { FootLine, splitEmphasis, measure } from "./common";

export type HeadlineProps = {
  eyebrow?: string;
  /** A `|` marks where the accent italic clause begins. */
  headline: string;
  body?: string;
  footLeft?: string;
  footRight?: string;
  /** Overrides the size the layout would pick from the artboard. */
  headlineSize?: number;
};

/**
 * Headline size is derived from the artboard rather than fixed, because the same
 * layout serves a 1080 square and a 600px email block. Long copy steps down —
 * a headline that overflows its artboard is worse than one set slightly smaller.
 */
export function headlineSizeFor(ctx: Ctx, text: string): number {
  const base = ctx.size.h >= 1600 ? 96 : ctx.size.h <= 400 ? 56 : 84;
  if (text.length > 110) return base * 0.6;
  if (text.length > 70) return base * 0.74;
  if (text.length > 45) return base * 0.87;
  return base;
}

export function HeadlineLayout({ ctx, props }: { ctx: Ctx; props: HeadlineProps }) {
  const { p, u, variant } = ctx;
  const [lead, emphasis] = splitEmphasis(props.headline);
  const fs = props.headlineSize ?? headlineSizeFor(ctx, props.headline);
  const centred = variant.layout === 1;
  const align = centred ? "center" : "left";

  const heading = (
    <Col gap={0} align={centred ? "center" : undefined}>
      <Display ctx={ctx} size={fs} align={align}>
        {lead}
      </Display>
      {emphasis ? (
        <Display ctx={ctx} size={fs} align={align} italic color={p.accent}>
          {emphasis}
        </Display>
      ) : null}
    </Col>
  );

  const supporting = props.body ? (
    <Reading ctx={ctx} size={fs * 0.29} align={align} style={{ maxWidth: measure(ctx, centred ? 0.88 : 0.76) }}>
      {props.body}
    </Reading>
  ) : null;

  const eyebrow = props.eyebrow ? (
    <Eyebrow ctx={ctx} align={align} color={p.accent}>
      {props.eyebrow}
    </Eyebrow>
  ) : null;

  // Layout 2 leads with the headline; the rest lead with the eyebrow.
  const stack =
    variant.layout === 2 ? (
      <Col gap={u(26)} align={centred ? "center" : undefined}>
        {heading}
        {eyebrow}
        {supporting}
      </Col>
    ) : variant.layout === 3 ? (
      <Col gap={u(30)} align={centred ? "center" : undefined}>
        {eyebrow}
        {heading}
        <Rule ctx={ctx} color={p.accent} width={u(120)} thickness={2} />
        {supporting}
      </Col>
    ) : (
      <Col gap={u(26)} align={centred ? "center" : undefined}>
        {eyebrow}
        {heading}
        {supporting}
      </Col>
    );

  return (
    <Col grow gap={u(32)} justify={centred ? "center" : undefined}>
      {!centred && variant.layout !== 2 && <Spacer />}
      {stack}
      {!centred && <Spacer />}
      <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
    </Col>
  );
}
