"use client";

/**
 * A persistent cache for library thumbnails.
 *
 * Each one costs a full Satori render plus a resvg rasterisation — around a
 * third of a second. With a catalogue this size that is half a minute of work to
 * show a grid, repeated on every reload. IndexedDB keeps them between sessions;
 * localStorage could not, because these are binary blobs and would blow its
 * quota within a dozen cards.
 *
 * The store is disposable: any failure falls back to rendering, and a version
 * bump in lib/store/idb.ts throws the whole store away, which is how a template
 * redesign invalidates stale pictures of itself.
 */
import { STORES, idbGet, idbPut } from "./idb";

export function readThumbnail(key: string): Promise<Blob | null> {
  return idbGet<Blob>(STORES.thumbnails, key);
}

export async function writeThumbnail(key: string, blob: Blob): Promise<void> {
  // Not awaited by callers: the thumbnail is already on screen by the time this
  // runs, and a full or unavailable store is not worth surfacing.
  await idbPut(STORES.thumbnails, key, blob);
}
