import type { ReactNode } from "react";

/**
 * Nothing here, said kindly.
 *
 * The brand's own empty state is the end of the evening — *"That's all for
 * tonight. The lamp will be lit again at sunset."* — so an empty state here
 * explains and offers, rather than apologising or shouting at you to create
 * something.
 */
export function EmptyState({
  glyph = "❦︎",
  title,
  body,
  action,
}: {
  /** A typographic mark, not an icon. Set in the display serif. */
  glyph?: string;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--s-3)",
        padding: "var(--s-7) var(--s-5)",
        textAlign: "center",
      }}
    >
      <span
        className="title-display"
        aria-hidden
        style={{ fontSize: 34, lineHeight: 1, color: "var(--accent)", opacity: 0.7 }}
      >
        {glyph}
      </span>
      <span className="title-sm">{title}</span>
      {body && (
        <p className="body-sm" style={{ margin: 0, maxWidth: "34ch" }}>
          {body}
        </p>
      )}
      {action}
    </div>
  );
}
