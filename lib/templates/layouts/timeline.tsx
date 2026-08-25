/**
 * A sequence of moments with dates against them.
 *
 * A writer's year, the platform's story, the road to a launch. Distinct from
 * Steps, which is instructional and ordinal — a timeline is retrospective, and
 * the date does the work that a step number does there.
 *
 * Arrangements:
 *   0 · rule       — a vertical rule with the dates on it
 *   1 · ledger     — dates in a left column, plainest and densest
 *   2 · across     — left to right, for wide artboards
 *   3 · milestones — each moment in its own card
 */
import { Card, Col, Display, Eyebrow, Row, Rule, UIText } from "../primitives";
import type { Ctx } from "../types";
import { FootLine, measure } from "./common";

export type TimelineProps = {
  eyebrow?: string;
  headline: string;
  /** "date :: what happened" per line. */
  moments: string[];
  footLeft?: string;
  footRight?: string;
};

export function TimelineLayout({ ctx, props }: { ctx: Ctx; props: TimelineProps }) {
  const { p, u, variant, size } = ctx;

  const moments = props.moments.filter(Boolean).map((m) => {
    const [date, ...rest] = m.split("::");
    return { date: date.trim(), body: rest.join("::").trim() };
  });

  // More moments means smaller type. A timeline that runs off its artboard is
  // worse than one set a size down.
  const fs = moments.length > 5 ? 22 : moments.length > 3 ? 26 : 32;

  // Left to right needs width; on a story it would give each moment a column
  // too narrow to set a date in, so the arrangement is overridden.
  const across = variant.layout === 2 && size.w / size.h > 1.2;

  const dateOf = (date: string) => (
    <Eyebrow ctx={ctx} size={fs * 0.6} color={p.accent}>
      {date}
    </Eyebrow>
  );

  const bodyOf = (body: string) => (
    <UIText ctx={ctx} size={fs} color={p.fg}>
      {body}
    </UIText>
  );

  if (across) {
    return (
      <Col grow gap={u(34)}>
        {props.eyebrow && <Eyebrow ctx={ctx} color={p.accent}>{props.eyebrow}</Eyebrow>}
        <Display ctx={ctx} size={48}>{props.headline}</Display>
        <Col gap={u(20)} grow justify="center">
          <Rule ctx={ctx} color={p.accent} thickness={2} />
          <Row gap={u(28)} align="flex-start">
            {moments.map((m, i) => (
              <Col key={i} gap={u(10)} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }}>
                {dateOf(m.date)}
                {bodyOf(m.body)}
              </Col>
            ))}
          </Row>
        </Col>
        <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
      </Col>
    );
  }

  const rows = moments.map((m, i) => {
    if (variant.layout === 3) {
      return (
        <Card key={i} ctx={ctx}>
          <Col gap={u(8)}>
            {dateOf(m.date)}
            {bodyOf(m.body)}
          </Col>
        </Card>
      );
    }

    if (variant.layout === 1) {
      // The ledger: dates aligned in their own column, nothing decorative.
      return (
        <Row key={i} gap={u(24)} align="flex-start">
          <div style={{ display: "flex", width: measure(ctx, 0.26), flexShrink: 0 }}>
            {dateOf(m.date)}
          </div>
          {bodyOf(m.body)}
        </Row>
      );
    }

    // The rule: a hairline down the left with the moments hung off it.
    return (
      <Row key={i} gap={u(24)} align="stretch">
        <div
          style={{
            display: "flex",
            width: Math.max(2, u(2)),
            // The accent, not accentSoft: a wash reads on a filled surface but
            // vanishes as a hairline against the page.
            backgroundColor: p.accent,
            flexShrink: 0,
          }}
        />
        <Col gap={u(8)} style={{ flexShrink: 1, minWidth: 0 }}>
          {dateOf(m.date)}
          {bodyOf(m.body)}
        </Col>
      </Row>
    );
  });

  return (
    <Col grow gap={u(34)}>
      {props.eyebrow && <Eyebrow ctx={ctx} color={p.accent}>{props.eyebrow}</Eyebrow>}
      <Display ctx={ctx} size={48}>{props.headline}</Display>
      <Col gap={u(variant.layout === 3 ? 16 : 24)} grow justify="center">
        {rows}
      </Col>
      <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
    </Col>
  );
}
