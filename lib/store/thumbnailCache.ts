"use client";

/**
 * A persistent cache for library thumbnails.
 *
 * Each thumbnail costs a full Satori render plus a resvg rasterisation — around
 * a third of a second. With a catalogue this size that is half a minute of work
 * to show a grid, and it would be repeated on every reload. IndexedDB keeps them
 * between sessions; localStorage could not, because these are binary blobs and
 * would blow its quota within a dozen cards.
 *
 * The store is disposable: any failure falls back to rendering, and a version
 * bump throws the whole thing away, which is how a template redesign invalidates
 * stale pictures of itself.
 */
const DB_NAME = "harystyles-thumbnails";
const STORE = "png";

/** Bump when a template, layout or palette change would make cached art wrong. */
const VERSION = 1;

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);

  dbPromise ??= new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      // A version bump discards everything rather than migrating: these are
      // regenerable pictures, not data.
      if (db.objectStoreNames.contains(STORE)) db.deleteObjectStore(STORE);
      db.createObjectStore(STORE);
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
    // Private browsing and some locked-down profiles hang rather than error.
    setTimeout(() => resolve(null), 2000);
  });

  return dbPromise;
}

export async function readThumbnail(key: string): Promise<Blob | null> {
  const db = await openDb();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const request = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
      request.onsuccess = () => resolve((request.result as Blob) ?? null);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function writeThumbnail(key: string, blob: Blob): Promise<void> {
  const db = await openDb();
  if (!db) return;

  try {
    db.transaction(STORE, "readwrite").objectStore(STORE).put(blob, key);
  } catch {
    // A full or unavailable store is not worth surfacing — the thumbnail is
    // already on screen by the time this runs.
  }
}
