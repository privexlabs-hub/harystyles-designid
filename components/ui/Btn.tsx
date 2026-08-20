import type { CSSProperties, ReactNode } from "react";

/**
 * The button. Always a pill, always Inter Tight at 500.
 *
 * `premium` is the wine variant, reserved for patronage — it never competes with
 * the amber primary, and the two never appear side by side as equals.
 */
export type BtnVariant = "primary" | "secondary" | "ghost" | "outline" | "premium";
export type BtnSize = "sm" | "md" | "lg";

const SIZES: Record<BtnSize, { h: number; px: number; fs: number; gap: number }> = {
  sm: { h: 32, px: 12, fs: 13, gap: 6 },
  md: { h: 40, px: 16, fs: 14, gap: 8 },
  lg: { h: 48, px: 20, fs: 15, gap: 10 },
};

const VARIANTS: Record<BtnVariant, { bg: string; fg: string; border: string }> = {
  primary: { bg: "var(--accent)", fg: "var(--accent-fg)", border: "transparent" },
  secondary: { bg: "var(--bg-elevated)", fg: "var(--fg)", border: "var(--border)" },
  ghost: { bg: "transparent", fg: "var(--fg)", border: "transparent" },
  outline: { bg: "transparent", fg: "var(--fg)", border: "var(--border-strong)" },
  premium: { bg: "var(--premium)", fg: "var(--ink-50)", border: "transparent" },
};

type BtnProps = {
  variant?: BtnVariant;
  size?: BtnSize;
  children?: ReactNode;
  icon?: ReactNode;
  iconRight?: ReactNode;
  onClick?: () => void;
  full?: boolean;
  type?: "button" | "submit";
  title?: string;
  "aria-label"?: string;
  style?: CSSProperties;
};

export function Btn({
  variant = "primary",
  size = "md",
  children,
  icon,
  iconRight,
  onClick,
  full,
  type = "button",
  style = {},
  ...rest
}: BtnProps) {
  const s = SIZES[size];
  const v = VARIANTS[variant];
  return (
    <button
      {...rest}
      type={type}
      onClick={onClick}
      style={{
        height: s.h,
        padding: `0 ${s.px}px`,
        background: v.bg,
        color: v.fg,
        border: `1px solid ${v.border}`,
        borderRadius: 999,
        fontFamily: "var(--font-ui)",
        fontSize: s.fs,
        fontWeight: 500,
        letterSpacing: "0.005em",
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        cursor: "pointer",
        width: full ? "100%" : "auto",
        justifyContent: "center",
        transition: "all var(--dur-2) var(--ease-out)",
        ...style,
      }}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
