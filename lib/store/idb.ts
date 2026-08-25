"use client";

/**
 * One IndexedDB database, three object stores.
 *
 *   thumbnails  library pictures — regenerable, discardable
 *   projects    saved work — NOT regenerable
 *   images      uploaded photographs — NOT regenerable
 *
 * One database rather than three, so there is one `open()`, one version number
 * and one upgrade path to keep in step. The distinction that matters is which
 * stores may be thrown away on a version bump: thumbnails can always be drawn
 * again, so a schema change discards them, while projects and images must
 * survive every upgrade untouched.
 *
 * Everything here degrades to a no-op rather than throwing. Private browsing
 * blocks IndexedDB outright and some locked-down profiles hang on `open()`
 * instead of erroring, so a caller gets `null` and falls back to rendering or to
 * memory. Losing a cache is not worth breaking an editor over.
 */
const DB_NAME = "harystyles";

/** Bump when a store's shape changes. Thumbnails are rebuilt; the rest persist. */
const VERSION = 1;

export const STORES = {
  thumbnails: "thumbnails",
  projects: "projects",
  images: "images",
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

/** Superseded by the shared database; removed so it does not sit there for ever. */
const LEGACY_DB = "harystyles-thumbnails";

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);

  dbPromise ??= new Promise((resolve) => {
    // Best effort, and deliberately not awaited: the old cache holds nothing
    // that cannot be redrawn.
    try {
      indexedDB.deleteDatabase(LEGACY_DB);
    } catch {
      /* nothing to clean up */
    }

    const request = indexedDB.open(DB_NAME, VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      // Thumbnails are pictures of templates, so a version bump rebuilds them.
      if (db.objectStoreNames.contains(STORES.thumbnails)) {
        db.deleteObjectStore(STORES.thumbnails);
      }
      db.createObjectStore(STORES.thumbnails);

      // Saved work and uploads are created only if missing, and never dropped.
      if (!db.objectStoreNames.contains(STORES.projects)) db.createObjectStore(STORES.projects);
      if (!db.objectStoreNames.contains(STORES.images)) db.createObjectStore(STORES.images);
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
    // Some profiles neither resolve nor error.
    setTimeout(() => resolve(null), 2000);
  });

  return dbPromise;
}

export async function idbGet<T>(store: StoreName, key: string): Promise<T | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const request = db.transaction(store, "readonly").objectStore(store).get(key);
      request.onsuccess = () => resolve((request.result as T) ?? null);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function idbPut(store: StoreName, key: string, value: unknown): Promise<boolean> {
  const db = await openDb();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(store, "readwrite");
      tx.objectStore(store).put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export async function idbDelete(store: StoreName, key: string): Promise<boolean> {
  const db = await openDb();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(store, "readwrite");
      tx.objectStore(store).delete(key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

/** Everything in a store, as [key, value] pairs. */
export async function idbAll<T>(store: StoreName): Promise<[string, T][]> {
  const db = await openDb();
  if (!db) return [];
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(store, "readonly");
      const objectStore = tx.objectStore(store);
      const keysRequest = objectStore.getAllKeys();
      const valuesRequest = objectStore.getAll();
      tx.oncomplete = () => {
        const keys = (keysRequest.result ?? []) as IDBValidKey[];
        const values = (valuesRequest.result ?? []) as T[];
        resolve(keys.map((k, i) => [String(k), values[i]] as [string, T]));
      };
      tx.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}
