/**
 * The frame every template renders inside.
 *
 * Templates describe content; the artboard supplies the surface, the background
 * treatment, the lockup and the margin. That is what makes one variation axis
 * change all 150 templates at once instead of 150 edits.
 *
 * Written in Satori's CSS subset — flexbox only, explicit `display` on any
 * element with more than one child, no z-index (paint order is source order),
 * no filters. See lib/satori/constraints.ts.
 */
import type { ReactNode } from "react";
import { mix, tokenAlpha } from "@/lib/color";
import { FONT_STACK } from "@/lib/satori/fonts";
import { GRAIN_TILE } from "./textures";
import type { Ctx, CornerId, LockupId } from "./types";

// ---------------------------------------------------------------- lockup

/** The mark, as inline SVG. Satori rasterises this into the output. */
export function Mark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
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
    </svg>
  );
}

function Lockup({ ctx, kind }: { ctx: Ctx; kind: LockupId }) {
  const { p, u } = ctx;
  if (kind === "none") return null;

  const markSize = u(34);
  const wordSize = u(30);

  if (kind === "mark") return <Mark size={markSize} color={p.accent} />;

  if (kind === "stamp") {
    const d = u(72);
    return (
      <div
        style={{
          display: "flex",
          width: d,
          height: d,
          borderRadius: d,
          border: `${Math.max(1, u(1.5))}px solid ${p.accent}`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Mark size={d * 0.44} color={p.accent} />
      </div>
    );
  }

  const wordmark = (
    <div
      style={{
        display: "flex",
        fontFamily: FONT_STACK.display,
        fontSize: wordSize,
        color: p.fgStrong,
        letterSpacing: `${-0.035 * wordSize}px`,
      }}
    >
      harystyles
      <span style={{ color: p.accent }}>.</span>
    </div>
  );

  if (kind === "tagline") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: u(6) }}>
        {wordmark}
        <div
          style={{
            fontFamily: FONT_STACK.mono,
            fontSize: u(11),
            color: p.accent,
            letterSpacing: `${0.18 * u(11)}px`,
          }}
        >
          LETTERS, NOT POSTS
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: u(10) }}>
      <Mark size={markSize} color={p.accent} />
      {wordmark}
    </div>
  );
}

const CORNER_STYLE: Record<CornerId, Record<string, number | string>> = {
  "top-left": { top: 0, left: 0, justifyContent: "flex-start" },
  "top-right": { top: 0, right: 0, justifyContent: "flex-end" },
  "bottom-left": { bottom: 0, left: 0, justifyContent: "flex-start" },
  "bottom-right": { bottom: 0, right: 0, justifyContent: "flex-end" },
};

// ---------------------------------------------------------------- background

/**
 * Background treatments, each a full-bleed layer painted before the content.
 * They are siblings rather than stacked children because Satori has no
 * z-index — paint order is source order, and that is the whole story.
 */
function Background({ ctx }: { ctx: Ctx }) {
  const { p, variant, size } = ctx;
  const fill: Record<string, string | number> = {
    position: "absolute",
    top: 0,
    left: 0,
    width: size.w,
    height: size.h,
    display: "flex",
  };

  switch (variant.background) {
    case "lamp":
      // The lamp: a warm pool above centre, the brand's one permitted glow.
      return (
        <div
          style={{
            ...fill,
            backgroundImage: `radial-gradient(circle at 50% 34%, ${p.accent}3d 0%, ${p.accent}14 42%, ${p.bg}00 72%)`,
          }}
        />
      );

    case "grain":
      return (
        <div
          style={{
            ...fill,
            backgroundImage: `url(${GRAIN_TILE})`,
            backgroundRepeat: "repeat",
            opacity: p.light ? 0.5 : 0.32,
          }}
        />
      );

    case "rule": {
      // A hairline frame, inset — the editorial page border.
      const inset = ctx.u(28);
      return (
        <div
          style={{
            position: "absolute",
            top: inset,
            left: inset,
            width: size.w - inset * 2,
            height: size.h - inset * 2,
            display: "flex",
            border: `${Math.max(1, ctx.u(1))}px solid ${p.border}`,
          }}
        />
      );
    }

    case "gradient":
      // Every stop is opaque, and the accent tint is pre-composited against the
      // page colour rather than laid over it at 18%.
      //
      // A translucent stop in a LINEAR gradient is the one background treatment
      // the two renderers genuinely disagree about: the browser and Satori
      // interpolate alpha differently and land ~37% of pixels apart. Radial
      // gradients with alpha are fine, and so is this, because there is no alpha
      // left to interpolate.
      return (
        <div
          style={{
            ...fill,
            backgroundImage: `linear-gradient(160deg, ${mix(p.accent, p.bg, 0.18)} 0%, ${p.bg} 55%, ${p.bgRaised} 100%)`,
          }}
        />
      );

    case "flat":
    default:
      return null;
  }
}

// ---------------------------------------------------------------- safe area

/**
 * The crop guide for formats the platform mutilates — YouTube channel art shows
 * only its centre strip, Reels put chrome over the top and bottom. Drawn on the
 * canvas, never exported.
 */
export function SafeAreaGuide({ ctx }: { ctx: Ctx }) {
  const { size, p } = ctx;
  if (!size.safe) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: (size.h - size.safe.h) / 2,
        left: (size.w - size.safe.w) / 2,
        width: size.safe.w,
        height: size.safe.h,
        display: "flex",
        border: `2px dashed ${p.accent}80`,
      }}
    />
  );
}

// ---------------------------------------------------------------- artboard

export const MARGIN_SCALE: Record<"comfortable" | "compact", number> = {
  comfortable: 1,
  compact: 0.7,
};

/** The margin a template's content sits inside, in artboard pixels. */
export function margin(ctx: Ctx): number {
  const base = Math.min(ctx.size.w, ctx.size.h) * 0.083;
  return Math.round(base * MARGIN_SCALE[ctx.variant.density]);
}

export function Artboard({ ctx, children }: { ctx: Ctx; children: ReactNode }) {
  const { p, size, variant, u } = ctx;
  const m = margin(ctx);

  // The lockup floats in a corner of the artboard, so the content area has to
  // give up the row it sits in — otherwise an eyebrow in the same corner lands
  // on top of the wordmark.
  const lockupHeight = variant.lockup === "none" ? 0 : variant.lockup === "stamp" ? u(72) : u(44);
  const lockupGap = lockupHeight ? u(28) : 0;
  const atTop = variant.corner.startsWith("top");
  const padTop = atTop ? lockupHeight + lockupGap : 0;
  const padBottom = atTop ? 0 : lockupHeight + lockupGap;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: size.w,
        height: size.h,
        backgroundColor: p.bg,
        color: p.fg,
        fontFamily: FONT_STACK.ui,
        overflow: "hidden",
        // Satori does no kerning and applies no ligatures. The browser does
        // both, so the same string measures differently and the two renderers
        // pick different line breaks. Turning them off in the DOM costs the
        // preview a little polish and buys exact agreement with what actually
        // gets exported — which is the artefact that matters.
        fontKerning: "none",
        fontVariantLigatures: "none",
        fontFeatureSettings: '"kern" 0, "liga" 0, "clig" 0',
      }}
    >
      <Background ctx={ctx} />

      {/* Content sits above the background purely by coming after it. */}
      <div
        style={{
          position: "absolute",
          top: m + padTop,
          left: m,
          width: size.w - m * 2,
          height: size.h - m * 2 - padTop - padBottom,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>

      {variant.lockup !== "none" && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            padding: m,
            width: size.w,
            ...CORNER_STYLE[variant.corner],
          }}
        >
          <Lockup ctx={ctx} kind={variant.lockup} />
        </div>
      )}
    </div>
  );
}

/** A scrim, for artboards that put type over imagery. */
export const scrimStyle = (theme: string, alpha: number) =>
  theme === "paper" ? tokenAlpha("paper-fg-strong", alpha) : tokenAlpha("ink-1000", alpha);
