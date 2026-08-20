/**
 * Template → PNG, on the calling thread.
 *
 * The editor uses the worker in lib/export/render.worker.ts for anything
 * batched; this path exists for single previews and for the check route, where
 * the render must happen where the DOM tree already is.
 */
import { renderToSvg } from "@/lib/satori/render";
import { renderTemplate, type RenderRequest } from "@/lib/templates/render";
import { svgToPng, svgToPngWidth } from "./raster";

export async function templateToSvg(req: RenderRequest): Promise<string> {
  const size = req.size ?? req.template.sizes[0];
  return renderToSvg(renderTemplate(req), { width: size.w, height: size.h });
}

export async function templateToPng(
  req: RenderRequest,
  opts: { scale?: number; background?: string } = {},
): Promise<Uint8Array> {
  return svgToPng(await templateToSvg(req), opts);
}

/**
 * A thumbnail. Rendered at the template's true dimensions and only then scaled
 * down — rendering at a smaller logical width would re-wrap the text, making
 * the thumbnail a different design from the export.
 */
export async function templateToThumbnail(req: RenderRequest, width: number): Promise<Uint8Array> {
  return svgToPngWidth(await templateToSvg(req), width);
}

/** Wraps raw PNG bytes in a blob URL the browser can show or download. */
export function pngObjectUrl(bytes: Uint8Array): string {
  return URL.createObjectURL(
    new Blob([bytes.slice().buffer as ArrayBuffer], { type: "image/png" }),
  );
}
