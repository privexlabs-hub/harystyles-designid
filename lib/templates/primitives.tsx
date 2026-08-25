/**
 * The vocabulary templates are written in.
 *
 * Every piece takes the render context, so a measurement is authored once
 * against the 1080 grid and scales to whatever artboard it lands on. Colours
 * come from the resolved palette — never a CSS variable, which Satori cannot
 * read.
 *
 * Satori rules observed throughout: `display` is explicit everywhere, layout is
 * flexbox only, and overlap is expressed by source order rather than z-index.
 */
import type { CSSProperties, ReactNode } from "react";
import { oklch } from "@/lib/color";
import { FONT_STACK } from "@/lib/satori/fonts";
import type { Ctx } from "./types";

type Align = "left" | "center" | "right";

// ---------------------------------------------------------------- type

/**
 * Display type — Fraunces, tight tracking, the voice of the brand.
 *
 * `lines` clamps to a line count. Satori has no -webkit-line-clamp, so the
 * clamp is a max-height: the DOM preview would ellipsise where Satori would
 * crop, and cropping in both is the honest match.
 */
export function Display({
  ctx,
  size,
  children,
  italic,
  color,
  align = "left",
  weight = 400,
  lines,
  style,
}: {
  ctx: Ctx;
  size: number;
  children: ReactNode;
  italic?: boolean;
  color?: string;
  align?: Align;
  weight?: 300 | 400 | 500 | 600 | 700;
  lines?: number;
  style?: CSSProperties;
}) {
  const fs = ctx.u(size);
  const lh = size >= 64 ? 1.0 : size >= 40 ? 1.06 : 1.14;
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT_STACK.display,
        fontSize: fs,
        fontWeight: weight,
        fontStyle: italic ? "italic" : "normal",
        lineHeight: lh,
        letterSpacing: `${-0.028 * fs}px`,
        color: color ?? ctx.p.fgStrong,
        textAlign: align,
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        minWidth: 0,
        flexShrink: 1,
        ...(lines ? { maxHeight: fs * lh * lines, overflow: "hidden" } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** The mono eyebrow — always uppercase, always widely tracked. */
export function Eyebrow({
  ctx,
  children,
  color,
  size = 15,
  align = "left",
}: {
  ctx: Ctx;
  children: ReactNode;
  color?: string;
  size?: number;
  align?: Align;
}) {
  const fs = ctx.u(size);
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT_STACK.mono,
        fontSize: fs,
        fontWeight: 500,
        letterSpacing: `${0.18 * fs}px`,
        color: color ?? ctx.p.fgSubtle,
        textTransform: "uppercase",
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
      }}
    >
      {children}
    </div>
  );
}

/** Reading copy — the serif text cut, generous leading. */
export function Reading({
  ctx,
  children,
  size = 26,
  color,
  align = "left",
  italic,
  lines,
  style,
}: {
  ctx: Ctx;
  children: ReactNode;
  size?: number;
  color?: string;
  align?: Align;
  italic?: boolean;
  lines?: number;
  style?: CSSProperties;
}) {
  const fs = ctx.u(size);
  const lh = 1.55;
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT_STACK.reading,
        fontSize: fs,
        fontStyle: italic ? "italic" : "normal",
        lineHeight: lh,
        color: color ?? ctx.p.fgMuted,
        textAlign: align,
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        minWidth: 0,
        flexShrink: 1,
        ...(lines ? { maxHeight: fs * lh * lines, overflow: "hidden" } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** UI copy — Inter Tight. Labels, captions, buttons. */
export function UIText({
  ctx,
  children,
  size = 22,
  color,
  weight = 400,
  align = "left",
  lines,
  style,
}: {
  ctx: Ctx;
  children: ReactNode;
  size?: number;
  color?: string;
  weight?: 300 | 400 | 500 | 600 | 700;
  align?: Align;
  lines?: number;
  style?: CSSProperties;
}) {
  const fs = ctx.u(size);
  const lh = 1.45;
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT_STACK.ui,
        fontSize: fs,
        fontWeight: weight,
        lineHeight: lh,
        color: color ?? ctx.p.fgMuted,
        textAlign: align,
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        minWidth: 0,
        flexShrink: 1,
        ...(lines ? { maxHeight: fs * lh * lines, overflow: "hidden" } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------- layout

export function Col({
  children,
  gap = 0,
  grow,
  align,
  justify,
  style,
}: {
  children: ReactNode;
  gap?: number;
  grow?: boolean;
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        // Yoga — which is what Satori lays out with — defaults flex-shrink to 0,
        // where CSS defaults it to 1. Without saying so explicitly, a flex child
        // never shrinks and simply overflows its siblings, and because Satori
        // has no z-index the overlap paints in source order. minWidth/minHeight
        // 0 is the same story for a long unbroken word.
        minWidth: 0,
        ...(grow ? { flexGrow: 1, flexShrink: 1, flexBasis: "auto" } : { flexShrink: 1 }),
        ...(align ? { alignItems: align } : {}),
        ...(justify ? { justifyContent: justify } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Row({
  children,
  gap = 0,
  grow,
  align = "center",
  justify,
  wrap,
  style,
}: {
  children: ReactNode;
  gap?: number;
  grow?: boolean;
  align?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  wrap?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap,
        alignItems: align,
        minWidth: 0,
        // See the note in Col: yoga will not shrink a flex child unless told.
        ...(grow ? { flexGrow: 1, flexShrink: 1, flexBasis: "auto" } : { flexShrink: 1 }),
        ...(justify ? { justifyContent: justify } : {}),
        ...(wrap ? { flexWrap: "wrap" } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Pushes everything after it to the far edge of a flex container. */
export const Spacer = () => (
  <div style={{ display: "flex", flexGrow: 1, flexShrink: 1, flexBasis: 0 }} />
);

// ---------------------------------------------------------------- marks

export function Rule({
  ctx,
  color,
  width = "100%",
  thickness = 1,
}: {
  ctx: Ctx;
  color?: string;
  width?: number | string;
  thickness?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        width,
        height: Math.max(1, ctx.u(thickness)),
        backgroundColor: color ?? ctx.p.border,
      }}
    />
  );
}

/** The lit dot that precedes "the lamp is lit". */
export function Dot({ ctx, size = 14, color }: { ctx: Ctx; size?: number; color?: string }) {
  const d = ctx.u(size);
  return (
    <div
      style={{
        display: "flex",
        width: d,
        height: d,
        borderRadius: d,
        backgroundColor: color ?? ctx.p.accent,
      }}
    />
  );
}

export function Badge({
  ctx,
  children,
  color,
  background,
  size = 15,
}: {
  ctx: Ctx;
  children: ReactNode;
  color?: string;
  background?: string;
  size?: number;
}) {
  const fs = ctx.u(size);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: `${ctx.u(9)}px ${ctx.u(18)}px`,
        borderRadius: 999,
        backgroundColor: background ?? ctx.p.accentSoft,
        color: color ?? ctx.p.accent,
        fontFamily: FONT_STACK.mono,
        fontSize: fs,
        fontWeight: 500,
        letterSpacing: `${0.18 * fs}px`,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

/** The pill button, matching the product's own. Decorative on an artboard. */
export function Pill({
  ctx,
  children,
  filled = true,
  size = 24,
}: {
  ctx: Ctx;
  children: ReactNode;
  filled?: boolean;
  size?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${ctx.u(18)}px ${ctx.u(34)}px`,
        borderRadius: 999,
        backgroundColor: filled ? ctx.p.accent : "transparent",
        border: filled ? "none" : `${Math.max(1, ctx.u(2))}px solid ${ctx.p.borderStrong}`,
        color: filled ? ctx.p.accentFg : ctx.p.fg,
        fontFamily: FONT_STACK.ui,
        fontSize: ctx.u(size),
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}

export function Card({
  ctx,
  children,
  accent,
  style,
}: {
  ctx: Ctx;
  children: ReactNode;
  /** Draws the accent border and a left rule, for a featured card. */
  accent?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: ctx.u(32),
        borderRadius: ctx.u(20),
        backgroundColor: ctx.p.bgCard,
        border: `${Math.max(1, ctx.u(1))}px solid ${accent ? ctx.p.accent : ctx.p.borderSoft}`,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * The fleuron, at display size. The brand's bullet and its full stop.
 *
 * No U+FE0E here: the DOM needs the text-presentation selector to keep the
 * colour emoji font away, but Satori has no emoji font in play and renders the
 * selector itself as a second, empty box. The subsetted Noto Symbols face is
 * ahead of any emoji font in the stack, which achieves the same thing.
 */
export function Fleuron({ ctx, size = 44, color }: { ctx: Ctx; size?: number; color?: string }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT_STACK.display,
        fontSize: ctx.u(size),
        lineHeight: 1,
        color: color ?? ctx.p.accent,
      }}
    >
      {"❦"}
    </div>
  );
}

/** A writer's avatar — the initial on a hue field, as in the product. */
export function Initial({
  ctx,
  name,
  size = 72,
  hue = 45,
}: {
  ctx: Ctx;
  name: string;
  size?: number;
  hue?: number;
}) {
  const d = ctx.u(size);
  const initial = name.trim()[0]?.toUpperCase() ?? "?";
  return (
    <div
      style={{
        display: "flex",
        width: d,
        height: d,
        borderRadius: d,
        alignItems: "center",
        justifyContent: "center",
        // Resolved rather than written as oklch(): Satori parses neither the
        // function nor a CSS variable, and would paint this black.
        backgroundColor: oklch(0.3, 0.04, hue),
        color: oklch(0.85, 0.08, hue),
        fontFamily: FONT_STACK.display,
        fontSize: d * 0.42,
        fontWeight: 500,
      }}
    >
      {initial}
    </div>
  );
}

/**
 * A block of body copy with the fleuron as its bullet.
 *
 * Written as explicit rows rather than a <ul>, because Satori has no list
 * markers and would drop them silently.
 */
export function BulletList({
  ctx,
  items,
  size = 24,
  gap = 16,
}: {
  ctx: Ctx;
  items: string[];
  size?: number;
  gap?: number;
}) {
  return (
    <Col gap={ctx.u(gap)}>
      {items.map((item, i) => (
        <Row key={i} gap={ctx.u(14)} align="flex-start">
          <Fleuron ctx={ctx} size={size * 0.9} />
          <UIText ctx={ctx} size={size} color={ctx.p.fgMuted} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }}>
            {item}
          </UIText>
        </Row>
      ))}
    </Col>
  );
}

/**
 * A photograph on an artboard.
 *
 * Width and height are always explicit, and the container always clips. Satori
 * computes a `cover` box larger than its container and relies on the container
 * to crop it, so without `overflow: hidden` the image bleeds over whatever comes
 * next — and because Satori has no z-index, "whatever comes next" means the rest
 * of the artboard.
 *
 * An empty `src` renders the placeholder rather than a broken image, so a
 * template still reads before anyone has dropped a photograph into it.
 */
export function Image({
  ctx,
  src,
  width,
  height,
  radius = 0,
  fit = "cover",
  label = "photograph",
}: {
  ctx: Ctx;
  src: string;
  width: number | string;
  height: number | string;
  radius?: number;
  fit?: "cover" | "contain";
  label?: string;
}) {
  const frame: CSSProperties = {
    display: "flex",
    width,
    height,
    borderRadius: radius,
    overflow: "hidden",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  };

  if (!src) {
    return (
      <div
        style={{
          ...frame,
          backgroundColor: ctx.p.bgElevated,
          border: `${Math.max(1, ctx.u(1))}px dashed ${ctx.p.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: FONT_STACK.mono,
            fontSize: ctx.u(16),
            letterSpacing: `${0.18 * ctx.u(16)}px`,
            color: ctx.p.fgFaint,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      </div>
    );
  }

  return (
    <div style={frame}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        style={{ width: "100%", height: "100%", objectFit: fit }}
      />
    </div>
  );
}
