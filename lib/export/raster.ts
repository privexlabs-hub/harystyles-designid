/**
 * The resvg half of the pipeline: SVG → PNG pixels.
 *
 * resvg is a wasm module and must be initialised exactly once per thread. The
 * binary is copied into public/wasm by scripts/copy-wasm.mjs and version-locked
 * to the installed package.
 */
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import { assetUrl } from "@/lib/assetUrl";

let ready: Promise<void> | null = null;

export function initRasteriser(): Promise<void> {
  ready ??= (async () => {
    const res = await fetch(assetUrl("wasm/resvg.wasm"));
    if (!res.ok) throw new Error(`resvg wasm fetch failed (${res.status})`);
    // Streaming compilation needs Content-Type: application/wasm; falling back
    // to a buffer keeps this working on hosts that serve it as octet-stream.
    const type = res.headers.get("content-type") ?? "";
    await initWasm(type.includes("application/wasm") ? res : await res.arrayBuffer());
  })().catch((err) => {
    // A failed init must not poison the cache — the next attempt should retry.
    ready = null;
    throw err;
  });
  return ready;
}

export type RasterOptions = {
  /** 1, 2 or 3. The SVG is authored at 1x and scaled here. */
  scale?: number;
  /** Painted behind the artboard. Omit for transparency. */
  background?: string;
};

/** Rasterises an SVG string to PNG bytes. */
export async function svgToPng(
  svg: string,
  { scale = 1, background }: RasterOptions = {},
): Promise<Uint8Array> {
  await initRasteriser();

  const resvg = new Resvg(svg, {
    fitTo: { mode: "zoom", value: scale },
    ...(background ? { background } : {}),
  });

  const rendered = resvg.render();
  const png = rendered.asPng();

  // The wasm objects hold their pixel buffers outside the JS heap, so they are
  // invisible to the GC. At 3240x5760 that is 71 MiB a piece — free them now,
  // not whenever a collection happens to run.
  rendered.free();
  resvg.free();

  return png;
}

/**
 * Rasterises to a fixed pixel width instead of a multiplier — used for library
 * thumbnails, which must be rendered at the template's true dimensions (so text
 * wraps identically) and only then scaled down.
 */
export async function svgToPngWidth(svg: string, width: number): Promise<Uint8Array> {
  await initRasteriser();

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: width } });
  const rendered = resvg.render();
  const png = rendered.asPng();
  rendered.free();
  resvg.free();
  return png;
}
