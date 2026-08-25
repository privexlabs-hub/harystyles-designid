/**
 * Saving a file, and naming it.
 *
 * The naming rules live here rather than in batch.ts because a single export
 * from the editor and the same asset inside a zip must land on the same name —
 * two implementations would drift, and the filename is what a designer sorts by.
 */
import type { Variant } from "@/lib/templates/types";

/** The part of a template id after its category: "square/big-stat" → "big-stat". */
export function templateSlug(templateId: string): string {
  const slash = templateId.lastIndexOf("/");
  return slash === -1 ? templateId : templateId.slice(slash + 1);
}

/** "@2x", or "" at 1x — the convention every asset pipeline already reads. */
export function scaleSuffix(scale: number): string {
  return scale === 1 ? "" : `@${scale}x`;
}

export type NameParts = {
  templateId: string;
  variant: Pick<Variant, "theme" | "accent">;
  scale: number;
  ext: string;
  /** 0-based; set only for carousels, which get a directory of their own. */
  slide?: number;
  /** Overrides the category taken from the template id. */
  category?: string;
  /**
   * 1-based position within a project, prefixed as `page-01--`.
   *
   * Only project exports pass it. The rest of the naming is deliberately
   * deterministic, but a project can hold the same template and variant twice,
   * and two identical names in one zip is a file silently lost. The ordinal is
   * also the reading order, which is what a multi-page project is FOR.
   */
  ordinal?: number;
};

/**
 * `{category}/{slug}--{theme}-{accent}@{scale}.{ext}`, or for a carousel
 * `carousel/{slug}/slide-01@2x.png`. Deterministic, so re-running a batch
 * overwrites rather than accumulating "(1)" copies.
 */
export function assetPath({ templateId, variant, scale, ext, slide, category, ordinal }: NameParts): string {
  const slug = templateSlug(templateId);
  const prefix = ordinal === undefined ? "" : `page-${String(ordinal).padStart(2, "0")}--`;
  const dir = category ?? templateId.slice(0, Math.max(0, templateId.lastIndexOf("/"))) ?? "";

  if (slide !== undefined) {
    const n = String(slide + 1).padStart(2, "0");
    return `${dir}/${prefix}${slug}/slide-${n}${scaleSuffix(scale)}.${ext}`;
  }

  return `${dir}/${prefix}${slug}--${variant.theme}-${variant.accent}${scaleSuffix(scale)}.${ext}`;
}

/** The same name without directories, for a one-off save from the editor. */
export function assetFilename(parts: NameParts): string {
  const path = assetPath(parts);
  return path.slice(path.lastIndexOf("/") + 1);
}

/**
 * Hands a blob to the browser's download machinery.
 *
 * The object URL is revoked on the next frame rather than immediately: Safari
 * needs the URL to still resolve when it processes the synthetic click.
 */
export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Bytes → blob → disk, without ever going via a data URL. */
export function saveBytes(bytes: ArrayBuffer | Uint8Array, mime: string, filename: string): void {
  const buffer = bytes instanceof Uint8Array ? (bytes.slice().buffer as ArrayBuffer) : bytes;
  saveBlob(new Blob([buffer], { type: mime }), filename);
}
