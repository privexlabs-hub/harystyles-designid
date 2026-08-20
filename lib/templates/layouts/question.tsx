/**
 * A question put to the reader: conversation starters, polls, FAQ prompts,
 * myth-or-fact.
 *
 * The brand asks rather than instructs, so the question is set large and the
 * options are quiet — never a call to "drop a comment below".
 *
 * Arrangements:
 *   0 · options  — the question over a list of options
 *   1 · centred  — question centred, options in a row
 *   2 · pairs    — options as two large halves, for A/B
 *   3 · open     — no options at all, just the question and a prompt
 */
import { Col, Display, Eyebrow, Reading, Row, UIText } from "../primitives";
import type { Ctx } from "../types";
import { FootLine, measure } from "./common";

export type QuestionProps = {
  eyebrow?: string;
  question: string;
  options?: string[];
  prompt?: string;
  footLeft?: string;
  footRight?: string;
};

export function QuestionLayout({ ctx, props }: { ctx: Ctx; props: QuestionProps }) {
  const { p, u, variant } = ctx;
  const options = (props.options ?? []).filter(Boolean);
  const fs = props.question.length > 60 ? 56 : props.question.length > 34 ? 68 : 80;
  const centred = variant.layout === 1;

  const option = (label: string, index: number, big: boolean) => (
    <div
      key={index}
      style={{
        display: "flex",
        flexGrow: big ? 1 : 0,
        flexShrink: 1,
        flexBasis: big ? 0 : "auto",
        minWidth: 0,
        alignItems: "center",
        gap: u(16),
        padding: `${u(big ? 34 : 22)}px ${u(26)}px`,
        borderRadius: u(16),
        backgroundColor: p.bgCard,
        border: `${Math.max(1, u(1))}px solid ${p.borderSoft}`,
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "inherit",
          fontSize: u(big ? 26 : 20),
          color: p.accent,
          letterSpacing: `${0.18 * u(20)}px`,
        }}
      >
        {String.fromCharCode(65 + index)}
      </div>
      <UIText ctx={ctx} size={big ? 34 : 26} color={p.fg} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }}>
        {label}
      </UIText>
    </div>
  );

  const body =
    variant.layout === 3 || !options.length ? null : variant.layout === 2 ? (
      <Row gap={u(20)} align="stretch">
        {options.slice(0, 2).map((o, i) => option(o, i, true))}
      </Row>
    ) : centred ? (
      <Row gap={u(16)} justify="center" wrap>
        {options.map((o, i) => option(o, i, false))}
      </Row>
    ) : (
      <Col gap={u(16)}>{options.map((o, i) => option(o, i, false))}</Col>
    );

  return (
    <Col grow gap={u(36)} justify={centred ? "center" : "space-between"} align={centred ? "center" : undefined}>
      <Col gap={u(24)} align={centred ? "center" : undefined}>
        {props.eyebrow && (
          <Eyebrow ctx={ctx} color={p.accent} align={centred ? "center" : "left"}>
            {props.eyebrow}
          </Eyebrow>
        )}
        <Display ctx={ctx} size={fs} align={centred ? "center" : "left"}>
          {props.question}
        </Display>
        {props.prompt && (
          <Reading ctx={ctx} size={fs * 0.3} align={centred ? "center" : "left"} style={{ maxWidth: measure(ctx, 0.8) }}>
            {props.prompt}
          </Reading>
        )}
      </Col>
      {body}
      <FootLine ctx={ctx} left={props.footLeft} right={props.footRight} />
    </Col>
  );
}
