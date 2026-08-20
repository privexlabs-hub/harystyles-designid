"use client";

import type { ReactElement } from "react";

/**
 * Shows an artboard at a chosen display width.
 *
 * The tree is rendered at its true pixel size and scaled as a whole, never
 * reflowed — the preview has to describe the same layout the exporter will
 * produce, and a reflowed preview would not.
 */
export function ArtboardPreview({
  element,
  width,
  height,
  displayWidth,
}: {
  element: ReactElement;
  width: number;
  height: number;
  displayWidth: number;
}) {
  const scale = displayWidth / width;
  return (
    <div
      style={{
        width: displayWidth,
        height: height * scale,
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {element}
      </div>
    </div>
  );
}
