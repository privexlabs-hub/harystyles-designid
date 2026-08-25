/**
 * The rasterisation worker.
 *
 * Everything that turns a template into pixels happens here, off the main
 * thread: Satori, resvg-wasm and the OffscreenCanvas encoders. A 3240x5760
 * raster is ~75 MiB of pixel data and resvg's wasm heap grows to hold it; doing
 * that on the UI thread janks the editor for seconds at a time.
 *
 * The boundary carries descriptions, never React. Element trees are not
 * structured-cloneable, so the worker looks the template up in the registry and
 * builds the tree itself from {templateId, sizeId, variant, values, slide} —
 * which is also why the registry has stable ids.
 *
 * Results cross back as transferable ArrayBuffers. `toDataURL()` is banned
 * here: base64 inflates every buffer by a third and pins it in the string heap
 * where nothing can transfer or free it.
 *
 * Instantiate as:
 *   new Worker(new URL("../lib/export/render.worker.ts", import.meta.url), { type: "module" })
 */
import { renderToSvg } from "@/lib/satori/render";
import { getTemplate } from "@/lib/templates/registry";
import { renderTemplate } from "@/lib/templates/render";
import type { FieldValues, Variant } from "@/lib/templates/types";
import { svgToPng, svgToPngWidth } from "./raster";

// ---------------------------------------------------------------- protocol

/** A template, addressed by id rather than by value. Structured-cloneable. */
export type ExportRequest = {
  templateId: string;
  /** One of the template's own sizes. Defaults to the first. */
  sizeId?: string;
  variant?: Partial<Variant>;
  values?: FieldValues;
  /**
   * Photographs, keyed by the field that holds them.
   *
   * Bytes rather than data URIs: a transferable buffer costs a pointer across
   * `postMessage` where base64 would cost a copy of the whole photograph, and
   * this thread has to base64 it once for Satori anyway.
   */
  images?: Record<string, Uint8Array>;
  /** Which slide of a carousel. Ignored by everything else. */
  slide?: number;
};

/** Raster formats the worker can encode. `svg` comes back as text. */
export type RasterFormatId = "png" | "jpeg" | "webp";

export type RenderJob = {
  kind: "render";
  req: ExportRequest;
  format: RasterFormatId | "svg";
  /** 1, 2 or 3. Ignored by `svg`, which is resolution-independent. */
  scale?: number;
  /** 0–1, for the lossy formats. */
  quality?: number;
  /** Painted behind the artboard. Omit for a transparent PNG. */
  background?: string;
};

export type ThumbnailJob = { kind: "thumbnail"; req: ExportRequest; width: number };

export type ProbeJob = { kind: "probe" };

export type Job = RenderJob | ThumbnailJob | ProbeJob;

export type JobResult =
  | { kind: "bytes"; buffer: ArrayBuffer; mime: string; width: number; height: number }
  | { kind: "text"; text: string }
  | { kind: "probe"; maxCanvasDimension: number; deviceMemory: number | null; hardwareConcurrency: number };

export type WorkerRequest = { id: number; job: Job };

export type WorkerResponse =
  | { id: number; ok: true; result: JobResult }
  | { id: number; ok: false; error: string };

// ---------------------------------------------------------------- rendering

function toSvg(req: ExportRequest): Promise<string> {
  const template = getTemplate(req.templateId);
  if (!template) throw new Error(`Unknown template: ${req.templateId}`);

  const size = template.sizes.find((s) => s.id === req.sizeId) ?? template.sizes[0];

  return renderToSvg(
    renderTemplate({
      template,
      size,
      variant: req.variant,
      values: req.values,
      images: toDataUris(req.images),
      slide: req.slide ?? 0,
    }),
    { width: size.w, height: size.h },
  );
}

/**
 * Bytes to data URIs, for Satori.
 *
 * Base64 only ever happens here, on the worker thread, and only once per render
 * — Satori embeds the result into its SVG output regardless, so this is a cost
 * the format imposes rather than one we are choosing.
 *
 * The type is sniffed from the first bytes because the blob's MIME type does not
 * survive the trip; getting it wrong would make the browser refuse to decode.
 */
function toDataUris(images?: Record<string, Uint8Array>): Record<string, string> | undefined {
  if (!images) return undefined;
  const out: Record<string, string> = {};

  for (const [key, bytes] of Object.entries(images)) {
    const mime =
      bytes[0] === 0x89 && bytes[1] === 0x50
        ? "image/png"
        : bytes[0] === 0xff && bytes[1] === 0xd8
          ? "image/jpeg"
          : bytes[0] === 0x52 && bytes[1] === 0x49
            ? "image/webp"
            : "image/png";

    // Chunked, because String.fromCharCode(...bytes) blows the argument limit
    // somewhere around a hundred thousand pixels.
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    out[key] = `data:${mime};base64,${btoa(binary)}`;
  }

  return out;
}

/**
 * Reads the pixel dimensions out of a PNG's IHDR chunk — bytes 16..24, big
 * endian, immediately after the 8-byte signature and the chunk header.
 *
 * Cheaper than decoding the image, and it keeps the resvg render object's
 * lifetime entirely inside raster.ts where the `.free()` calls live.
 */
function pngSize(bytes: Uint8Array): { width: number; height: number } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

/** Detaches a Uint8Array's bytes into a standalone buffer fit for transfer. */
function ownBuffer(bytes: Uint8Array): ArrayBuffer {
  // resvg hands back a view over the wasm heap, which cannot be transferred and
  // is invalidated by the next render. Copy once, here, and never again.
  return bytes.slice().buffer as ArrayBuffer;
}

/**
 * Re-encodes PNG pixels as JPEG or WebP through an OffscreenCanvas.
 *
 * resvg only emits PNG, so lossy output costs one decode and one encode. The
 * bitmap and the canvas are both released immediately: a 3240² bitmap is 42 MiB
 * of GPU-adjacent memory that the GC is in no hurry to reclaim.
 */
async function encodeLossy(
  png: Uint8Array,
  mime: "image/jpeg" | "image/webp",
  quality: number,
): Promise<JobResult> {
  const bitmap = await createImageBitmap(
    new Blob([ownBuffer(png)], { type: "image/png" }),
  );

  try {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("OffscreenCanvas 2d context unavailable");

    ctx.drawImage(bitmap, 0, 0);
    const blob = await canvas.convertToBlob({ type: mime, quality });

    // Zero the canvas so the backing store is collectable even if the encoder
    // holds a reference to the element for a while.
    canvas.width = 0;
    canvas.height = 0;

    if (blob.type !== mime) throw new Error(`${mime} encoding is not supported here`);

    return {
      kind: "bytes",
      buffer: await blob.arrayBuffer(),
      mime,
      width: bitmap.width,
      height: bitmap.height,
    };
  } finally {
    bitmap.close();
  }
}

/**
 * The largest square OffscreenCanvas this thread can actually paint into.
 *
 * Allocation succeeds well past the real limit on iOS Safari — the canvas is
 * simply blank — so the probe writes a pixel into the far corner and reads it
 * back. Binary search over the plausible range costs a handful of allocations
 * and no UA sniffing, which is the point: the cap is a device property, not a
 * browser-name property.
 */
function probeMaxCanvas(): number {
  const paints = (n: number): boolean => {
    try {
      const canvas = new OffscreenCanvas(n, n);
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;
      ctx.fillStyle = "#fff";
      ctx.fillRect(n - 1, n - 1, 1, 1);
      const ok = ctx.getImageData(n - 1, n - 1, 1, 1).data[3] === 255;
      canvas.width = 0;
      canvas.height = 0;
      return ok;
    } catch {
      return false;
    }
  };

  if (!paints(1024)) return 0;

  let low = 1024;
  let high = 32768;
  while (high - low > 256) {
    const mid = Math.floor((low + high) / 2);
    if (paints(mid)) low = mid;
    else high = mid;
  }
  return low;
}

async function run(job: Job): Promise<{ result: JobResult; transfer: Transferable[] }> {
  if (job.kind === "probe") {
    const nav = self.navigator as Navigator & { deviceMemory?: number };
    return {
      result: {
        kind: "probe",
        maxCanvasDimension: probeMaxCanvas(),
        deviceMemory: typeof nav.deviceMemory === "number" ? nav.deviceMemory : null,
        hardwareConcurrency: nav.hardwareConcurrency ?? 1,
      },
      transfer: [],
    };
  }

  if (job.kind === "thumbnail") {
    // Rendered at the template's true dimensions and only then scaled down —
    // rendering at a smaller logical width would re-wrap the text, making the
    // thumbnail a different design from the export.
    const png = await svgToPngWidth(await toSvg(job.req), job.width);
    const buffer = ownBuffer(png);
    const { width, height } = pngSize(png);
    return { result: { kind: "bytes", buffer, mime: "image/png", width, height }, transfer: [buffer] };
  }

  if (job.format === "svg") {
    return { result: { kind: "text", text: await toSvg(job.req) }, transfer: [] };
  }

  const svg = await toSvg(job.req);
  const scale = job.scale ?? 1;

  // JPEG has no alpha, so the matte is painted by resvg rather than composited
  // afterwards: one fewer full-size buffer, and no fringing on antialiased type.
  const png = await svgToPng(svg, { scale, background: job.background });

  if (job.format === "png") {
    const buffer = ownBuffer(png);
    const { width, height } = pngSize(png);
    return { result: { kind: "bytes", buffer, mime: "image/png", width, height }, transfer: [buffer] };
  }

  const mime = job.format === "jpeg" ? "image/jpeg" : "image/webp";
  const result = await encodeLossy(png, mime, job.quality ?? 0.92);
  return { result, transfer: result.kind === "bytes" ? [result.buffer] : [] };
}

// ---------------------------------------------------------------- dispatch

// Jobs are handled one at a time on purpose. Two concurrent resvg renders share
// one wasm heap and their peaks add up; serialising here means the ceiling is
// one artboard, and parallelism (when the device can afford it) comes from
// running more than one worker.
let queue: Promise<void> = Promise.resolve();

self.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
  const { id, job } = event.data;

  queue = queue.then(async () => {
    const post = (message: WorkerResponse, transfer: Transferable[] = []) =>
      (self as unknown as Worker).postMessage(message, transfer);

    try {
      const { result, transfer } = await run(job);
      post({ id, ok: true, result }, transfer);
    } catch (err) {
      post({ id, ok: false, error: err instanceof Error ? err.message : String(err) });
    }
  });
});
