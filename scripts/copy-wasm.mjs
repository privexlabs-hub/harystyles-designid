/**
 * Copies resvg's wasm binary into public/ so the browser can fetch it.
 *
 * It is version-locked to the installed @resvg/resvg-wasm — a stale copy in
 * public/ against a newer JS wrapper fails at initWasm with an unhelpful error,
 * so this runs from the package rather than being committed by hand.
 */
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(ROOT, "node_modules/@resvg/resvg-wasm/index_bg.wasm");
const to = join(ROOT, "public/wasm/resvg.wasm");

await mkdir(dirname(to), { recursive: true });
await copyFile(from, to);

const { version } = JSON.parse(
  await readFile(join(ROOT, "node_modules/@resvg/resvg-wasm/package.json"), "utf8"),
);
console.log(`public/wasm/resvg.wasm ← @resvg/resvg-wasm@${version}`);
