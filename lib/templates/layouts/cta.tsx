/**
 * The ask. A line, a button, and where to go.
 *
 * The brand never shouts here — no "unlock", no "exclusive", no countdown. The
 * button is decorative on an artboard, but it is drawn as the product's real
 * pill so the ad and the app agree with each other.
 *
 * Arrangements:
 *   0 · anchored  — ask at the foot, button beneath
 *   1 · centred   — everything centred
 *   2 · banded    — the ask on an accent band, button below
 *   3 · minimal   — no button, just the ask and a URL
 */
import { Col, Display, Eyebrow, Pill, Reading, Spacer } from "../primitives";
import type { Ctx } from "../types";
import { LitLine, splitEmphasis, measure } from "./common";

export type CtaProps = {
  eyebrow?: string;
  headline: string;
  body?: string;
  button?: string;
  url?: string;
  /** Renders the lit-lamp status line instead of a plain eyebrow. */
  lit?: boolean;
};

export function CtaLayout({ ctx, props }: { ctx: Ctx; props: CtaProps }) {
  const { p, u, variant } = ctx;
  const centred = variant.layout === 1;
  const align = centred ? "center" : "left";
  const fs = props.headline.length > 48 ? 58 : props.headline.length > 28 ? 70 : 84;
  const [lead, emphasis] = splitEmphasis(props.headline);

  const heading = (
    <Col gap={0} align={centred ? "center" : undefined}>
      <Display ctx={ctx} size={fs} align={align}>
        {lead}
      </Display>
      {emphasis ? (
        <Display ctx={ctx} size={fs} align={align} italic color={p.accent}>
          {emphasis}
        </Display>
      ) : null}
    </Col>
  );

  return (
    <Col grow gap={u(30)} justify={centred ? "center" : undefined} align={centred ? "center" : undefined}>
      {props.lit && props.eyebrow ? (
        <LitLine ctx={ctx}>{props.eyebrow}</LitLine>
      ) : props.eyebrow ? (
        <Eyebrow ctx={ctx} color={p.accent} align={align}>
          {props.eyebrow}
        </Eyebrow>
      ) : null}

      {!centred && <Spacer />}

      {variant.layout === 2 ? (
        <div style={{ display: "flex", padding: `${u(30)}px ${u(34)}px`, backgroundColor: p.accentSoft }}>
          {heading}
        </div>
      ) : (
        heading
      )}

      {props.body && (
        <Reading ctx={ctx} size={fs * 0.3} align={align} style={{ maxWidth: measure(ctx, centred ? 0.8 : 0.7) }}>
          {props.body}
        </Reading>
      )}

      {!centred && <Spacer />}

      <Col gap={u(20)} align={centred ? "center" : "flex-start"}>
        {props.button && variant.layout !== 3 && <Pill ctx={ctx}>{props.button}</Pill>}
        {props.url && (
          <Eyebrow ctx={ctx} size={16} color={p.fgFaint} align={align}>
            {props.url}
          </Eyebrow>
        )}
      </Col>
    </Col>
  );
}
