/**
 * A photograph with something to say about it.
 *
 * The brand has no stock photography and no photographic style guide — it is a
 * reading product, and its imagery is whatever the writer actually has. So this
 * layout does one job well: give a picture room, keep the type off it where the
 * type has to be read, and never let a photograph dictate the palette.
 *
 * Arrangements:
 *   0 · full bleed — the photograph fills the artboard, type over a scrim
 *   1 · half       — picture and words side by side, or stacked when narrow
 *   2 · inset      — a framed picture above the words
 *   3 · portrait   — a circular crop beside a name, for a founder or a writer
 */
import { Col, Display, Eyebrow, Image, Reading, Row, UIText } from "../primitives";
import { scrimStyle } from "../Artboard";
import type { Ctx } from "../types";
import { FootLine, measure } from "./common";

export type PhotoProps = {
  eyebrow?: string;
  headline: string;
  body?: string;
  /** An <img> src, resolved by the caller. Empty renders a placeholder. */
  photo: string;
  /** Shown under the picture in the inset and portrait arrangements. */
  caption?: string;
  footLeft?: string;
  footRight?: string;
};

export function PhotoLayout({ ctx, props }: { ctx: Ctx; props: PhotoProps }) {
  const { p, u, variant, size, inner } = ctx;

  const heading = (
    <Display ctx={ctx} size={props.headline.length > 44 ? 48 : 62}>
      {props.headline}
    </Display>
  );

  const body = props.body ? (
    <Reading ctx={ctx} size={22} style={{ maxWidth: measure(ctx, 0.9) }}>
      {props.body}
    </Reading>
  ) : null;

  const eyebrow = props.eyebrow ? (
    <Eyebrow ctx={ctx} color={p.accent}>
      {props.eyebrow}
    </Eyebrow>
  ) : null;

  // ---------------------------------------------------------------- full bleed
  if (variant.layout === 0) {
    return (
      <Col grow justify="flex-end" gap={u(26)}>
        {/* The picture is a sibling painted first, because Satori has no
            z-index — paint order is source order and nothing else. */}
        <div
          style={{
            position: "absolute",
            top: -Math.round(size.h * 0.083),
            left: -Math.round(size.w * 0.083),
            display: "flex",
            width: size.w,
            height: size.h,
            overflow: "hidden",
          }}
        >
          <Image ctx={ctx} src={props.photo} width={size.w} height={size.h} label="full-bleed photograph" />
        </div>

        {/* A scrim, so the type is readable over whatever the picture happens
            to be. Bottom-weighted because the words sit at the foot. */}
        <div
          style={{
            position: "absolute",
            top: -Math.round(size.h * 0.083),
            left: -Math.round(size.w * 0.083),
            display: "flex",
            width: size.w,
            height: size.h,
            backgroundImage: `linear-gradient(to bottom, ${scrimStyle(variant.theme, 0.1)} 0%, ${scrimStyle(variant.theme, 0.82)} 78%)`,
          }}
        />

        {/* `position: relative` is load-bearing, not decoration.
            In the browser, absolutely-positioned elements paint in a later
            phase than in-flow content, so the scrim above would cover this text
            however far down the source it sits. Satori paints in strict source
            order and shows it. Making the type positioned too puts both engines
            on the same rule: later in the source, later on the page. */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: u(20) }}>
          {eyebrow}
          {heading}
          {body}
        </div>
        <div style={{ position: "relative", display: "flex" }}>
          <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
        </div>
      </Col>
    );
  }

  // ---------------------------------------------------------------- portrait
  if (variant.layout === 3) {
    const d = Math.round(Math.min(inner.w, inner.h) * 0.42);
    return (
      <Col grow gap={u(30)} align="center" justify="center">
        <Image ctx={ctx} src={props.photo} width={d} height={d} radius={d} label="portrait" />
        <Col gap={u(12)} align="center">
          {eyebrow}
          <Display ctx={ctx} size={44} align="center">
            {props.headline}
          </Display>
          {props.caption && (
            <UIText ctx={ctx} size={22} color={p.fgMuted} align="center">
              {props.caption}
            </UIText>
          )}
        </Col>
        {body}
        <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
      </Col>
    );
  }

  // ---------------------------------------------------------------- inset
  if (variant.layout === 2) {
    return (
      <Col grow gap={u(28)}>
        {eyebrow}
        <Image
          ctx={ctx}
          src={props.photo}
          width={inner.w}
          height={Math.round(inner.h * 0.42)}
          radius={u(18)}
        />
        {props.caption && (
          <UIText ctx={ctx} size={18} color={p.fgFaint}>
            {props.caption}
          </UIText>
        )}
        {heading}
        {body}
        <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
      </Col>
    );
  }

  // ---------------------------------------------------------------- half
  // Side by side needs width; on a story it would leave a column too narrow to
  // set a headline in, so it stacks instead.
  const side = size.w / size.h > 0.9;
  const picture = (
    <Image
      ctx={ctx}
      src={props.photo}
      width={side ? Math.round(inner.w * 0.44) : inner.w}
      height={side ? inner.h : Math.round(inner.h * 0.4)}
      radius={u(18)}
    />
  );
  const words = (
    <Col gap={u(20)} justify="center" style={{ flexShrink: 1, minWidth: 0 }}>
      {eyebrow}
      {heading}
      {body}
    </Col>
  );

  return (
    <Col grow gap={u(28)}>
      {side ? (
        <Row gap={u(36)} align="stretch" grow>
          {picture}
          {words}
        </Row>
      ) : (
        <Col gap={u(28)} grow justify="center">
          {picture}
          {words}
        </Col>
      )}
      <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
    </Col>
  );
}
