/**
 * Resolves a path under public/ to a URL that works from any route.
 *
 * Resolving against document.baseURI is wrong: with trailingSlash on, the base
 * of /playbook/brand/ is that directory, so "wasm/resvg.wasm" would be looked
 * for inside it. These assets are always rooted at the deployment base, so the
 * path is absolute and only the configured basePath is prepended.
 *
 * Works on the main thread and inside a worker, where `document` does not exist.
 */
const BASE = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export function assetUrl(path: string): string {
  const absolute = `${BASE}/${path.replace(/^\//, "")}`;

  if (typeof location !== "undefined") return new URL(absolute, location.origin).href;
  return absolute;
}
