/**
 * The opening slide, and anything else that has to stop a thumb: one short
 * line at the largest size the artboard will take, and a cue to keep going.
 *
 * Also the YouTube thumbnail shape — a thumbnail is read at 210px wide, so it
 * gets two or three words and nothing else.
 *
 * Arrangements:
 *   0 · anchored  — hook at the foot, cue beneath
 *   1 · centred   — hook centred, poster-like
 *   2 · numbered  — a slide number sits above the hook
 *   3 · banded    — the hook on an accent band
 */
import { Col, Display, Eyebrow, Row, Spacer, UIText } from "../primitives";
import type { Ctx } from "../types";

export type HookProps = {
  kicker?: string;
  hook: string;
  cue?: string;
  index?: string;
};

/** Thumbnails are read tiny, so their type is sized far more aggressively. */
function hookSizeFor(ctx: Ctx, text: string): number {
  const thumbnail = ctx.size.w >= 1280 && ctx.size.h <= 720;
  const base = thumbnail ? 150 : ctx.size.h >= 1600 ? 130 : 112;
  if (text.length > 60) return base * 0.5;
  if (text.length > 38) return base * 0.64;
  if (text.length > 22) return base * 0.8;
  return base;
}

export function HookLayout({ ctx, props }: { ctx: Ctx; props: HookProps }) {
  const { p, u, variant } = ctx;
  const fs = hookSizeFor(ctx, props.hook);
  const centred = variant.layout === 1;
  const align = centred ? "center" : "left";

  const hook = (
    <Display ctx={ctx} size={fs} align={align} weight={500} style={{ lineHeight: 0.98 }}>
      {props.hook}
    </Display>
  );

  return (
    <Col grow gap={u(30)} justify={centred ? "center" : undefined} align={centred ? "center" : undefined}>
      {variant.layout === 2 && props.index && (
        <Eyebrow ctx={ctx} size={18} color={p.accent} align={align}>
          {props.index}
        </Eyebrow>
      )}
      {props.kicker && (
        <Eyebrow ctx={ctx} color={p.accent} align={align}>
          {props.kicker}
        </Eyebrow>
      )}
      {!centred && <Spacer />}

      {variant.layout === 3 ? (
        <div
          style={{
            display: "flex",
            padding: `${u(28)}px ${u(34)}px`,
            backgroundColor: p.accent,
          }}
        >
          <Display ctx={ctx} size={fs} weight={500} color={p.accentFg} style={{ lineHeight: 0.98 }}>
            {props.hook}
          </Display>
        </div>
      ) : (
        hook
      )}

      {!centred && <Spacer />}
      {props.cue && (
        <Row gap={u(12)} align="center" justify={centred ? "center" : undefined}>
          <UIText ctx={ctx} size={24} color={p.fgSubtle}>
            {props.cue}
          </UIText>
          <Eyebrow ctx={ctx} size={20} color={p.accent}>
            →
          </Eyebrow>
        </Row>
      )}
    </Col>
  );
}
