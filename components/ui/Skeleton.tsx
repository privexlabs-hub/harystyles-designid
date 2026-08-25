import type { CSSProperties } from "react";

/**
 * A placeholder for something still being drawn.
 *
 * Deliberately a slow, shallow pulse rather than a shimmer sweeping across the
 * screen: the brand is unhurried, and a spinner on every one of a hundred and
 * thirty library cards would make the page flicker like a slot machine. It
 * stops moving entirely under `prefers-reduced-motion`, which globals.css
 * enforces for every animation.
 */
export function Skeleton({
  width = "100%",
  height = 16,
  radius = "var(--r-sm)",
  style,
}: {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      style={{
        display: "block",
        width,
        height,
        borderRadius: radius,
        background: "var(--bg-elevated)",
        animation: "hs-pulse 1.8s var(--ease-in-out) infinite",
        ...style,
      }}
    />
  );
}
