/**
 * The mark and the wordmark, as components.
 *
 * These are the source of truth that scripts/generate-brand-assets.mjs mirrors
 * into standalone .svg and .png files — if the paths change here, re-run
 * `npm run assets:brand`.
 *
 * The mark is a lowercase "h" drawn as a candle, its flame standing in for the
 * ascender's terminal.
 */
export function HSLogomark({
  size = 48,
  color = "var(--accent)",
  /** The notch punched out of the flame; must match the surface behind it. */
  hole = "var(--bg)",
}: {
  size?: number;
  color?: string;
  hole?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M16 36V12" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M16 24Q24 18 24 28T32 36"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M32 12Q34 9 32 6Q30 9 32 12Z" fill={color} />
      <circle cx="32" cy="14" r="1.4" fill={hole} />
    </svg>
  );
}

/**
 * Always lowercase, always with the accent period. The period is the only place
 * the brand raises its voice.
 */
export function HSWordmark({
  size = 36,
  color = "var(--fg-strong)",
  accent = "var(--accent)",
}: {
  size?: number;
  color?: string;
  accent?: string;
}) {
  return (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.035em",
        fontVariationSettings: '"opsz" 144, "SOFT" 50',
        color,
        whiteSpace: "nowrap",
      }}
    >
      harystyles<span style={{ color: accent }}>.</span>
    </span>
  );
}
