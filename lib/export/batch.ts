/**
 * "Export all", without ever holding the export in memory.
 *
 * The shape of this file follows from one constraint: a full catalogue export
 * is several gigabytes of PNG, and a browser tab has neither the heap nor the
 * patience for that. So every artboard is rendered, appended to a zip stream
 * and dropped before the next one starts. `client-zip` takes an async iterable
 * and emits a ReadableStream; that stream is piped straight to a file handle
 * via the File System Access API, so the bytes go to disk as they are made.
 *
 * The in-memory Blob fallback exists only for browsers without that API, and
 * only under MAX_IN_MEMORY_BYTES — above it the honest answer is to refuse.
 *
 * Safe-area guides never appear here: they are a separate component the canvas
 * draws over the preview, and renderTemplate() does not include them.
 */
import { downloadZip } from "client-zip";
import { TEMPLATES, getTemplate, templatesIn } from "@/lib/templates/registry";
import type { CategoryId, Variant } from "@/lib/templates/types";
import { DEFAULT_VARIANT } from "@/lib/templates/types";
import { detectCapability } from "./capability";
import { RenderClient } from "./client";
import { assetPath } from "./download";
import { FORMATS, formatById, jpeg, pdf, png, svg, webp, type FormatId } from "./formats";
import type { ExportRequest } from "./render.worker";

// ---------------------------------------------------------------- ceilings

/** Roughly a thousand 1080² artboards. Past this the user wants a build script. */
const MAX_TOTAL_PIXELS = 4_000_000_000;
const MAX_JOBS = 800;
/** Above this, the Blob fallback is refused rather than attempted. */
const MAX_IN_MEMORY_BYTES = 150 * 1024 * 1024;

/**
 * Bytes per output pixel, measured across the probe templates. Only used for
 * the pre-flight estimate the UI shows, so being 30% out is fine; being an
 * order of magnitude out would not be.
 */
const BYTES_PER_PIXEL: Record<FormatId, number> = {
  png: 0.45,
  jpeg: 0.11,
  webp: 0.08,
  svg: 0, // resolution-independent; charged a flat cost below instead
  pdf: 0.13,
};
const SVG_FLAT_BYTES = 60 * 1024;

// ---------------------------------------------------------------- scope

export type BatchScope =
  | { kind: "template"; templateId: string }
  | { kind: "category"; category: CategoryId }
  /**
   * The whole catalogue. One variant per template by default: the six variant
   * axes multiply into thousands of artboards, which is a decision a person
   * should make deliberately rather than discover halfway through a download.
   */
  | { kind: "everything"; variants?: Partial<Variant>[] };

export type BatchOptions = {
  formats?: FormatId[];
  scale?: number;
  quality?: number;
  transparent?: boolean;
  matte?: string;
  /** Variant combinations to render each template at. Defaults to its own. */
  variants?: Partial<Variant>[];
  /** Overrides capability.ts. Still clamped to 2. */
  concurrency?: number;
};

// ---------------------------------------------------------------- plan

export type BatchJob = {
  templateId: string;
  name: string;
  category: string;
  sizeId: string;
  width: number;
  height: number;
  variant: Variant;
  format: FormatId;
  scale: number;
  /** Set for carousel slides only. */
  slide?: number;
  /** Where it lands inside the zip. */
  path: string;
  /** Output pixels, for the estimate and the ceiling check. */
  pixels: number;
  estimatedBytes: number;
};

export type BatchRefusal = {
  code: "too-many-files" | "too-many-pixels" | "empty";
  message: string;
  jobCount: number;
  totalPixels: number;
};

export type BatchPlan =
  | { ok: true; jobs: BatchJob[]; totalPixels: number; estimatedBytes: number }
  | { ok: false; refusal: BatchRefusal };

function variantFor(templateId: string, override?: Partial<Variant>): Variant {
  const template = getTemplate(templateId);
  return { ...DEFAULT_VARIANT, ...template?.variantDefaults, ...override };
}

/**
 * What a scope would produce, priced up before a single pixel is rendered.
 *
 * Returns a structured refusal rather than throwing: the caller is a panel that
 * wants to explain the ceiling, not a try/catch.
 */
export function planBatch(scope: BatchScope, opts: BatchOptions = {}): BatchPlan {
  const formats = opts.formats?.length ? opts.formats : (["png"] as FormatId[]);
  const scale = opts.scale ?? 2;

  const templates =
    scope.kind === "template"
      ? TEMPLATES.filter((t) => t.id === scope.templateId)
      : scope.kind === "category"
        ? templatesIn(scope.category)
        : TEMPLATES;

  const variants =
    opts.variants ?? (scope.kind === "everything" ? scope.variants : undefined) ?? [undefined];

  const jobs: BatchJob[] = [];

  for (const template of templates) {
    const size = template.sizes[0];
    const slides = template.slides ?? 1;

    for (const override of variants) {
      const variant = variantFor(template.id, override);

      for (const format of formats) {
        const descriptor = formatById(format);
        // SVG has no pixel scale; asking for it at 1x, 2x and 3x would write
        // three identical files.
        const effectiveScale = descriptor.scalable ? scale : 1;

        for (let slide = 0; slide < slides; slide++) {
          const pixels = size.w * size.h * effectiveScale * effectiveScale;
          jobs.push({
            templateId: template.id,
            name: template.name,
            category: template.category,
            sizeId: size.id,
            width: size.w * effectiveScale,
            height: size.h * effectiveScale,
            variant,
            format,
            scale: effectiveScale,
            slide: slides > 1 ? slide : undefined,
            path: assetPath({
              templateId: template.id,
              variant,
              scale: effectiveScale,
              ext: descriptor.ext,
              slide: slides > 1 ? slide : undefined,
              category: template.category,
            }),
            pixels: descriptor.id === "svg" ? 0 : pixels,
            estimatedBytes:
              descriptor.id === "svg"
                ? SVG_FLAT_BYTES
                : Math.round(pixels * BYTES_PER_PIXEL[format]),
          });
        }
      }
    }
  }

  const totalPixels = jobs.reduce((sum, j) => sum + j.pixels, 0);
  const estimatedBytes = jobs.reduce((sum, j) => sum + j.estimatedBytes, 0);

  if (!jobs.length) {
    return {
      ok: false,
      refusal: { code: "empty", message: "Nothing in this scope to export.", jobCount: 0, totalPixels: 0 },
    };
  }
  if (jobs.length > MAX_JOBS) {
    return {
      ok: false,
      refusal: {
        code: "too-many-files",
        message: `That would be ${jobs.length.toLocaleString()} files; the ceiling is ${MAX_JOBS.toLocaleString()}. Narrow the scope, or pick fewer variants or formats.`,
        jobCount: jobs.length,
        totalPixels,
      },
    };
  }
  if (totalPixels > MAX_TOTAL_PIXELS) {
    return {
      ok: false,
      refusal: {
        code: "too-many-pixels",
        message: `That would render ${(totalPixels / 1e9).toFixed(1)} billion pixels; the ceiling is ${MAX_TOTAL_PIXELS / 1e9} billion. Try 2x instead of 3x, or export one category at a time.`,
        jobCount: jobs.length,
        totalPixels,
      },
    };
  }

  return { ok: true, jobs, totalPixels, estimatedBytes };
}

// ---------------------------------------------------------------- sidecars

/** Machine-readable index of everything in the zip. */
function manifest(jobs: BatchJob[]): string {
  return JSON.stringify(
    {
      generated: new Date().toISOString(),
      count: jobs.length,
      files: jobs.map((j) => ({
        id: j.templateId,
        name: j.name,
        category: j.category,
        size: { id: j.sizeId, width: j.width, height: j.height },
        variant: j.variant,
        format: j.format,
        scale: j.scale,
        ...(j.slide === undefined ? {} : { slide: j.slide + 1 }),
        filename: j.path,
      })),
    },
    null,
    2,
  );
}

/** The human-readable half: what each shape is for and where it goes. */
function readme(jobs: BatchJob[]): string {
  const shapes = new Map<string, { w: number; h: number; count: number }>();
  for (const job of jobs) {
    const key = `${job.width / job.scale}×${job.height / job.scale}`;
    const entry = shapes.get(key) ?? { w: job.width / job.scale, h: job.height / job.scale, count: 0 };
    entry.count += 1;
    shapes.set(key, entry);
  }

  const lines = [
    "harystyles — brand assets",
    "=========================",
    "",
    `${jobs.length} files, exported ${new Date().toLocaleString()}.`,
    "Folders follow the template category. Filenames are",
    "  {category}/{template}--{theme}-{accent}@{scale}.{ext}",
    "and carousels get a folder of their own, one file per slide.",
    "",
    "Shapes in this export",
    "---------------------",
  ];

  for (const [key, shape] of shapes) {
    lines.push(`  ${key.padEnd(12)} ${String(shape.count).padStart(4)} file(s)   ${placement(shape.w, shape.h)}`);
  }

  lines.push(
    "",
    "Notes",
    "-----",
    "  · PNGs are lossless — use them anywhere type matters.",
    "  · JPEGs are flattened onto a matte colour and have no transparency.",
    "  · PDFs are 300 DPI raster pages, not vector text.",
    "  · Safe-area guides are editor-only and never appear in these files.",
    "  · manifest.json lists every file with its template, variant and size.",
    "",
  );

  return lines.join("\n");
}

/** Where a given shape actually gets uploaded. */
function placement(w: number, h: number): string {
  const ratio = w / h;
  if (w === h) return "Instagram / LinkedIn feed post, avatar crops";
  if (Math.abs(ratio - 9 / 16) < 0.02) return "Stories, Reels, TikTok";
  if (Math.abs(ratio - 4 / 5) < 0.02) return "Instagram portrait feed post";
  if (Math.abs(ratio - 16 / 9) < 0.02) return "YouTube thumbnail, slides, wide banners";
  if (ratio > 3) return "Profile header / cover banner";
  return "Link previews, ads, email blocks";
}

// ---------------------------------------------------------------- run

export type BatchProgress = {
  done: number;
  total: number;
  currentName: string;
  /** Bytes written so far, counting only the rasters themselves. */
  bytes: number;
};

export type BatchResult =
  | { ok: true; files: number; bytes: number; streamed: boolean }
  | { ok: false; reason: "cancelled" | "no-destination" | "too-large-for-memory" | "failed"; message: string };

export type BatchHandle = {
  result: Promise<BatchResult>;
  /**
   * Terminates the worker. Genuinely stops the render — a flag would only take
   * effect between artboards, and one 3x artboard can be several seconds.
   */
  cancel: () => void;
};

type FileSystemPicker = (options?: {
  suggestedName?: string;
  types?: { description: string; accept: Record<string, string[]> }[];
}) => Promise<FileSystemFileHandle>;

function picker(): FileSystemPicker | null {
  const w = globalThis as unknown as { showSaveFilePicker?: FileSystemPicker };
  return typeof w.showSaveFilePicker === "function" ? w.showSaveFilePicker.bind(globalThis) : null;
}

async function renderJob(
  client: RenderClient,
  job: BatchJob,
  opts: BatchOptions,
): Promise<Uint8Array> {
  const req: ExportRequest = {
    templateId: job.templateId,
    sizeId: job.sizeId,
    variant: job.variant,
    slide: job.slide,
  };
  const shared = { client, scale: job.scale };

  switch (job.format) {
    case "png":
      return (await png(req, { ...shared, transparent: opts.transparent ?? false, matte: opts.matte }))
        .bytes;
    case "jpeg":
      return (await jpeg(req, { ...shared, quality: opts.quality, matte: opts.matte })).bytes;
    case "webp":
      return (await webp(req, { ...shared, quality: opts.quality })).bytes;
    case "svg":
      return new TextEncoder().encode(await svg(req, { client }));
    case "pdf":
      return pdf(req, shared);
  }
}

/**
 * Runs a plan into a zip.
 *
 * `concurrency` buys nothing on a single worker, so it spins up that many
 * clients and round-robins jobs between them. The zip stream still consumes
 * them in order — client-zip cannot interleave entries — so the gain is only
 * that the next artboard is already rendering while the current one is written.
 * capability.ts caps this at 2 for good reason; see the comment there.
 */
export function runBatch(
  plan: Extract<BatchPlan, { ok: true }>,
  opts: BatchOptions = {},
  onProgress?: (p: BatchProgress) => void,
): BatchHandle {
  const clients: RenderClient[] = [];
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    for (const client of clients) client.terminate();
  };

  const result = (async (): Promise<BatchResult> => {
    const cap = await detectCapability();
    const lanes = Math.min(2, Math.max(1, opts.concurrency ?? cap.concurrency));
    for (let i = 0; i < lanes; i++) clients.push(new RenderClient());

    const jobs = plan.jobs;
    let done = 0;
    let bytes = 0;

    async function* entries() {
      // Renders run one lane ahead of the writer: `inFlight[i]` is already
      // rendering while entry i-1 is being compressed. Only `lanes` rasters are
      // alive at any moment, which is the whole memory budget of this pipeline.
      const inFlight: (Promise<Uint8Array> | null)[] = jobs.map(() => null);
      const start = (index: number) => {
        if (index < jobs.length && !inFlight[index]) {
          inFlight[index] = renderJob(clients[index % clients.length], jobs[index], opts);
        }
      };

      for (let i = 0; i < lanes; i++) start(i);

      for (let i = 0; i < jobs.length; i++) {
        if (cancelled) throw new Error("cancelled");
        start(i);
        const data = await inFlight[i]!;
        inFlight[i] = null;
        start(i + lanes);

        done += 1;
        bytes += data.byteLength;
        onProgress?.({ done, total: jobs.length, currentName: jobs[i].path, bytes });

        yield { name: jobs[i].path, input: data, lastModified: new Date() };
      }

      yield { name: "manifest.json", input: manifest(jobs), lastModified: new Date() };
      yield { name: "README.txt", input: readme(jobs), lastModified: new Date() };
    }

    try {
      const save = picker();

      if (save) {
        // The happy path: bytes reach the filesystem as they are produced, so
        // peak memory is one artboard regardless of how big the zip gets.
        let handle: FileSystemFileHandle;
        try {
          handle = await save({
            suggestedName: "harystyles-assets.zip",
            types: [{ description: "Zip archive", accept: { "application/zip": [".zip"] } }],
          });
        } catch {
          return { ok: false, reason: "no-destination", message: "No save location chosen." };
        }

        const writable = await handle.createWritable();
        const body = downloadZip(entries()).body;
        if (!body) throw new Error("Zip stream unavailable");
        await body.pipeTo(writable);
        return { ok: true, files: jobs.length, bytes, streamed: true };
      }

      if (plan.estimatedBytes > MAX_IN_MEMORY_BYTES) {
        return {
          ok: false,
          reason: "too-large-for-memory",
          message:
            `This browser can only build the zip in memory, and this export is about ` +
            `${Math.round(plan.estimatedBytes / 1024 / 1024)} MB — over the ` +
            `${MAX_IN_MEMORY_BYTES / 1024 / 1024} MB limit. Export one category at a time, or use a Chromium browser.`,
        };
      }

      const blob = await downloadZip(entries()).blob();
      const { saveBlob } = await import("./download");
      saveBlob(blob, "harystyles-assets.zip");
      return { ok: true, files: jobs.length, bytes, streamed: false };
    } catch (err) {
      if (cancelled) return { ok: false, reason: "cancelled", message: "Export cancelled." };
      return { ok: false, reason: "failed", message: err instanceof Error ? err.message : String(err) };
    } finally {
      for (const client of clients) client.terminate();
    }
  })();

  return { result, cancel };
}

/** Re-exported so a panel can list formats without importing two modules. */
export { FORMATS };
