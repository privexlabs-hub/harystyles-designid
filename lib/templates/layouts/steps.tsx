/**
 * How something works, in ordered stages.
 *
 * Numerals are mono and tabular so the column stays straight, and each step
 * gets a title and one line — a step that needs a paragraph is two steps.
 *
 * Arrangements:
 *   0 · numbered  — numerals down the left
 *   1 · timeline  — numerals on a vertical rule
 *   2 · row       — steps side by side, for wide artboards
 *   3 · carded    — each step in its own card
 */
import { Card, Col, Display, Eyebrow, Row, UIText } from "../primitives";
import type { Ctx } from "../types";
import { FootLine } from "./common";

export type StepsProps = {
  eyebrow?: string;
  headline: string;
  /** "Title :: description" per line; the description is optional. */
  steps: string[];
  footLeft?: string;
  footRight?: string;
};

export function StepsLayout({ ctx, props }: { ctx: Ctx; props: StepsProps }) {
  const { p, u, variant, size } = ctx;
  const steps = props.steps.filter(Boolean).map((s) => {
    const [title, ...rest] = s.split("::");
    return { title: title.trim(), body: rest.join("::").trim() };
  });

  const row = variant.layout === 2 && size.w / size.h > 0.9;
  const fs = steps.length > 4 ? 26 : 32;

  const step = (s: { title: string; body: string }, i: number) => {
    const inner = (
      <Col gap={u(10)} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }}>
        <Eyebrow ctx={ctx} size={fs * 0.55} color={p.accent}>
          {String(i + 1).padStart(2, "0")}
        </Eyebrow>
        <UIText ctx={ctx} size={fs} weight={500} color={p.fgStrong}>
          {s.title}
        </UIText>
        {s.body && (
          <UIText ctx={ctx} size={fs * 0.74} color={p.fgMuted}>
            {s.body}
          </UIText>
        )}
      </Col>
    );

    if (variant.layout === 3) {
      return (
        <Card key={i} ctx={ctx} style={row ? { flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 } : undefined}>
          {inner}
        </Card>
      );
    }

    if (variant.layout === 1) {
      return (
        <Row key={i} gap={u(24)} align="stretch">
          <div style={{ display: "flex", width: Math.max(1, u(2)), backgroundColor: p.accentSoft }} />
          {inner}
        </Row>
      );
    }

    return (
      <div key={i} style={{ display: "flex", flexGrow: row ? 1 : 0,
        flexShrink: 1,
        flexBasis: row ? 0 : "auto", minWidth: 0 }}>
        {inner}
      </div>
    );
  };

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
      {row ? (
        <Row gap={u(28)} align="flex-start" grow>
          {steps.map(step)}
        </Row>
      ) : (
        <Col gap={u(28)} grow justify="center">
          {steps.map(step)}
        </Col>
      )}
      <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
    </Col>
  );
}
