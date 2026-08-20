/**
 * Module hooks: tsconfig `paths`, extensionless imports, JSX, and bare JSON.
 *
 * The JSX transform is SWC, reached through the binary Next already ships —
 * adding a second toolchain to compile code Next compiles anyway would be one
 * more thing to keep in step.
 */
import { readFileSync, statSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { transformSync } = require("next/dist/build/swc/index.js");

const ROOT = resolvePath(dirname(fileURLToPath(import.meta.url)), "../..");
const EXTENSIONS = ["", ".ts", ".tsx", ".mts", ".js", ".mjs", ".json", "/index.ts", "/index.tsx", "/index.js"];

/** The first candidate that exists on disk as a file, or null. */
function probe(basePath) {
  for (const ext of EXTENSIONS) {
    const candidate = basePath + ext;
    try {
      if (statSync(candidate).isFile()) return candidate;
    } catch {
      /* not there — try the next extension */
    }
  }
  return null;
}

export function resolve(specifier, context, next) {
  // `@/x` is the tsconfig alias for the repository root.
  if (specifier.startsWith("@/")) {
    const hit = probe(resolvePath(ROOT, specifier.slice(2)));
    if (hit) return { url: pathToFileURL(hit).href, shortCircuit: true };
  }

  // Relative imports between the app's own .ts/.tsx files carry no extension.
  // Dependencies are left entirely to Node: they ship real extensions, and
  // second-guessing their package type breaks CommonJS ones.
  if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
    const from = fileURLToPath(context.parentURL);
    if (!from.includes("node_modules") && from.startsWith(ROOT)) {
      const hit = probe(resolvePath(dirname(from), specifier));
      if (hit) return { url: pathToFileURL(hit).href, shortCircuit: true };
    }
  }

  return next(specifier, context);
}

export function load(url, context, next) {
  if (!url.startsWith("file:")) return next(url, context);
  const path = fileURLToPath(url);

  if (/\.(ts|tsx|mts)$/.test(path)) {
    const { code } = transformSync(readFileSync(path, "utf8"), {
      filename: path,
      jsc: {
        parser: { syntax: "typescript", tsx: path.endsWith(".tsx"), decorators: false },
        target: "es2022",
        transform: { react: { runtime: "automatic" } },
      },
      module: { type: "es6" },
      isModule: true,
      sourceMaps: false,
    });
    return { format: "module", source: code, shortCircuit: true };
  }

  // TypeScript imports JSON without an import attribute; Node insists on one.
  // Handing back a synthesised module is cheaper than editing the app to suit
  // a dev script.
  if (path.endsWith(".json")) {
    return {
      format: "module",
      source: `export default ${readFileSync(path, "utf8")};`,
      shortCircuit: true,
    };
  }

  return next(url, context);
}
