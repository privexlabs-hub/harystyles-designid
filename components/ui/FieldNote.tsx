/**
 * The line under a form field.
 *
 * One component for hint, error and confirmation, because they occupy the same
 * space and swapping between them should not move the layout. The tone matters
 * as much as the colour: the brand does not say "Invalid input" — it says what
 * happened and what to do, in the same voice it uses everywhere else.
 */
export type FieldTone = "hint" | "alarm" | "ok" | "caution";

const COLOUR: Record<FieldTone, string> = {
  hint: "var(--fg-faint)",
  alarm: "var(--alarm)",
  ok: "var(--ok)",
  caution: "var(--caution)",
};

export function FieldNote({
  tone = "hint",
  children,
  id,
}: {
  tone?: FieldTone;
  children: React.ReactNode;
  /** Point the field's aria-describedby at this. */
  id?: string;
}) {
  return (
    <span
      id={id}
      // A screen reader should announce a problem when it appears, without
      // interrupting whatever is being read.
      role={tone === "alarm" ? "alert" : undefined}
      style={{
        display: "block",
        fontSize: 11,
        lineHeight: 1.45,
        color: COLOUR[tone],
      }}
    >
      {children}
    </span>
  );
}
