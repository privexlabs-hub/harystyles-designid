/**
 * Two halves in tension: problem and solution, before and after, us and them,
 * myth and fact. The shape carries the argument, so the labels above each half
 * do the work and the copy stays short.
 *
 * Arrangements:
 *   0 · stacked   — one above the other, divided by a rule
 *   1 · side      — side by side, for wide artboards
 *   2 · weighted  — the second half given the accent and more room
 *   3 · carded    — each half in its own card
 */
import { Card, Col, Display, Eyebrow, Row, Rule, UIText } from "../primitives";
import type { Ctx } from "../types";
import { FootLine } from "./common";

export type SplitProps = {
  eyebrow?: string;
  headline?: string;
  leftLabel: string;
  leftBody: string;
  rightLabel: string;
  rightBody: string;
  footLeft?: string;
  footRight?: string;
};

export function SplitLayout({ ctx, props }: { ctx: Ctx; props: SplitProps }) {
  const { p, u, variant, size } = ctx;
  // Side-by-side needs width; on a story or a portrait it would give each half
  // a column too narrow to set type in, so the arrangement is overridden.
  const side = variant.layout === 1 && size.w / size.h > 0.8;
  const weighted = variant.layout === 2;
  const carded = variant.layout === 3;

  const half = (label: string, body: string, emphasis: boolean) => {
    const content = (
      <Col gap={u(16)} grow={side}>
        <Eyebrow ctx={ctx} size={16} color={emphasis ? p.accent : p.fgFaint}>
          {label}
        </Eyebrow>
        <Display
          ctx={ctx}
          size={weighted && emphasis ? 46 : 40}
          color={emphasis ? p.fgStrong : p.fgMuted}
          italic={weighted && emphasis}
        >
          {body}
        </Display>
      </Col>
    );
    return carded ? (
      <Card ctx={ctx} accent={emphasis} style={side ? { flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 } : undefined}>
        {content}
      </Card>
    ) : (
      content
    );
  };

  const left = half(props.leftLabel, props.leftBody, false);
  const right = half(props.rightLabel, props.rightBody, true);

  const body = side ? (
    <Row gap={u(40)} align="stretch" grow>
      {left}
      {!carded && (
        <div style={{ display: "flex", width: Math.max(1, u(1)), backgroundColor: p.borderSoft }} />
      )}
      {right}
    </Row>
  ) : (
    <Col gap={u(36)} grow justify="center">
      {left}
      {!carded && <Rule ctx={ctx} color={p.borderSoft} />}
      {right}
    </Col>
  );

  return (
    <Col grow gap={u(34)}>
      {props.eyebrow && (
        <Eyebrow ctx={ctx} color={p.accent}>
          {props.eyebrow}
        </Eyebrow>
      )}
      {props.headline && (
        <Display ctx={ctx} size={52}>
          {props.headline}
        </Display>
      )}
      {body}
      <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
    </Col>
  );
}
