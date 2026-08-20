/**
 * A feature, a use case, a community member, a case study: something named,
 * described, and given a piece of supporting evidence.
 *
 * Arrangements:
 *   0 · stacked  — name, description, evidence card
 *   1 · card     — the whole thing inside one card
 *   2 · beside   — evidence to the right of the description
 *   3 · framed   — an accent rule above and below
 */
import { Card, Col, Display, Eyebrow, Reading, Row, Rule, Spacer, UIText } from "../primitives";
import type { Ctx } from "../types";
import { FootLine, measure } from "./common";

export type SpotlightProps = {
  eyebrow?: string;
  title: string;
  body: string;
  /** The proof: a metric, a quote fragment, a role. */
  evidenceLabel?: string;
  evidence?: string;
  footLeft?: string;
  footRight?: string;
};

export function SpotlightLayout({ ctx, props }: { ctx: Ctx; props: SpotlightProps }) {
  const { p, u, variant } = ctx;
  const fs = props.title.length > 40 ? 52 : 66;

  const evidence =
    props.evidence || props.evidenceLabel ? (
      <Card ctx={ctx} accent={variant.layout !== 1}>
        <Col gap={u(10)}>
          {props.evidenceLabel && (
            <Eyebrow ctx={ctx} size={15} color={p.accent}>
              {props.evidenceLabel}
            </Eyebrow>
          )}
          {props.evidence && (
            <UIText ctx={ctx} size={28} color={p.fgStrong} weight={500}>
              {props.evidence}
            </UIText>
          )}
        </Col>
      </Card>
    ) : null;

  // flexBasis resolves against the MAIN axis, so `flexBasis: 0` inside a column
  // zeroes the block's height and the title spills over whatever follows it.
  // The growth is only wanted in the side-by-side arrangement, where the main
  // axis is horizontal.
  const beside = variant.layout === 2;

  const core = (
    <Col
      gap={u(22)}
      style={
        beside
          ? { flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }
          : { flexShrink: 1, minWidth: 0 }
      }
    >
      <Display ctx={ctx} size={fs}>
        {props.title}
      </Display>
      <Reading ctx={ctx} size={fs * 0.34} style={{ maxWidth: measure(ctx, 0.88) }}>
        {props.body}
      </Reading>
    </Col>
  );

  const body =
    beside ? (
      <Row gap={u(36)} align="flex-start">
        {core}
        <div style={{ display: "flex", width: "36%", flexShrink: 0 }}>{evidence}</div>
      </Row>
    ) : variant.layout === 1 ? (
      <Card ctx={ctx}>
        <Col gap={u(28)}>
          {core}
          {evidence}
        </Col>
      </Card>
    ) : variant.layout === 3 ? (
      <Col gap={u(28)}>
        <Rule ctx={ctx} color={p.accent} thickness={2} />
        {core}
        {evidence}
        <Rule ctx={ctx} color={p.accent} thickness={2} />
      </Col>
    ) : (
      <Col gap={u(30)}>
        {core}
        {evidence}
      </Col>
    );

  return (
    <Col grow gap={u(30)}>
      {props.eyebrow && (
        <Eyebrow ctx={ctx} color={p.accent}>
          {props.eyebrow}
        </Eyebrow>
      )}
      <Spacer />
      {body}
      <Spacer />
      <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
    </Col>
  );
}
