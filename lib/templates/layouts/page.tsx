/**
 * A page of a document: running head, a column of text, a folio.
 *
 * The furniture lives here rather than on `Artboard`, which is shared with
 * social artboards where a page number would be nonsense. A page is the only
 * thing in the system that knows it is part of something longer.
 *
 * Arrangements:
 *   0 · text     — a straight column of prose
 *   1 · opener   — a chapter or section opening, title dropped down the page
 *   2 · cover    — title, author, and the mark; no running head or folio
 *   3 · colophon — the note at the end about how the thing was made
 */
import { Col, Display, Eyebrow, Reading, Row, Rule, Spacer, UIText } from "../primitives";
import { Mark } from "../Artboard";
import type { Ctx } from "../types";
import { measure } from "./common";

export type PageProps = {
  /** Repeated at the top of every text page. The notebook or document title. */
  runningHead?: string;
  title?: string;
  /** A standfirst under an opener's title. */
  standfirst?: string;
  /** The body. Blank lines separate paragraphs. */
  body?: string;
  folio?: string;
  byline?: string;
};

/** Blank-line-separated paragraphs, which is how a writer actually types. */
function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function PageLayout({ ctx, props }: { ctx: Ctx; props: PageProps }) {
  const { p, u, variant } = ctx;

  // A print page is set at a reading measure, not the full width of the paper.
  const column = measure(ctx, 0.86);

  const head = props.runningHead ? (
    <Row justify="space-between" align="baseline">
      <Eyebrow ctx={ctx} size={13} color={p.fgFaint}>
        {props.runningHead}
      </Eyebrow>
      {props.byline && (
        <Eyebrow ctx={ctx} size={13} color={p.fgFaint}>
          {props.byline}
        </Eyebrow>
      )}
    </Row>
  ) : null;

  const folio = props.folio ? (
    <Row justify="center">
      <Eyebrow ctx={ctx} size={13} color={p.fgFaint}>
        {props.folio}
      </Eyebrow>
    </Row>
  ) : null;

  const prose = props.body ? (
    <Col gap={u(20)} style={{ maxWidth: column }}>
      {paragraphs(props.body).map((para, i) => (
        <Reading ctx={ctx} key={i} size={19} color={p.fg}>
          {para}
        </Reading>
      ))}
    </Col>
  ) : null;

  // ---------------------------------------------------------------- cover
  if (variant.layout === 2) {
    return (
      <Col grow gap={u(30)} justify="center" align="center">
        <Mark size={u(78)} color={p.accent} />
        <Spacer />
        <Col gap={u(18)} align="center">
          {props.runningHead && (
            <Eyebrow ctx={ctx} color={p.accent} align="center">
              {props.runningHead}
            </Eyebrow>
          )}
          <Display ctx={ctx} size={72} align="center">
            {props.title ?? ""}
          </Display>
          {props.standfirst && (
            <Reading ctx={ctx} size={24} italic align="center" style={{ maxWidth: column }}>
              {props.standfirst}
            </Reading>
          )}
        </Col>
        <Spacer />
        {props.byline && (
          <Eyebrow ctx={ctx} size={16} color={p.fgSubtle} align="center">
            {props.byline}
          </Eyebrow>
        )}
      </Col>
    );
  }

  // ---------------------------------------------------------------- colophon
  if (variant.layout === 3) {
    return (
      <Col grow gap={u(26)}>
        {head}
        <Spacer />
        <Rule ctx={ctx} color={p.accent} width={u(90)} thickness={2} />
        {props.title && (
          <Display ctx={ctx} size={38}>
            {props.title}
          </Display>
        )}
        {prose}
        <Spacer />
        <Row justify="space-between" align="center">
          <Mark size={u(26)} color={p.accent} />
          {props.folio && (
            <Eyebrow ctx={ctx} size={13} color={p.fgFaint}>
              {props.folio}
            </Eyebrow>
          )}
        </Row>
      </Col>
    );
  }

  // ---------------------------------------------------------------- opener
  if (variant.layout === 1) {
    return (
      <Col grow gap={u(26)}>
        {head}
        {/* An opener starts a third of the way down, the way a chapter does. */}
        <div style={{ display: "flex", height: `${Math.round(ctx.inner.h * 0.22)}px` }} />
        <Col gap={u(16)}>
          <Display ctx={ctx} size={54}>
            {props.title ?? ""}
          </Display>
          {props.standfirst && (
            <Reading ctx={ctx} size={22} italic style={{ maxWidth: column }}>
              {props.standfirst}
            </Reading>
          )}
        </Col>
        <Rule ctx={ctx} color={p.accent} width={u(90)} thickness={2} />
        {prose}
        <Spacer />
        {folio}
      </Col>
    );
  }

  // ---------------------------------------------------------------- text
  return (
    <Col grow gap={u(26)}>
      {head}
      {props.title && (
        <UIText ctx={ctx} size={22} weight={500} color={p.fgStrong}>
          {props.title}
        </UIText>
      )}
      {prose}
      <Spacer />
      {folio}
    </Col>
  );
}
