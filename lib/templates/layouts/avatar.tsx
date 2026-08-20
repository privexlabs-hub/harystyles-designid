/**
 * The 400×400 profile mark.
 *
 * An avatar is displayed at 32px more often than at 400, and is usually cropped
 * to a circle, so the mark is set large and centred with generous clearance and
 * nothing else competing.
 *
 * Arrangements:
 *   0 · mark      — the mark alone
 *   1 · stamp     — the mark inside its hairline circle
 *   2 · initial   — the wordmark's "h", for when the mark is too fine
 *   3 · framed    — the mark on a contrasting disc
 */
import { Col } from "../primitives";
import { Mark } from "../Artboard";
import { FONT_STACK } from "@/lib/satori/fonts";
import type { Ctx } from "../types";

export type AvatarProps = {
  /** Overrides the mark colour, for the monochrome and inverted variants. */
  markColor?: string;
  /** Overrides the disc colour behind the mark. */
  discColor?: string;
};

export function AvatarLayout({ ctx, props }: { ctx: Ctx; props: AvatarProps }) {
  const { p, variant, size } = ctx;
  const markColor = props.markColor ?? p.accent;
  const d = Math.min(size.w, size.h);

  if (variant.layout === 2) {
    return (
      <Col grow align="center" justify="center">
        <div
          style={{
            display: "flex",
            fontFamily: FONT_STACK.display,
            fontSize: d * 0.62,
            lineHeight: 1,
            letterSpacing: `${-0.035 * d * 0.62}px`,
            color: markColor,
          }}
        >
          h
        </div>
      </Col>
    );
  }

  if (variant.layout === 1) {
    const ring = d * 0.62;
    return (
      <Col grow align="center" justify="center">
        <div
          style={{
            display: "flex",
            width: ring,
            height: ring,
            borderRadius: ring,
            border: `${Math.max(2, d * 0.008)}px solid ${markColor}`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mark size={ring * 0.5} color={markColor} />
        </div>
      </Col>
    );
  }

  if (variant.layout === 3) {
    const disc = d * 0.66;
    return (
      <Col grow align="center" justify="center">
        <div
          style={{
            display: "flex",
            width: disc,
            height: disc,
            borderRadius: disc,
            backgroundColor: props.discColor ?? p.accent,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mark size={disc * 0.56} color={props.markColor ?? p.accentFg} />
        </div>
      </Col>
    );
  }

  return (
    <Col grow align="center" justify="center">
      <Mark size={d * 0.46} color={markColor} />
    </Col>
  );
}
