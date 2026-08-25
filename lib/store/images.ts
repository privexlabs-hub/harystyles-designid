"use client";

/**
 * Photographs a person has dropped into a template.
 *
 * A field holds the string `img:<id>`; the bytes live in IndexedDB under that
 * id. Keeping the field a plain string is what lets `FieldValues` stay
 * JSON-serialisable — it goes through `persist`, through a saved project, and
 * through `postMessage` to the render worker, none of which want a Blob.
 *
 * Everything is downscaled on the way in. A twelve-megapixel phone photograph in
 * a 1080-pixel artboard is waste at every stage: the browser decodes it, the
 * worker copies it, Satori base64s it into the SVG, and the reader sees none of
 * the extra detail.
 */
import { STORES, idbDelete, idbGet, idbPut } from "./idb";

export const IMAGE_PREFIX = "img:";

/** Twice the longest artboard edge in the catalogue, which is ample at 3x. */
const MAX_EDGE = 2400;
const JPEG_QUALITY = 0.86;

export const isImageRef = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith(IMAGE_PREFIX);

export const imageId = (ref: string): string => ref.slice(IMAGE_PREFIX.length);

/**
 * Shrinks an image to fit MAX_EDGE and re-encodes it.
 *
 * PNG is kept for anything with transparency — a logo or a cut-out would get a
 * black box behind it in JPEG — and everything else becomes JPEG, which for a
 * photograph is several times smaller at a quality nobody can see.
 */
async function downscale(file: File): Promise<Blob> {
  if (typeof createImageBitmap !== "function" || typeof OffscreenCanvas !== "function") {
    return file; // Old browser: keep the original rather than refuse the upload.
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const transparent = file.type === "image/png" || file.type === "image/webp";
  return canvas.convertToBlob(
    transparent ? { type: "image/png" } : { type: "image/jpeg", quality: JPEG_QUALITY },
  );
}

export type StoredImage = { blob: Blob; width: number; height: number; name: string };

/** Stores a file and returns the reference a field should hold. */
export async function importImage(file: File): Promise<string | null> {
  const blob = await downscale(file);

  let width = 0;
  let height = 0;
  try {
    const bitmap = await createImageBitmap(blob);
    width = bitmap.width;
    height = bitmap.height;
    bitmap.close();
  } catch {
    /* dimensions are a nicety, not a requirement */
  }

  const id = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
  const ok = await idbPut(STORES.images, id, { blob, width, height, name: file.name } satisfies StoredImage);
  return ok ? IMAGE_PREFIX + id : null;
}

export function readImage(ref: string): Promise<StoredImage | null> {
  return idbGet<StoredImage>(STORES.images, imageId(ref));
}

export function deleteImage(ref: string): Promise<boolean> {
  return idbDelete(STORES.images, imageId(ref));
}

/**
 * Every image reference in a set of field values, resolved to bytes.
 *
 * Bytes rather than a data URI: this crosses `postMessage` to the worker, and a
 * transferable buffer is a fraction of the cost of a base64 string. The worker
 * turns them into data URIs once, at the point Satori actually needs one.
 */
export async function collectImages(
  values: Record<string, unknown>,
): Promise<Record<string, Uint8Array>> {
  const out: Record<string, Uint8Array> = {};
  await Promise.all(
    Object.entries(values).map(async ([key, value]) => {
      if (!isImageRef(value)) return;
      const stored = await readImage(value);
      if (stored) out[key] = new Uint8Array(await stored.blob.arrayBuffer());
    }),
  );
  return out;
}

/**
 * The same, as object URLs for the DOM preview.
 *
 * `<img src>` needs a string, and an object URL costs a pointer where a data URI
 * would cost a base64 copy of the whole photograph on every render.
 */
export async function collectImageUrls(
  values: Record<string, unknown>,
): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  await Promise.all(
    Object.entries(values).map(async ([key, value]) => {
      if (!isImageRef(value)) return;
      const stored = await readImage(value);
      if (stored) out[key] = URL.createObjectURL(stored.blob);
    }),
  );
  return out;
}
