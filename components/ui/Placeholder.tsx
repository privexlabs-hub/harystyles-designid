import type { CSSProperties } from "react";

/** A stand-in for imagery, striped so it never reads as finished artwork. */
export function Placeholder({
  w = "100%",
  h = 160,
  label = "image",
  style,
}: {
  w?: number | string;
  h?: number | string;
  label?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: "var(--r-md)",
        background:
          "repeating-linear-gradient(45deg, var(--ink-800) 0 8px, var(--ink-900) 8px 16px)",
        border: "1px solid var(--border-soft)",
        display: "grid",
        placeItems: "center",
        ...style,
      }}
    >
      <span className="mono" style={{ color: "var(--fg-faint)", fontSize: 10 }}>
        {label}
      </span>
    </div>
  );
}
