/**
 * Lets the scripts in this directory import the app's own TypeScript.
 *
 * The alternative is a second, script-only copy of the template code, which is
 * exactly the drift these tools exist to catch. Node strips types on its own
 * but does not transform JSX and does not read tsconfig `paths`, so both are
 * supplied by the resolve/load hooks in ./ts-hooks.mjs.
 *
 * Used as `node --import ./scripts/lib/register-ts.mjs <script>`.
 */
import { register } from "node:module";

register("./ts-hooks.mjs", import.meta.url);
