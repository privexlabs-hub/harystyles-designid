/**
 * Something happening at a time and a place: launches, events, countdowns,
 * webinars, milestones with a date attached.
 *
 * The date is the load-bearing element, so it is set in the display face and
 * given its own line — never buried in a sentence.
 *
 * Arrangements:
 *   0 · stacked  — title, then date block
 *   1 · centred  — invitation-like, everything centred
 *   2 · beside   — date to the left, details to the right
 *   3 · ticket   — details inside a ruled block, like a stub
 */
import { Col, Display, Eyebrow, Reading, Row, Rule, Spacer, UIText } from "../primitives";
import type { Ctx } from "../types";
import { FootLine, measure } from "./common";

export type EventProps = {
  eyebrow?: string;
  title: string;
  date: string;
  detail?: string;
  body?: string;
  footLeft?: string;
  footRight?: string;
};

export function EventLayout({ ctx, props }: { ctx: Ctx; props: EventProps }) {
  const { p, u, variant } = ctx;
  const centred = variant.layout === 1;
  const align = centred ? "center" : "left";
  const fs = props.title.length > 40 ? 58 : 74;

  const dateBlock = (
    <Col gap={u(8)} align={centred ? "center" : undefined}>
      <Display ctx={ctx} size={fs * 0.6} color={p.accent} align={align}>
        {props.date}
      </Display>
      {props.detail && (
        <Eyebrow ctx={ctx} size={17} color={p.fgSubtle} align={align}>
          {props.detail}
        </Eyebrow>
      )}
    </Col>
  );

  // Only the "beside" arrangement lays these out along a horizontal main axis;
  // a zero basis anywhere else collapses the block's height.
  const beside = variant.layout === 2;

  const details = (
    <Col
      gap={u(20)}
      align={centred ? "center" : undefined}
      style={
        beside
          ? { flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }
          : { flexShrink: 1, minWidth: 0 }
      }
    >
      <Display ctx={ctx} size={fs} align={align}>
        {props.title}
      </Display>
      {props.body && (
        <Reading ctx={ctx} size={fs * 0.32} align={align} style={{ maxWidth: measure(ctx, 0.84) }}>
          {props.body}
        </Reading>
      )}
    </Col>
  );

  const body =
    beside ? (
      <Row gap={u(44)} align="flex-start">
        {dateBlock}
        <div style={{ display: "flex", width: Math.max(1, u(1)), alignSelf: "stretch", backgroundColor: p.borderSoft }} />
        {details}
      </Row>
    ) : variant.layout === 3 ? (
      <Col gap={u(26)}>
        <Rule ctx={ctx} color={p.accent} thickness={2} />
        {details}
        <Rule ctx={ctx} color={p.borderSoft} />
        {dateBlock}
        <Rule ctx={ctx} color={p.accent} thickness={2} />
      </Col>
    ) : (
      <Col gap={u(34)} align={centred ? "center" : undefined}>
        {details}
        {dateBlock}
      </Col>
    );

  return (
    <Col grow gap={u(30)} justify={centred ? "center" : undefined}>
      {props.eyebrow && (
        <Eyebrow ctx={ctx} color={p.accent} align={align}>
          {props.eyebrow}
        </Eyebrow>
      )}
      {!centred && <Spacer />}
      {body}
      {!centred && <Spacer />}
      <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
    </Col>
  );
}
