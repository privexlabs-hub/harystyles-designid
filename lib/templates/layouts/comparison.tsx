/**
 * Us against the alternative, drawn as two columns of ticks and crosses.
 *
 * The brand's version of this is quiet: the other column is never mocked, it
 * simply lacks the rows we care about. Labels stay factual.
 *
 * Arrangements:
 *   0 · columns  — two columns, rows aligned
 *   1 · rows     — one row per point, ours on the right
 *   2 · carded   — each column in a card, ours accented
 *   3 · stacked  — for narrow artboards: theirs, then ours
 */
import { Card, Col, Display, Eyebrow, Row, Rule, UIText } from "../primitives";
import type { Ctx } from "../types";
import { FootLine } from "./common";

export type ComparisonProps = {
  eyebrow?: string;
  headline: string;
  oursLabel: string;
  theirsLabel: string;
  /** One point per line. The same list is answered by both columns. */
  points: string[];
  footLeft?: string;
  footRight?: string;
};

export function ComparisonLayout({ ctx, props }: { ctx: Ctx; props: ComparisonProps }) {
  const { p, u, variant, size } = ctx;
  const points = props.points.filter(Boolean);
  const fs = points.length > 5 ? 22 : 26;
  const narrow = size.w / size.h < 0.8;
  const stacked = variant.layout === 3 || (variant.layout === 0 && narrow);

  const mark = (yes: boolean) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: u(fs * 1.5),
        fontFamily: "inherit",
        fontSize: u(fs),
        color: yes ? p.accent : p.fgFaint,
      }}
    >
      {yes ? "✓" : "✗"}
    </div>
  );

  if (stacked) {
    const column = (label: string, yes: boolean) => (
      <Col gap={u(16)}>
        <Eyebrow ctx={ctx} size={16} color={yes ? p.accent : p.fgFaint}>
          {label}
        </Eyebrow>
        <Col gap={u(12)}>
          {points.map((pt, i) => (
            <Row key={i} gap={u(14)} align="center">
              {mark(yes)}
              <UIText ctx={ctx} size={fs} color={yes ? p.fg : p.fgFaint} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }}>
                {pt}
              </UIText>
            </Row>
          ))}
        </Col>
      </Col>
    );
    return (
      <Col grow gap={u(32)}>
        {props.eyebrow && <Eyebrow ctx={ctx} color={p.accent}>{props.eyebrow}</Eyebrow>}
        <Display ctx={ctx} size={48}>{props.headline}</Display>
        {column(props.theirsLabel, false)}
        <Rule ctx={ctx} color={p.borderSoft} />
        {column(props.oursLabel, true)}
        <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
      </Col>
    );
  }

  const table = (
    <Col gap={u(18)}>
      <Row gap={u(24)}>
        <div style={{ display: "flex", flexGrow: 1, flexShrink: 1, flexBasis: 0 }} />
        <Eyebrow ctx={ctx} size={15} color={p.fgFaint}>{props.theirsLabel}</Eyebrow>
        <Eyebrow ctx={ctx} size={15} color={p.accent}>{props.oursLabel}</Eyebrow>
      </Row>
      {points.map((pt, i) => (
        <Col key={i} gap={u(14)}>
          <Rule ctx={ctx} color={p.borderSoft} />
          <Row gap={u(24)} align="center">
            <UIText ctx={ctx} size={fs} color={p.fg} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }}>
              {pt}
            </UIText>
            {mark(false)}
            {mark(true)}
          </Row>
        </Col>
      ))}
    </Col>
  );

  return (
    <Col grow gap={u(32)}>
      {props.eyebrow && <Eyebrow ctx={ctx} color={p.accent}>{props.eyebrow}</Eyebrow>}
      <Display ctx={ctx} size={48}>{props.headline}</Display>
      {variant.layout === 2 ? <Card ctx={ctx} accent>{table}</Card> : table}
      <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
    </Col>
  );
}
