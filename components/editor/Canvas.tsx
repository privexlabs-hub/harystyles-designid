"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EmptyState } from "@/components/ui";
import { collectImageUrls } from "@/lib/store/images";
import { getTemplate } from "@/lib/templates/registry";
import { renderTemplate } from "@/lib/templates/render";
import { SafeAreaGuide } from "@/lib/templates/Artboard";
import { makeCtx } from "@/lib/templates/context";
import { currentSize, selectPage, useCurrentValues, useEditor } from "@/lib/store/editor";
import { DEFAULT_VARIANT } from "@/lib/templates/types";
import styles from "./Canvas.module.css";

/**
 * The artboard, on a pan-and-zoom surface.
 *
 * The transform lives in a ref and is written straight to the DOM rather than
 * held in React state — panning at sixty frames a second through a re-render of
 * a full artboard tree is not something the editor can afford. The same trick
 * the original design canvas used.
 */
export function Canvas() {
  const templateId = useEditor((s) => selectPage(s)?.templateId ?? "");
  const sizeId = useEditor((s) => selectPage(s)?.sizeId ?? null);
  const variant = useEditor((s) => selectPage(s)?.variant ?? DEFAULT_VARIANT);
  const values = useCurrentValues();
  const slide = useEditor((s) => selectPage(s)?.slide ?? 0);
  const showGuides = useEditor((s) => s.showGuides);
  const fitRequest = useEditor((s) => s.fitRequest);

  // Object URLs, not data URIs: the preview redraws on every keystroke and
  // base64ing a photograph each time would stall the canvas. The exporter takes
  // the same bytes as data URIs, which is the one thing Satori can draw.
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    let created: string[] = [];

    void collectImageUrls(values).then((urls) => {
      if (cancelled) {
        Object.values(urls).forEach(URL.revokeObjectURL);
        return;
      }
      created = Object.values(urls);
      setImages(urls);
    });

    return () => {
      cancelled = true;
      created.forEach(URL.revokeObjectURL);
    };
  }, [values]);

  const viewport = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const tf = useRef({ x: 0, y: 0, scale: 1 });
  const [zoomLabel, setZoomLabel] = useState(100);

  const template = getTemplate(templateId);
  const size = currentSize({ templateId, sizeId });

  const apply = useCallback(() => {
    const el = world.current;
    if (!el) return;
    const { x, y, scale } = tf.current;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Only the readout goes into React state. Writing the scale back to the
    // store on every frame would re-run the effects that own the transform,
    // which is an infinite loop with a nice smooth animation on it.
    setZoomLabel(Math.round(scale * 100));
  }, []);

  /** Centres the artboard and scales it to fit, with a margin to breathe. */
  const fit = useCallback(() => {
    const vp = viewport.current;
    if (!vp) return;

    const width = vp.clientWidth;
    const height = vp.clientHeight;
    // Nothing sensible to fit into yet — during a layout pass, or in a pane that
    // has not been given its size. Leave the transform alone rather than
    // computing a scale from a collapsed box.
    if (width <= 0 || height <= 0) return;

    // Proportional, not a flat 72 a side: on a 360px phone that was 144px —
    // forty per cent of the width — spent before anything was drawn.
    const pad = Math.min(72, Math.max(16, Math.min(width, height) * 0.06));

    const scale = Math.min(
      (width - pad * 2) / size.w,
      (height - pad * 2) / size.h,
      1,
    );

    // Clamped like setZoom and zoomAt, which this used to be the only exception
    // to. An unclamped fit in a narrow pane returned a negative scale, and the
    // artboard inverted rather than merely shrinking.
    const clamped = Math.min(4, Math.max(0.02, scale));

    tf.current = {
      scale: clamped,
      x: (width - size.w * clamped) / 2,
      y: (height - size.h * clamped) / 2,
    };
    apply();
  }, [size.w, size.h, apply]);

  useEffect(fit, [fit, fitRequest]);

  useEffect(() => {
    const vp = viewport.current;
    if (!vp) return;
    const ro = new ResizeObserver(fit);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [fit]);

  /** Zooms about a point, so whatever is under the cursor stays under it. */
  const zoomAt = useCallback(
    (cx: number, cy: number, factor: number) => {
      const vp = viewport.current;
      if (!vp) return;
      const rect = vp.getBoundingClientRect();
      const px = cx - rect.left;
      const py = cy - rect.top;
      const prev = tf.current.scale;
      const next = Math.min(4, Math.max(0.05, prev * factor));
      const k = next / prev;
      tf.current = {
        scale: next,
        x: px - (px - tf.current.x) * k,
        y: py - (py - tf.current.y) * k,
      };
      apply();
    },
    [apply],
  );

  useEffect(() => {
    const vp = viewport.current;
    if (!vp) return;

    /** A mouse wheel arrives in coarse notches; a trackpad in fine pixel deltas. */
    const isMouseWheel = (e: WheelEvent) =>
      e.deltaMode !== 0 || (e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey) return zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      if (isMouseWheel(e)) return zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      tf.current.x -= e.deltaX;
      tf.current.y -= e.deltaY;
      apply();
    };

    // Safari sends its own pinch events and ALSO wheel events; the flag stops
    // the two fighting each other.
    let gesturing = false;
    let gestureBase = 1;
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      gesturing = true;
      gestureBase = tf.current.scale;
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      const ge = e as Event & { scale: number; clientX: number; clientY: number };
      zoomAt(ge.clientX, ge.clientY, (gestureBase * ge.scale) / tf.current.scale);
    };
    const onGestureEnd = () => {
      gesturing = false;
    };

    const wheelGuard = (e: WheelEvent) => {
      if (gesturing) {
        e.preventDefault();
        return;
      }
      onWheel(e);
    };

    vp.addEventListener("wheel", wheelGuard, { passive: false });
    vp.addEventListener("gesturestart", onGestureStart as EventListener, { passive: false });
    vp.addEventListener("gesturechange", onGestureChange as EventListener, { passive: false });
    vp.addEventListener("gestureend", onGestureEnd as EventListener);

    return () => {
      vp.removeEventListener("wheel", wheelGuard);
      vp.removeEventListener("gesturestart", onGestureStart as EventListener);
      vp.removeEventListener("gesturechange", onGestureChange as EventListener);
      vp.removeEventListener("gestureend", onGestureEnd as EventListener);
    };
  }, [apply, zoomAt]);

  /**
   * Arrows pan, +/- zoom, 0 and f fit.
   *
   * The viewport carries role="application", which tells a screen reader to
   * hand keystrokes straight to this widget rather than interpreting them. That
   * is only honest if the widget answers them.
   */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 200 : 60;
    const vp = viewport.current;

    switch (e.key) {
      case "ArrowLeft":
        tf.current.x += step;
        break;
      case "ArrowRight":
        tf.current.x -= step;
        break;
      case "ArrowUp":
        tf.current.y += step;
        break;
      case "ArrowDown":
        tf.current.y -= step;
        break;
      case "+":
      case "=":
      case "-":
      case "_": {
        // Zoom about the middle of the viewport, since there is no cursor.
        const rect = vp?.getBoundingClientRect();
        if (!rect) return;
        const inward = e.key === "+" || e.key === "=";
        zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, inward ? 1.2 : 1 / 1.2);
        e.preventDefault();
        return;
      }
      default:
        return;
    }

    e.preventDefault();
    apply();
  };

  /** Drag to pan, with pointer capture so the drag survives leaving the element. */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.button !== 1) return;
    const vp = viewport.current;
    if (!vp) return;
    const start = { x: e.clientX, y: e.clientY, tx: tf.current.x, ty: tf.current.y };
    vp.setPointerCapture(e.pointerId);
    vp.style.cursor = "grabbing";

    const move = (ev: PointerEvent) => {
      tf.current.x = start.tx + (ev.clientX - start.x);
      tf.current.y = start.ty + (ev.clientY - start.y);
      apply();
    };
    const up = () => {
      vp.style.cursor = "";
      vp.removeEventListener("pointermove", move);
      vp.removeEventListener("pointerup", up);
      vp.removeEventListener("pointercancel", up);
    };
    vp.addEventListener("pointermove", move);
    vp.addEventListener("pointerup", up);
    vp.addEventListener("pointercancel", up);
  };

  if (!template) {
    // A blank grey pane is indistinguishable from a crash. This happens when a
    // saved project references a template that has since been renamed or
    // removed, so it names the id rather than shrugging.
    return (
      <div className={styles.stage}>
        <div className={styles.viewport} ref={viewport}>
          <div className={styles.missing}>
            <EmptyState
              title="This page points at a template that is not here."
              body={
                templateId
                  ? `Nothing in the catalogue is called “${templateId}”. It may have been renamed since this project was saved. Pick another template from the library and this page will take it.`
                  : "Pick a template from the library to start."
              }
            />
          </div>
        </div>
      </div>
    );
  }

  const ctx = makeCtx({ size, variant, values });

  return (
    <div className={styles.stage}>
      <div
        ref={viewport}
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="application"
        aria-label="Artboard canvas. Arrow keys pan, plus and minus zoom, F fits to screen."
      >
        <div ref={world} className={styles.world}>
          <div className={styles.artboard} style={{ width: size.w, height: size.h }}>
            {renderTemplate({ template, size, variant, values, images, slide })}
            {/* Guides are drawn on the canvas and never reach an export —
                renderTemplate does not include them. */}
            {showGuides && size.safe && <SafeAreaGuide ctx={ctx} />}
          </div>
        </div>
      </div>

      <div className={styles.hud}>
        <span className="mono">
          {size.w}×{size.h}
        </span>
        <span className="mono">{zoomLabel}%</span>
        {size.safe && showGuides && (
          <span className="mono" style={{ color: "var(--accent)" }}>
            SAFE {size.safe.w}×{size.safe.h}
          </span>
        )}
      </div>
    </div>
  );
}
