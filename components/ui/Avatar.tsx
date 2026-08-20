/**
 * Reader and writer avatars.
 *
 * There are no uploaded photos in this product — an avatar is the initial of a
 * pen name on a hue-derived field, which keeps identity present without turning
 * it into a profile picture. `hue` comes from the piece, so one writer is always
 * the same colour.
 */
type AvatarProps = {
  name?: string;
  size?: number;
  hue?: number;
  /** The accent halo, used for the writer on their own page. */
  ring?: boolean;
};

export function Avatar({ name = "?", size = 40, hue = 45, ring = false }: AvatarProps) {
  const initial = name.trim()[0]?.toUpperCase() || "?";
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: `oklch(0.30 0.04 ${hue})`,
        color: `oklch(0.85 0.08 ${hue})`,
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--font-display)",
        fontSize: size * 0.42,
        fontWeight: 500,
        boxShadow: ring ? "0 0 0 2px var(--bg), 0 0 0 3px var(--accent)" : "none",
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}
