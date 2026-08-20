/**
 * The wide shapes: X headers, LinkedIn covers, Twitch banners, email headers,
 * community strips, event banners.
 *
 * These are mostly empty on purpose. A banner is cropped differently on every
 * device, so the only safe thing to put in one is the lockup and a short line,
 * both near the middle.
 *
 * Arrangements:
 *   0 · centred   — lockup and line stacked in the middle
 *   1 · left      — flush left, for shapes with a profile picture on the left
 *   2 · split     — line left, detail right
 *   3 · stacked   — a taller arrangement for event and podcast covers
 */
import { Col, Display, Eyebrow, Row, Rule, UIText } from "../primitives";
import { Mark } from "../Artboard";
import type { Ctx } from "../types";

export type BannerProps = {
  headline: string;
  detail?: string;
  eyebrow?: string;
};

export function BannerLayout({ ctx, props }: { ctx: Ctx; props: BannerProps }) {
  const { p, u, variant, size } = ctx;

  // Banner heights vary by an order of magnitude — 191px for LinkedIn, 3000px
  // for a podcast cover — so type is sized off the height rather than the unit.
  const fs = Math.min(size.h * 0.26, size.w * 0.06);
  const centred = variant.layout === 0 || variant.layout === 3;

  const headline = (
    <Display ctx={ctx} size={fs / ctx.u(1)} align={centred ? "center" : "left"}>
      {props.headline}
    </Display>
  );

  const detail = props.detail ? (
    <UIText
      ctx={ctx}
      size={fs * 0.32 / ctx.u(1)}
      color={p.fgMuted}
      align={centred ? "center" : "left"}
    >
      {props.detail}
    </UIText>
  ) : null;

  if (variant.layout === 2) {
    return (
      <Row grow gap={u(40)} align="center" justify="space-between">
        <Col gap={u(12)}>
          {props.eyebrow && <Eyebrow ctx={ctx} color={p.accent}>{props.eyebrow}</Eyebrow>}
          {headline}
        </Col>
        {detail}
      </Row>
    );
  }

  if (variant.layout === 3) {
    return (
      <Col grow gap={u(28)} align="center" justify="center">
        <Mark size={fs * 0.9} color={p.accent} />
        {props.eyebrow && <Eyebrow ctx={ctx} color={p.accent} align="center">{props.eyebrow}</Eyebrow>}
        {headline}
        <Rule ctx={ctx} color={p.borderSoft} width="34%" />
        {detail}
      </Col>
    );
  }

  return (
    <Col
      grow
      gap={u(14)}
      align={centred ? "center" : "flex-start"}
      justify="center"
    >
      {props.eyebrow && (
        <Eyebrow ctx={ctx} color={p.accent} align={centred ? "center" : "left"}>
          {props.eyebrow}
        </Eyebrow>
      )}
      {headline}
      {detail}
    </Col>
  );
}
