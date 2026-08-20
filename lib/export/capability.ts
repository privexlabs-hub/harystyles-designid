/**
 * What this device can actually export.
 *
 * The interesting limit is the canvas one. iOS Safari caps a canvas at
 * 4096x4096 and, worse, does not fail loudly: allocation succeeds and the
 * canvas paints nothing. So the ceiling is measured — a real pixel written and
 * read back at the far corner, binary-searched — rather than guessed from a
 * user-agent string, which would be wrong on desktop Safari, wrong on iPadOS
 * (which claims to be a Mac) and wrong again the next time Apple raises it.
 *
 * The probe runs in the worker, once, and the answer is cached for the session.
 */
import { RenderClient } from "./client";
import type { Size } from "@/lib/templates/sizes";

export type Capability = {
  /** Largest square canvas that actually paints. 0 if none could be made. */
  maxCanvasDimension: number;
  /** navigator.deviceMemory in GiB, where the browser reports it. */
  deviceMemory: number | null;
  hardwareConcurrency: number;
  /** How many artboards to render at once. 1 or 2, never more. */
  concurrency: number;
};

/**
 * A conservative floor used when the probe cannot run at all (no
 * OffscreenCanvas, worker blocked). 4096 is the smallest cap any browser we
 * support imposes, so assuming it degrades quality rather than producing
 * silently blank exports.
 */
const ASSUMED_MIN_CANVAS = 4096;

let cached: Promise<Capability> | null = null;

export function detectCapability(): Promise<Capability> {
  cached ??= (async (): Promise<Capability> => {
    const client = new RenderClient();
    try {
      const result = await client.run({ kind: "probe" });
      if (result.kind !== "probe") throw new Error("probe returned the wrong shape");

      const maxCanvasDimension = result.maxCanvasDimension || ASSUMED_MIN_CANVAS;
      return {
        maxCanvasDimension,
        deviceMemory: result.deviceMemory,
        hardwareConcurrency: result.hardwareConcurrency,
        concurrency: recommendConcurrency(result.deviceMemory, result.hardwareConcurrency),
      };
    } catch {
      return {
        maxCanvasDimension: ASSUMED_MIN_CANVAS,
        deviceMemory: null,
        hardwareConcurrency: 1,
        concurrency: 1,
      };
    } finally {
      // The probe worker exists only for this; it has no fonts or wasm loaded
      // worth keeping, and holding a thread open costs memory on phones.
      client.terminate();
    }
  })().catch((err) => {
    cached = null;
    throw err;
  });

  return cached;
}

/**
 * Default 1, at most 2.
 *
 * Each parallel render holds a full-size raster plus resvg's wasm heap — at 3x
 * on a 1080x1920 artboard that is around 75 MiB apiece, and mobile Safari kills
 * the tab rather than swapping. Four workers would be faster on a workstation
 * and fatal everywhere else, so the ceiling is two.
 */
function recommendConcurrency(deviceMemory: number | null, cores: number): number {
  const roomy = (deviceMemory ?? 0) >= 8 && cores >= 8;
  return roomy ? 2 : 1;
}

export type ScaleLimit = {
  /** The highest of 1, 2 or 3 this device can produce for the artboard. */
  maxScale: number;
  /** Set when maxScale < 3, phrased for the export panel. */
  reason?: string;
};

/** The full answer, including why the ceiling is where it is. */
export function scaleLimitFor(size: Size, cap: Capability): ScaleLimit {
  const longest = Math.max(size.w, size.h);

  for (const scale of [3, 2, 1]) {
    if (longest * scale <= cap.maxCanvasDimension) {
      if (scale === 3) return { maxScale: 3 };
      return {
        maxScale: scale,
        reason:
          `This device caps images at ${cap.maxCanvasDimension}px on the longest side, and ` +
          `${size.label.split(" · ")[0]} at 3x would be ${longest * 3}px.`,
      };
    }
  }

  // Even 1x is over the cap — export it anyway rather than refusing, because a
  // PNG straight from resvg never touches a canvas. Only JPEG and WebP do.
  return {
    maxScale: 1,
    reason:
      `${longest}px already exceeds this device's ${cap.maxCanvasDimension}px canvas limit; ` +
      `PNG and SVG will still export, but JPEG and WebP may fail.`,
  };
}

/** The number on its own, for callers that only need to clamp a scale. */
export async function maxScaleFor(size: Size): Promise<number> {
  return scaleLimitFor(size, await detectCapability()).maxScale;
}
