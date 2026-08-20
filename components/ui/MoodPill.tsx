/** A mood, as a selectable pill. Colour comes from the --mood-* tokens. */
export function MoodPill({
  label,
  color,
  selected,
  onClick,
  size = "md",
}: {
  label: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
  size?: "md" | "lg";
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      style={{
        padding: size === "lg" ? "16px 22px" : "10px 16px",
        borderRadius: 999,
        background: selected
          ? `color-mix(in oklch, ${color} 18%, var(--bg-card))`
          : "var(--bg-card)",
        border: `1px solid ${selected ? color : "var(--border)"}`,
        color: selected ? color : "var(--fg-muted)",
        fontFamily: "var(--font-ui)",
        fontSize: size === "lg" ? 15 : 13,
        fontWeight: 500,
        letterSpacing: "0.005em",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        transition: "all var(--dur-2) var(--ease-out)",
      }}
    >
      <span
        style={{ width: 8, height: 8, borderRadius: 999, background: color, display: "inline-block" }}
      />
      {label}
    </button>
  );
}
