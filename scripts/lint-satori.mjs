/**
 * Walks every registered template and reports CSS that Satori cannot honour.
 *
 * A template is authored once and rendered twice; the only thing keeping the
 * two renderers honest is the subset in lib/satori/constraints.ts. This is that
 * subset applied to the catalog, so an unsupported property fails a build
 * rather than surfacing as an export that does not look like its preview.
 *
 *   node --import ./scripts/lib/register-ts.mjs scripts/lint-satori.mjs
 *
 * Warnings are printed but do not fail; errors do.
 */
import { TEMPLATES } from "../lib/templates/registry.ts";
import { renderTemplate } from "../lib/templates/render.tsx";
import { dedupe, errorsOnly, formatFinding, walkElement } from "../lib/satori/constraints.ts";
import { THEMES } from "../lib/templates/theme.ts";
import { BACKGROUNDS, LOCKUPS } from "../lib/templates/types.ts";

/**
 * Which variants to walk.
 *
 * The variant axes change the tree, not just its colours, so one render per
 * template would leave most of the code unvisited. This covers each axis once
 * against a fixed remainder rather than the full product of them — the same
 * elements recur, and dedupe collapses what repeats.
 */
function* variantsFor(template) {
  const layouts = template.layouts.length || 1;
  for (let layout = 0; layout < layouts; layout++) yield { layout };
  for (const theme of THEMES) yield { theme };
  for (const background of BACKGROUNDS) yield { background };
  for (const lockup of LOCKUPS) yield { lockup };
}

const findings = [];
let walked = 0;

for (const template of TEMPLATES) {
  for (const variant of variantsFor(template)) {
    const slides = template.slides ?? 1;
    for (let slide = 0; slide < slides; slide++) {
      walked++;
      try {
        findings.push(
          ...walkElement(renderTemplate({ template, variant, slide })).map((f) => ({
            ...f,
            template: template.id,
          })),
        );
      } catch (err) {
        findings.push({
          template: template.id,
          path: `${template.id} (${JSON.stringify(variant)})`,
          rule: "render-threw",
          severity: "error",
          property: "render",
          value: "",
          message: `the template threw before it could be checked — ${err.message}`,
        });
      }
    }
  }
}

// Deduped per template rather than globally: a shared primitive misbehaving in
// twenty templates is twenty templates to fix, and each needs to see it.
const byTemplate = new Map();
for (const f of findings) {
  if (!byTemplate.has(f.template)) byTemplate.set(f.template, []);
  byTemplate.get(f.template).push(f);
}
for (const [id, list] of byTemplate) byTemplate.set(id, dedupe(list));

const all = [...byTemplate.values()].flat();
const errors = errorsOnly(all);
const warnings = all.filter((f) => f.severity === "warn");

for (const [id, list] of byTemplate) {
  console.log(`\n${id}`);
  for (const f of list) console.log(`  ${formatFinding(f)}`);
}

console.log(
  `\nlint:satori — ${TEMPLATES.length} templates, ${walked} renders walked, ` +
    `${errors.length} error${errors.length === 1 ? "" : "s"}, ${warnings.length} warning${warnings.length === 1 ? "" : "s"}`,
);

if (errors.length) process.exit(1);
