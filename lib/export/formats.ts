/**
 * One function per output format, each a thin request to the render worker.
 *
 * Everything returns bytes (or, for SVG, a string). Nothing here touches the
 * DOM or holds more than one artboard at a time, so the same functions serve
 * the editor's "download this" button and the batch pipeline.
 */
import { jsPDF } from "jspdf";
import { getTemplate } from "@/lib/templates/registry";
import type { Size } from "@/lib/templates/sizes";
import { RenderClient, expectBytes, expectText, sharedClient } from "./client";
import type { ExportRequest } from "./render.worker";

export type { ExportRequest };

export type Raster = {
  bytes: Uint8Array;
  mime: string;
  width: number;
  height: number;
};

/** Which worker to use. Batches pass their own so they stay cancellable. */
type WithClient = { client?: RenderClient };

async function raster(
  client: RenderClient,
  req: ExportRequest,
  format: "png" | "jpeg" | "webp",
  opts: { scale?: number; quality?: number; background?: string },
): Promise<Raster> {
  const result = expectBytes(
    await client.run({ kind: "render", req, format, ...opts }),
  );
  return {
    bytes: new Uint8Array(result.buffer),
    mime: result.mime,
    width: result.width,
    height: result.height,
  };
}

// ---------------------------------------------------------------- formats

export type PngOptions = WithClient & {
  /** 1, 2 or 3. Clamp against capability.ts before calling. */
  scale?: number;
  /** Default true — the artboards paint their own background anyway, but a
   *  transparent PNG lets a logo or badge sit on someone else's slide. */
  transparent?: boolean;
  /** Painted behind the artboard when `transparent` is false. */
  matte?: string;
};

export function png(req: ExportRequest, opts: PngOptions = {}): Promise<Raster> {
  const { client = sharedClient(), scale = 1, transparent = true, matte = "#ffffff" } = opts;
  return raster(client, req, "png", {
    scale,
    background: transparent ? undefined : matte,
  });
}

export type JpegOptions = WithClient & {
  scale?: number;
  /** 60–100. Below 60 the grain in the artboard backgrounds turns to mush. */
  quality?: number;
  /** JPEG has no alpha; this is what shows through where the artboard doesn't paint. */
  matte?: string;
};

export function jpeg(req: ExportRequest, opts: JpegOptions = {}): Promise<Raster> {
  const { client = sharedClient(), scale = 1, quality = 92, matte = "#ffffff" } = opts;
  return raster(client, req, "jpeg", {
    scale,
    quality: clampQuality(quality) / 100,
    background: matte,
  });
}

export type WebpOptions = WithClient & { scale?: number; quality?: number };

export function webp(req: ExportRequest, opts: WebpOptions = {}): Promise<Raster> {
  const { client = sharedClient(), scale = 1, quality = 92 } = opts;
  return raster(client, req, "webp", { scale, quality: clampQuality(quality) / 100 });
}

/** Satori's own output. Resolution-independent, so it takes no scale. */
export async function svg(req: ExportRequest, opts: WithClient = {}): Promise<string> {
  const client = opts.client ?? sharedClient();
  return expectText(await client.run({ kind: "render", req, format: "svg" }));
}

function clampQuality(q: number): number {
  return Math.min(100, Math.max(60, Math.round(q)));
}

// ---------------------------------------------------------------- pdf

/**
 * PDF output is a RASTER pdf: the page contains one embedded PNG, not vector
 * text. Satori's SVG could in principle be converted, but its text is already
 * laid out as positioned runs against fonts we would have to subset and embed —
 * and a print shop that opens the file and finds unembedded fonts is a worse
 * outcome than one that finds a 300 DPI image. Surfaced as PDF_IS_RASTER so the
 * export panel can say so out loud rather than implying it is press-ready vector.
 */
export const PDF_IS_RASTER = true;

/** Print resolution the physical page size is derived from. */
const PDF_DPI = 300;

/** 1080px at 300 DPI is 91.44mm. Pixels are given a physical size explicitly,
 *  because a PDF with no stated size is placed at 72 DPI and comes out four
 *  times too big. */
function mm(px: number): number {
  return (px / PDF_DPI) * 25.4;
}

function sizeOf(req: ExportRequest): Size {
  const template = getTemplate(req.templateId);
  if (!template) throw new Error(`Unknown template: ${req.templateId}`);
  return template.sizes.find((s) => s.id === req.sizeId) ?? template.sizes[0];
}

function newDoc(size: Size): jsPDF {
  return new jsPDF({
    unit: "mm",
    // Explicit page geometry, in the artboard's own aspect — no A4 letterboxing.
    format: [mm(size.w), mm(size.h)],
    orientation: size.w >= size.h ? "landscape" : "portrait",
    compress: true,
  });
}

export type PdfOptions = WithClient & { scale?: number };

export async function pdf(req: ExportRequest, opts: PdfOptions = {}): Promise<Uint8Array> {
  const { client = sharedClient(), scale = 2 } = opts;
  const size = sizeOf(req);
  const image = await png(req, { client, scale, transparent: false });

  const doc = newDoc(size);
  // The image is placed at the page's physical size whatever its pixel scale;
  // a higher scale raises the effective DPI rather than the page dimensions.
  doc.addImage(image.bytes, "PNG", 0, 0, mm(size.w), mm(size.h), undefined, "FAST");
  return new Uint8Array(doc.output("arraybuffer"));
}

/**
 * A carousel as one document — ten slides, ten pages.
 *
 * Pages are rendered and embedded one at a time; jsPDF keeps the compressed
 * bytes and nothing holds ten full rasters at once.
 */
export async function pdfMultiPage(
  reqs: ExportRequest[],
  opts: PdfOptions = {},
): Promise<Uint8Array> {
  if (!reqs.length) throw new Error("pdfMultiPage needs at least one artboard");

  const { client = sharedClient(), scale = 2 } = opts;
  const first = sizeOf(reqs[0]);
  const doc = newDoc(first);

  for (const [index, req] of reqs.entries()) {
    const size = sizeOf(req);
    if (index > 0) doc.addPage([mm(size.w), mm(size.h)], size.w >= size.h ? "landscape" : "portrait");
    const image = await png(req, { client, scale, transparent: false });
    doc.addImage(image.bytes, "PNG", 0, 0, mm(size.w), mm(size.h), undefined, "FAST");
  }

  return new Uint8Array(doc.output("arraybuffer"));
}

// ---------------------------------------------------------------- descriptor

export type FormatId = "png" | "jpeg" | "webp" | "svg" | "pdf";

export type FormatDescriptor = {
  id: FormatId;
  label: string;
  ext: string;
  mime: string;
  /** Whether a quality slider applies. */
  quality: boolean;
  /** Whether the format can carry an alpha channel. */
  transparency: boolean;
  /** Whether 1x/2x/3x means anything for it. */
  scalable: boolean;
  note?: string;
};

/** The list the export panel renders its controls from. */
export const FORMATS: FormatDescriptor[] = [
  {
    id: "png",
    label: "PNG",
    ext: "png",
    mime: "image/png",
    quality: false,
    transparency: true,
    scalable: true,
    note: "Lossless. The default for anything with type on it.",
  },
  {
    id: "jpeg",
    label: "JPEG",
    ext: "jpg",
    mime: "image/jpeg",
    quality: true,
    transparency: false,
    scalable: true,
    note: "Smaller, and what ad platforms ask for. Flattened onto a matte colour.",
  },
  {
    id: "webp",
    label: "WebP",
    ext: "webp",
    mime: "image/webp",
    quality: true,
    transparency: true,
    scalable: true,
    note: "Smallest of the three. For the web, not for upload forms.",
  },
  {
    id: "svg",
    label: "SVG",
    ext: "svg",
    mime: "image/svg+xml",
    quality: false,
    transparency: true,
    scalable: false,
    note: "Satori's output. Text is drawn as paths, so it scales but is not editable.",
  },
  {
    id: "pdf",
    label: "PDF",
    ext: "pdf",
    mime: "application/pdf",
    quality: false,
    transparency: false,
    scalable: true,
    note: "A 300 DPI raster PDF — an embedded image, not vector text.",
  },
];

export function formatById(id: FormatId): FormatDescriptor {
  const found = FORMATS.find((f) => f.id === id);
  if (!found) throw new Error(`Unknown format: ${id}`);
  return found;
}
