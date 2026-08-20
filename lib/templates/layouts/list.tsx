/**
 * A titled list: tips, checklists, takeaways, what-you-get, FAQ answers.
 *
 * Items are drawn with the fleuron rather than a disc, because the fleuron is
 * the brand's bullet and Satori draws no list markers at all.
 *
 * Arrangements:
 *   0 · fleuron   — ❦ before each item
 *   1 · numbered  — mono numerals, for ordered steps
 *   2 · ruled     — items divided by hairlines, no marker
 *   3 · carded    — the list inside a card
 */
import { Card, Col, Display, Eyebrow, Fleuron, Row, Rule, UIText } from "../primitives";
import type { Ctx } from "../types";
import { FootLine } from "./common";

export type ListProps = {
  eyebrow?: string;
  headline: string;
  items: string[];
  footLeft?: string;
  footRight?: string;
};

export function ListLayout({ ctx, props }: { ctx: Ctx; props: ListProps }) {
  const { p, u, variant } = ctx;
  const items = props.items.filter(Boolean);

  // More items means smaller type — a list that overruns its artboard is worse
  // than one set a size down.
  const itemSize = items.length > 7 ? 24 : items.length > 5 ? 28 : 32;

  const rows = items.map((item, i) => (
    <Col key={i} gap={u(14)}>
      {variant.layout === 2 && i > 0 && <Rule ctx={ctx} color={p.borderSoft} />}
      <Row gap={u(18)} align="flex-start">
        {variant.layout === 0 && <Fleuron ctx={ctx} size={itemSize} />}
        {variant.layout === 1 && (
          <Eyebrow ctx={ctx} size={itemSize * 0.62} color={p.accent}>
            {String(i + 1).padStart(2, "0")}
          </Eyebrow>
        )}
        <UIText ctx={ctx} size={itemSize} color={p.fg} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }}>
          {item}
        </UIText>
      </Row>
    </Col>
  ));

  const list = <Col gap={u(variant.layout === 2 ? 20 : 24)}>{rows}</Col>;

  return (
    <Col grow gap={u(34)}>
      {props.eyebrow && (
        <Eyebrow ctx={ctx} color={p.accent}>
          {props.eyebrow}
        </Eyebrow>
      )}
      <Display ctx={ctx} size={54}>
        {props.headline}
      </Display>
      {variant.layout === 3 ? <Card ctx={ctx}>{list}</Card> : list}
      <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
    </Col>
  );
}
