"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./MockupFrame.module.css";

/**
 * Renders a fixed-size mockup at whatever scale the available width allows.
 *
 * The alternative — letting the mockup reflow — would document a layout the
 * product does not have. So the frame measures its own column and scales the
 * whole shell, never above 1: a device mockup blown up past life size looks
 * like a bug, not a feature.
 */
export function MockupFrame({
  width,
  height,
  label,
  note,
  children,
}: {
  width: number;
  height: number;
  label: string;
  note?: string;
  children: ReactNode;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;

    const fit = () => {
      // The wrap's own width is derived from the scale, so measuring it would
      // feed back into itself and pin the scale at 1. The gallery above it is
      // the real column, and its width does not depend on ours.
      const column = el.parentElement?.parentElement ?? el.parentElement;
      const available = column?.clientWidth ?? width;
      setScale(Math.min(1, available / width));
    };

    fit();
    const ro = new ResizeObserver(fit);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div className={styles.wrap} style={{ width: Math.round(width * scale) }}>
      <div
        ref={stage}
        className={styles.stage}
        style={{ width: width * scale, height: height * scale }}
      >
        <div
          className={styles.inner}
          style={{ width, height, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
      <div className={styles.caption}>
        <span className="body-sm" style={{ color: "var(--fg)" }}>
          {label}
        </span>
        {note && <span className="mono" style={{ fontSize: 9 }}>{note}</span>}
      </div>
    </div>
  );
}

/** Lays mockups out side by side, becoming a snap-scroll rail on narrow screens. */
export function MockupGallery({ children }: { children: ReactNode }) {
  return <div className={styles.gallery}>{children}</div>;
}
