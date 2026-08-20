"use client";

import { useMemo } from "react";
import { errorsOnly, walkElement, type Finding } from "@/lib/satori/constraints";
import { TEMPLATES } from "@/lib/templates/registry";
import { renderTemplate } from "@/lib/templates/render";
import type { Variant } from "@/lib/templates/types";
import styles from "./check.module.css";

/**
 * The CSS-subset guard, run over the variant currently on screen.
 *
 * scripts/lint-satori.mjs is the gate; this is the same walker in front of the
 * renders it explains, so a mismatch below has a stated cause rather than
 * needing to be squinted at. Findings are shown, never only logged — a console
 * warning on a page nobody has open is not a guard.
 */
export function ConstraintReport({ variant }: { variant: Partial<Variant> }) {
  const byTemplate = useMemo(() => {
    const out: { id: string; name: string; findings: Finding[] }[] = [];
    for (const template of TEMPLATES) {
      let findings: Finding[] = [];
      try {
        findings = walkElement(renderTemplate({ template, variant }));
      } catch (err) {
        findings = [
          {
            path: template.id,
            rule: "class-component",
            severity: "error",
            property: "render",
            value: "",
            message: `threw before it could be checked — ${(err as Error).message}`,
          },
        ];
      }
      if (findings.length) out.push({ id: template.id, name: template.name, findings });
    }
    return out;
  }, [variant]);

  const errors = byTemplate.flatMap((t) => errorsOnly(t.findings)).length;
  const warnings = byTemplate.flatMap((t) => t.findings).length - errors;

  return (
    <section className={styles.constraints} data-has-errors={errors > 0 ? "1" : "0"}>
      <div className="eyebrow">
        SATORI CSS SUBSET — {errors} error{errors === 1 ? "" : "s"}, {warnings} warning
        {warnings === 1 ? "" : "s"} across {TEMPLATES.length} templates
      </div>
      {byTemplate.length === 0 ? (
        <p className="mono">Every template stays inside the subset at this variant.</p>
      ) : (
        <ul className={styles.findings}>
          {byTemplate.map((t) =>
            t.findings.map((f) => (
              <li key={`${t.id}|${f.path}|${f.rule}|${f.property}`} data-severity={f.severity}>
                <span className="mono">{t.id}</span> · {f.path} · <code>{f.property}</code>:{" "}
                <code>{f.value}</code> — {f.message}
              </li>
            )),
          )}
        </ul>
      )}
    </section>
  );
}
