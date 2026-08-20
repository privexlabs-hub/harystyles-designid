/**
 * A single number, given the room a number deserves.
 *
 * Used by big-stat cards, milestones, data posts and proof panels. The figure
 * is set in the display face at tabular figures so a row of them lines up.
 *
 * Arrangements:
 *   0 · stacked   — figure over label, left aligned
 *   1 · centred   — figure centred, the poster treatment
 *   2 · beside    — figure and label side by side, for wide artboards
 *   3 · framed    — figure inside a ruled card
 */
import { Card, Col, Display, Eyebrow, Reading, Row, Spacer } from "../primitives";
import type { Ctx } from "../types";
import { FootLine, measure } from "./common";

export type StatProps = {
  eyebrow?: string;
  figure: string;
  label: string;
  body?: string;
  footLeft?: string;
  footRight?: string;
};

function figureSizeFor(ctx: Ctx, figure: string): number {
  const base = ctx.size.h >= 1600 ? 260 : ctx.size.h <= 500 ? 120 : 220;
  if (figure.length > 8) return base * 0.55;
  if (figure.length > 5) return base * 0.72;
  if (figure.length > 3) return base * 0.86;
  return base;
}

export function StatLayout({ ctx, props }: { ctx: Ctx; props: StatProps }) {
  const { p, u, variant } = ctx;
  const fs = figureSizeFor(ctx, props.figure);
  const centred = variant.layout === 1;
  const align = centred ? "center" : "left";

  const figure = (
    <Display
      ctx={ctx}
      size={fs}
      color={p.accent}
      align={align}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {props.figure}
    </Display>
  );

  const label = (
    <Display ctx={ctx} size={fs * 0.2} align={align} color={p.fgStrong}>
      {props.label}
    </Display>
  );

  const body = props.body ? (
    <Reading ctx={ctx} size={fs * 0.115} align={align} style={{ maxWidth: measure(ctx, 0.8) }}>
      {props.body}
    </Reading>
  ) : null;

  const core =
    variant.layout === 2 ? (
      <Row gap={u(40)} align="center">
        {figure}
        <Col gap={u(14)} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }}>
          {label}
          {body}
        </Col>
      </Row>
    ) : variant.layout === 3 ? (
      <Card ctx={ctx} accent>
        <Col gap={u(18)} align={centred ? "center" : undefined}>
          {figure}
          {label}
          {body}
        </Col>
      </Card>
    ) : (
      <Col gap={u(18)} align={centred ? "center" : undefined}>
        {figure}
        {label}
        {body}
      </Col>
    );

  return (
    <Col grow gap={u(30)} justify={centred ? "center" : undefined}>
      {props.eyebrow && (
        <Eyebrow ctx={ctx} align={align} color={p.accent}>
          {props.eyebrow}
        </Eyebrow>
      )}
      {!centred && <Spacer />}
      {core}
      {!centred && <Spacer />}
      <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
    </Col>
  );
}
