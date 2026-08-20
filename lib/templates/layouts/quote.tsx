/**
 * A quote, set the way the product sets a pull quote: display italic, a
 * hairline or a fleuron to open it, attribution beneath.
 *
 * Used by customer quotes, testimonials, manifesto lines and opinion posts.
 *
 * Arrangements:
 *   0 · fleuron  — the ❦ opens the quote
 *   1 · rule     — an accent rule down the left edge, as in the reader
 *   2 · centred  — centred, no mark
 *   3 · card     — the quote inside a card, attribution outside it
 */
import { Card, Col, Display, Fleuron, Initial, Row, Rule, Spacer, UIText } from "../primitives";
import type { Ctx } from "../types";
import { FootLine } from "./common";

export type QuoteProps = {
  quote: string;
  attribution?: string;
  detail?: string;
  /** Drives the initial's colour, matching how the product colours a writer. */
  hue?: number;
  footLeft?: string;
  footRight?: string;
};

function quoteSizeFor(ctx: Ctx, text: string): number {
  const base = ctx.size.h >= 1600 ? 78 : ctx.size.h <= 500 ? 40 : 62;
  if (text.length > 220) return base * 0.58;
  if (text.length > 140) return base * 0.72;
  if (text.length > 90) return base * 0.86;
  return base;
}

export function QuoteLayout({ ctx, props }: { ctx: Ctx; props: QuoteProps }) {
  const { p, u, variant } = ctx;
  const fs = quoteSizeFor(ctx, props.quote);
  const centred = variant.layout === 2;

  const quote = (
    <Display
      ctx={ctx}
      size={fs}
      italic
      align={centred ? "center" : "left"}
      color={p.fgStrong}
      style={{ lineHeight: 1.24 }}
    >
      {`“${props.quote}”`}
    </Display>
  );

  const attribution = props.attribution ? (
    <Row gap={u(18)} align="center" justify={centred ? "center" : undefined}>
      {variant.layout !== 2 && (
        <Initial ctx={ctx} name={props.attribution} size={fs * 0.9} hue={props.hue ?? 25} />
      )}
      <Col gap={u(4)}>
        <UIText ctx={ctx} size={fs * 0.32} weight={500} color={p.fg}>
          {props.attribution}
        </UIText>
        {props.detail && (
          <UIText ctx={ctx} size={fs * 0.26} color={p.fgFaint}>
            {props.detail}
          </UIText>
        )}
      </Col>
    </Row>
  ) : null;

  const body =
    variant.layout === 1 ? (
      <Row gap={u(34)} align="stretch">
        <div
          style={{
            display: "flex",
            width: Math.max(2, u(3)),
            backgroundColor: p.accent,
          }}
        />
        <Col gap={u(36)} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }}>
          {quote}
          {attribution}
        </Col>
      </Row>
    ) : variant.layout === 3 ? (
      <Col gap={u(30)}>
        <Card ctx={ctx}>{quote}</Card>
        {attribution}
      </Col>
    ) : (
      <Col gap={u(30)} align={centred ? "center" : undefined}>
        {variant.layout === 0 && <Fleuron ctx={ctx} size={fs * 0.8} />}
        {quote}
        <Rule ctx={ctx} color={p.borderSoft} width={centred ? "40%" : "28%"} />
        {attribution}
      </Col>
    );

  return (
    <Col grow gap={u(30)} justify={centred ? "center" : undefined}>
      {!centred && <Spacer />}
      {body}
      {!centred && <Spacer />}
      <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
    </Col>
  );
}
