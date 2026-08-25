/**
 * A small grid of equal things: features, use cases, what you get.
 *
 * Deliberately not CSS Grid — Satori has no grid implementation at all, so the
 * cells are laid out as rows of flex children with an explicit column count.
 * That constraint is also why the count is capped: past six, cells on a 1080
 * artboard are too small to set a sentence in.
 *
 * Arrangements:
 *   0 · plain     — cells divided by hairlines
 *   1 · numbered  — a mono numeral above each cell
 *   2 · carded    — each cell in its own card
 *   3 · marked    — the fleuron before each cell
 */
import { Card, Col, Display, Eyebrow, Fleuron, Row, Rule, UIText } from "../primitives";
import type { Ctx } from "../types";
import { FootLine } from "./common";

export type GridProps = {
  eyebrow?: string;
  headline?: string;
  /** "title :: description" per line; the description is optional. */
  cells: string[];
  footLeft?: string;
  footRight?: string;
};

/** Rows of `columns` cells, padded so the last row keeps its column widths. */
function chunk<T>(items: T[], columns: number): (T | null)[][] {
  const rows: (T | null)[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    const row: (T | null)[] = items.slice(i, i + columns);
    while (row.length < columns) row.push(null);
    rows.push(row);
  }
  return rows;
}

export function GridLayout({ ctx, props }: { ctx: Ctx; props: GridProps }) {
  const { p, u, variant, size } = ctx;

  const cells = props.cells
    .filter(Boolean)
    .slice(0, 6)
    .map((c) => {
      const [title, ...rest] = c.split("::");
      return { title: title.trim(), body: rest.join("::").trim() };
    });

  // A tall artboard wants one column; a wide one takes three. Four cells on a
  // square read best as two-by-two.
  const ratio = size.w / size.h;
  const columns = ratio < 0.7 ? 1 : ratio > 1.4 ? Math.min(3, cells.length) : Math.min(2, cells.length);

  const fs = cells.length > 4 ? 24 : 28;
  const rows = chunk(cells, columns);

  const cell = (c: { title: string; body: string } | null, index: number) => {
    if (!c) {
      // An empty slot keeps the last row's columns the same width as the rest.
      return <div key={`gap-${index}`} style={{ display: "flex", flexGrow: 1, flexShrink: 1, flexBasis: 0 }} />;
    }

    const inner = (
      <Col gap={u(10)} style={{ flexShrink: 1, minWidth: 0 }}>
        {variant.layout === 1 && (
          <Eyebrow ctx={ctx} size={fs * 0.6} color={p.accent}>
            {String(index + 1).padStart(2, "0")}
          </Eyebrow>
        )}
        {variant.layout === 3 && <Fleuron ctx={ctx} size={fs * 0.9} />}
        <UIText ctx={ctx} size={fs} weight={500} color={p.fgStrong}>
          {c.title}
        </UIText>
        {c.body && (
          <UIText ctx={ctx} size={fs * 0.76} color={p.fgMuted}>
            {c.body}
          </UIText>
        )}
      </Col>
    );

    if (variant.layout === 2) {
      return (
        <Card key={index} ctx={ctx} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }}>
          {inner}
        </Card>
      );
    }

    return (
      <div
        key={index}
        style={{ display: "flex", flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }}
      >
        {inner}
      </div>
    );
  };

  return (
    <Col grow gap={u(32)}>
      {props.eyebrow && <Eyebrow ctx={ctx} color={p.accent}>{props.eyebrow}</Eyebrow>}
      {props.headline && <Display ctx={ctx} size={48}>{props.headline}</Display>}

      <Col gap={u(variant.layout === 2 ? 18 : 26)} grow justify="center">
        {rows.map((row, r) => (
          <Col key={r} gap={u(26)}>
            {r > 0 && variant.layout === 0 && <Rule ctx={ctx} color={p.borderSoft} />}
            <Row gap={u(variant.layout === 2 ? 18 : 32)} align="flex-start">
              {row.map((c, i) => cell(c, r * columns + i))}
            </Row>
          </Col>
        ))}
      </Col>

      <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
    </Col>
  );
}
