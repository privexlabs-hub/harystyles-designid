/**
 * The CSS-subset guard.
 *
 * Templates are authored once and rendered twice — React DOM for the preview,
 * Satori for the export. That only holds while the CSS stays inside what Satori
 * implements. Where it does not, Satori either throws, warns and drops the
 * declaration, or passes the string through to resvg, which paints nothing.
 * All three produce a preview that lies about the export, and the last two do
 * it silently.
 *
 * The rules below were verified against the installed Satori (0.29.1) by
 * rendering each property in isolation and reading the emitted SVG, not from
 * the README — the README is behind the code in both directions. Where Satori
 * has since gained support (filter, text-shadow, box-shadow, transform) the
 * rule is a warning about fidelity rather than an error about absence.
 *
 * Runs in the browser (the /check route surfaces findings live) and in Node
 * (scripts/lint-satori.mjs walks every template in the registry).
 */
import type { CSSProperties, ReactElement, ReactNode } from "react";

export type Severity = "error" | "warn";

export type Finding = {
  /** Where in the tree, as a chain of component and tag names. */
  path: string;
  rule: RuleId;
  severity: Severity;
  property: string;
  value: string;
  message: string;
};

export type RuleId =
  | "display-grid"
  | "grid-property"
  | "z-index"
  | "aspect-ratio"
  | "css-function"
  | "viewport-unit"
  | "intrinsic-size"
  | "backdrop-filter"
  | "filter"
  | "text-shadow"
  | "pseudo-content"
  | "float"
  | "position"
  | "unparsed-color"
  | "css-variable"
  | "implicit-display"
  | "line-clamp"
  | "class-component"
  | "image-src"
  | "image-remote"
  | "image-size"
  | "image-clip";

export const RULES: Record<RuleId, { severity: Severity; summary: string }> = {
  "display-grid": { severity: "error", summary: "Satori throws on display: grid" },
  "grid-property": { severity: "error", summary: "grid-* is dropped; there is no grid engine" },
  "z-index": { severity: "error", summary: "no stacking contexts — paint order is source order" },
  "aspect-ratio": { severity: "error", summary: "aspect-ratio is dropped silently" },
  "css-function": { severity: "error", summary: "calc()/min()/max()/clamp() are not evaluated" },
  "viewport-unit": { severity: "error", summary: "viewport units resolve against the artboard, not the viewport" },
  "intrinsic-size": { severity: "error", summary: "fit-content/min-content/max-content fall back to auto" },
  "backdrop-filter": { severity: "error", summary: "backdrop-filter is dropped silently" },
  "filter": { severity: "warn", summary: "filter becomes an SVG filter primitive and only approximates the browser" },
  "text-shadow": { severity: "warn", summary: "text-shadow becomes feDropShadow and only approximates the browser" },
  "pseudo-content": { severity: "error", summary: "there are no pseudo-elements to attach content to" },
  "float": { severity: "error", summary: "float is dropped; the layout engine is flexbox only" },
  "position": { severity: "error", summary: "only static, relative and absolute exist" },
  "unparsed-color": { severity: "error", summary: "the colour is passed through to resvg verbatim and paints as nothing" },
  "css-variable": { severity: "error", summary: "there is no cascade; var() collapses to its fallback or to nothing" },
  "implicit-display": { severity: "error", summary: "Satori throws on an element with more than one child and no explicit display" },
  "line-clamp": { severity: "error", summary: "line clamping only applies to display: block" },
  "class-component": { severity: "error", summary: "class components are not supported" },
  "image-src": { severity: "warn", summary: "an <img> with no src draws nothing" },
  "image-remote": { severity: "error", summary: "the worker has no network; a remote image never loads" },
  "image-size": { severity: "error", summary: "Satori cannot size an image it cannot measure" },
  "image-clip": { severity: "warn", summary: "object-fit: cover overflows a container that does not clip" },
};

// ---------------------------------------------------------------- image rules

/**
 * What Satori will and will not do with an `<img>`.
 *
 * Read out of node_modules/satori/dist/index.js rather than recalled: it decodes
 * a base64 data URI and reads intrinsic dimensions straight from the PNG, JPEG,
 * GIF or WebP header, so width and height are optional for those. A
 * percent-encoded data URI resolves without a size and throws
 * "Image size cannot be determined" unless both are given.
 */
function checkImage(
  props: Record<string, unknown> | undefined,
  path: string,
): Finding[] {
  const findings: Finding[] = [];
  const src = typeof props?.src === "string" ? props.src : "";
  const style = (props?.style ?? {}) as Record<string, unknown>;
  const hasSize = props?.width != null || props?.height != null;

  if (!src) {
    // Only a warning: the lint renders templates with their DEFAULT props, and
    // an image template's default src is empty by design. An error here would
    // fail the whole catalogue for a field nobody has filled in yet.
    findings.push({
      path,
      rule: "image-src",
      severity: "warn",
      property: "src",
      value: "(empty)",
      message: `${RULES["image-src"].summary} — fine for a default, wrong in a finished artboard`,
    });
    return findings;
  }

  if (/^https?:/i.test(src)) {
    findings.push({
      path,
      rule: "image-remote",
      severity: "error",
      property: "src",
      value: src.slice(0, 48),
      message: `${RULES["image-remote"].summary} — embed the bytes instead`,
    });
  }

  // A data URI that is not base64 carries no readable header.
  if (/^data:/i.test(src) && !/;base64,/i.test(src) && !hasSize) {
    findings.push({
      path,
      rule: "image-size",
      severity: "error",
      property: "src",
      value: src.slice(0, 48),
      message: `${RULES["image-size"].summary} — use base64, or set width and height`,
    });
  }

  if (String(style.objectFit) === "cover" && String(style.overflow ?? "") !== "hidden") {
    findings.push({
      path,
      rule: "image-clip",
      severity: "warn",
      property: "objectFit",
      value: "cover",
      message: `${RULES["image-clip"].summary} — clip on the image or its container`,
    });
  }

  return findings;
}

// ---------------------------------------------------------------- style rules

/** Every property whose name alone condemns it, with the reason why. */
const BANNED_PROPERTIES: Partial<Record<string, RuleId>> = {
  zIndex: "z-index",
  aspectRatio: "aspect-ratio",
  backdropFilter: "backdrop-filter",
  WebkitBackdropFilter: "backdrop-filter",
  float: "float",
  clear: "float",
  content: "pseudo-content",
  filter: "filter",
  textShadow: "text-shadow",
};

/**
 * Value patterns. These are checked against the stringified value of every
 * declaration, because the damage is in the value, not the property — a
 * `calc()` is as fatal in `padding` as in `width`.
 */
const VALUE_RULES: { rule: RuleId; test: RegExp; note: string }[] = [
  {
    rule: "css-function",
    test: /\b(calc|min|max|clamp)\s*\(/,
    note: "resolve the arithmetic in TypeScript — ctx.u() and ctx.inner exist for exactly this",
  },
  {
    // vw/vh do resolve in Satori, against the artboard box — which is precisely
    // why they are worse than unsupported: the DOM measures the browser window
    // and the two silently disagree.
    rule: "viewport-unit",
    test: /(?:^|[\s(,])[-+]?\d*\.?\d+(?:vw|vh|vmin|vmax|svw|svh|lvw|lvh|dvw|dvh|cqw|cqh|cqi|cqb|cqmin|cqmax)\b/i,
    note: "use a number derived from ctx.size instead",
  },
  {
    rule: "intrinsic-size",
    test: /\b(fit-content|min-content|max-content)\b/,
    note: "give the box an explicit measurement, or let flex do the sizing",
  },
  {
    rule: "unparsed-color",
    test: /\b(oklch|oklab|lch|lab|color-mix|hwb|color)\s*\(/,
    note: "resolve it with lib/color.ts — oklch() reaches the SVG verbatim and resvg drops the fill",
  },
  {
    rule: "css-variable",
    test: /var\s*\(\s*--/,
    note: "read the value off ctx.p, which is the resolved palette",
  },
];

const DISPLAY_OK = new Set(["flex", "block", "contents", "none", "-webkit-box"]);

/**
 * Checks one style object.
 *
 * `path` is carried through untouched so a finding can name the element it came
 * from; nothing here inspects it.
 */
export function checkStyle(style: CSSProperties | undefined, path: string): Finding[] {
  if (!style || typeof style !== "object") return [];

  const findings: Finding[] = [];
  const add = (rule: RuleId, property: string, value: string, note: string) =>
    findings.push({
      path,
      rule,
      severity: RULES[rule].severity,
      property,
      value,
      message: `${RULES[rule].summary} — ${note}`,
    });

  for (const [property, raw] of Object.entries(style as Record<string, unknown>)) {
    if (raw == null || raw === "") continue;
    const value = String(raw);

    if (property === "display" && /grid/.test(value)) {
      add("display-grid", property, value, "lay it out with nested flex rows and columns");
      continue;
    }
    if (/^(grid|Webkit(Grid|Box(?!Orient|Sizing)))/.test(property) && property !== "gridGap") {
      add("grid-property", property, value, "there is no grid engine to read it");
      continue;
    }
    if (property === "position" && value !== "relative" && value !== "absolute" && value !== "static") {
      add("position", property, value, "Satori throws on anything else");
      continue;
    }

    const banned = BANNED_PROPERTIES[property];
    if (banned) {
      add(
        banned,
        property,
        value,
        banned === "filter" || banned === "text-shadow"
          ? "expect the two renderers to disagree on the blur, and diff it before relying on it"
          : "it will not survive the export",
      );
    }

    for (const { rule, test, note } of VALUE_RULES) {
      if (test.test(value)) add(rule, property, value, note);
    }
  }

  // Line clamping is the one Satori feature gated on a display mode, and the
  // gate is easy to miss because the DOM clamps regardless.
  const clamp = (style as Record<string, unknown>).WebkitLineClamp ?? (style as Record<string, unknown>).lineClamp;
  if (clamp != null && style.display !== "block") {
    add("line-clamp", "WebkitLineClamp", String(clamp), 'set display: "block" on the same element or clamp by max-height');
  }

  return findings;
}

// ---------------------------------------------------------------- tree walk

type AnyElement = ReactElement<{ style?: CSSProperties; children?: ReactNode }>;

const isElement = (node: unknown): node is AnyElement =>
  typeof node === "object" && node !== null && "type" in node && "props" in node;

/** A readable name for a node, for the finding's path. */
function nameOf(type: unknown): string {
  if (typeof type === "string") return type;
  if (typeof type === "function") return (type as { displayName?: string; name?: string }).displayName || (type as { name?: string }).name || "Anonymous";
  if (typeof type === "symbol") return String(type).replace(/^Symbol\(react\.(.+)\)$/, "$1");
  return "Unknown";
}

/** Flattens fragments and arrays the way the renderers do when counting children. */
function childList(children: ReactNode): unknown[] {
  const out: unknown[] = [];
  const push = (node: unknown) => {
    if (node == null || node === false || node === true) return;
    if (Array.isArray(node)) {
      node.forEach(push);
      return;
    }
    out.push(node);
  };
  push(children);
  return out;
}

export type WalkOptions = {
  /** Guards against a component that returns itself. */
  maxDepth?: number;
};

/**
 * Recurses a React element tree and collects every constraint violation.
 *
 * Function components are invoked rather than skipped, because that is what
 * Satori does — a violation hidden inside a primitive is still a violation of
 * the tree that reaches the renderer. Templates are pure functions of their
 * context, so calling them here is safe; anything that throws is reported as a
 * finding rather than swallowed.
 */
export function walkElement(element: ReactNode, path = "", opts: WalkOptions = {}): Finding[] {
  const maxDepth = opts.maxDepth ?? 60;
  const findings: Finding[] = [];

  const visit = (node: unknown, trail: string, depth: number) => {
    if (depth > maxDepth || !isElement(node)) return;

    const { type, props } = node as AnyElement;
    const here = trail ? `${trail} > ${nameOf(type)}` : nameOf(type);

    // A class component never reaches the renderer intact, and calling it here
    // would be wrong anyway.
    if (typeof type === "function" && type.prototype && (type.prototype as { isReactComponent?: unknown }).isReactComponent) {
      findings.push({
        path: here,
        rule: "class-component",
        severity: "error",
        property: "type",
        value: nameOf(type),
        message: `${RULES["class-component"].summary} — rewrite it as a function`,
      });
      return;
    }

    if (typeof type === "function") {
      let rendered: unknown;
      try {
        rendered = (type as (p: unknown) => unknown)(props);
      } catch {
        // A component that cannot render on its own tells us nothing about the
        // CSS; the visual regression run will catch it if it matters.
        return;
      }
      visit(rendered, here, depth + 1);
      return;
    }

    // Satori serialises an <svg> subtree straight into the output, so the div
    // rules stop applying at its boundary.
    if (type === "svg") return;

    findings.push(...checkStyle(props?.style, here));

    if (type === "img") findings.push(...checkImage(props, here));

    const children = childList(props?.children);

    if (typeof type === "string" && children.length > 1) {
      const display = props?.style?.display;
      if (!display || !DISPLAY_OK.has(String(display))) {
        findings.push({
          path: here,
          rule: "implicit-display",
          severity: "error",
          property: "display",
          value: display == null ? "(unset)" : String(display),
          message: `${RULES["implicit-display"].summary} — this <${type}> has ${children.length}; give it display: "flex"`,
        });
      }
    }

    children.forEach((child, i) =>
      visit(child, children.length > 1 ? `${here}[${i}]` : here, depth + 1),
    );
  };

  visit(element, path, 0);
  return dedupe(findings);
}

/** The same primitive used a dozen times produces a dozen identical findings. */
export function dedupe(findings: Finding[]): Finding[] {
  const seen = new Set<string>();
  return findings.filter((f) => {
    const key = `${f.rule}|${f.path}|${f.property}|${f.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const errorsOnly = (findings: Finding[]): Finding[] => findings.filter((f) => f.severity === "error");

/** One finding as a single line, for a console or a list item. */
export function formatFinding(f: Finding): string {
  return `${f.severity === "error" ? "✗" : "!"} ${f.path} · ${f.property}: ${f.value} — ${f.message}`;
}
