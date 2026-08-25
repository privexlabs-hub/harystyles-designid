"use client";

import { useEffect, useMemo, useState } from "react";
import { ArtboardPreview } from "@/components/editor/ArtboardPreview";
import { CanvasErrorBoundary } from "@/components/editor/ErrorBoundary";
import { pngObjectUrl, templateToPng } from "@/lib/export/png";
import { TEMPLATES } from "@/lib/templates/registry";
import type { TemplateDef, Variant } from "@/lib/templates/types";
import { renderTemplate } from "@/lib/templates/render";
import { ACCENTS, THEMES, type AccentId, type ThemeId } from "@/lib/templates/theme";
import { BACKGROUNDS, type BackgroundId } from "@/lib/templates/types";
import { ConstraintReport } from "./ConstraintReport";
import styles from "./check.module.css";

const WIDTH = 320;

/**
 * Renders a template, or a legible failure card instead of taking the page down.
 *
 * This page draws all 134 templates at once and is prerendered at build time, so
 * one throwing template would otherwise fail `next build` — and surfacing that
 * failure is precisely what this page exists to do.
 */
function safeRender(template: TemplateDef, variant: Partial<Variant>) {
  try {
    return renderTemplate({ template, variant });
  } catch (err) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "100%",
          height: "100%",
          padding: 32,
          background: "var(--bg-card)",
          border: "2px solid var(--mood-burning)",
          color: "var(--fg)",
          fontFamily: "var(--font-mono)",
          fontSize: 20,
          overflow: "hidden",
        }}
      >
        <span style={{ color: "var(--mood-burning)" }}>WOULD NOT DRAW</span>
        <span>{template.id}</span>
        <span style={{ fontSize: 16, color: "var(--fg-subtle)" }}>
          {err instanceof Error ? err.message : String(err)}
        </span>
      </div>
    );
  }
}

/**
 * Renders every template twice — React DOM on the left, Satori on the right —
 * so drift between the two renderers is visible rather than discovered at
 * export time.
 *
 * This is the human-readable view of what scripts/visreg.mjs asserts.
 */
export function CheckClient() {
  const [theme, setTheme] = useState<ThemeId>("ink");
  const [accent, setAccent] = useState<AccentId>("amber");
  const [background, setBackground] = useState<BackgroundId>("flat");
  const [layout, setLayout] = useState(0);
  const [pngs, setPngs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("idle");

  const variant = useMemo(
    () => ({ theme, accent, background, layout }),
    [theme, accent, background, layout],
  );

  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];

    (async () => {
      setStatus("rendering…");
      const next: Record<string, string> = {};
      for (const template of TEMPLATES) {
        try {
          const bytes = await templateToPng({ template, variant });
          if (cancelled) return;
          const url = pngObjectUrl(bytes);
          urls.push(url);
          next[template.id] = url;
        } catch (err) {
          console.error(`${template.id} failed to export`, err);
          next[template.id] = "";
        }
      }
      if (!cancelled) {
        setPngs(next);
        setStatus(`${TEMPLATES.length} rendered`);
      }
    })();

    return () => {
      cancelled = true;
      // Blob URLs are not garbage collected on their own.
      urls.forEach(URL.revokeObjectURL);
    };
  }, [variant]);

  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <div className="eyebrow">DOM vs SATORI</div>
        <label className={styles.control}>
          <span className="mono">THEME</span>
          <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeId)}>
            {THEMES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className={styles.control}>
          <span className="mono">ACCENT</span>
          <select value={accent} onChange={(e) => setAccent(e.target.value as AccentId)}>
            {ACCENTS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
        <label className={styles.control}>
          <span className="mono">BACKGROUND</span>
          <select
            value={background}
            onChange={(e) => setBackground(e.target.value as BackgroundId)}
          >
            {BACKGROUNDS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className={styles.control}>
          <span className="mono">LAYOUT</span>
          <select value={layout} onChange={(e) => setLayout(Number(e.target.value))}>
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <span className="mono" data-status>
          {status}
        </span>
      </header>

      <ConstraintReport variant={variant} />

      {TEMPLATES.map((template) => {
        const size = template.sizes[0];
        return (
          <section key={template.id} className={styles.row}>
            <div className={styles.meta}>
              <div className="title-sm">{template.name}</div>
              <div className="mono">{template.id}</div>
              <div className="mono">
                {size.w}×{size.h}
              </div>
            </div>
            <div className={styles.pair}>
              <figure className={styles.figure}>
                {/* Two guards, because they catch different things. The
                    try/catch in safeRender catches a template that throws while
                    building its tree — which is most of them, and the only kind
                    that can happen during the build's prerender, where React
                    error boundaries do not run at all. The boundary catches one
                    that throws later, while React is rendering the tree. */}
                <CanvasErrorBoundary templateId={template.id}>
                  <ArtboardPreview
                    element={safeRender(template, variant)}
                    width={size.w}
                    height={size.h}
                    displayWidth={WIDTH}
                  />
                </CanvasErrorBoundary>
                <figcaption className="mono">DOM</figcaption>
              </figure>
              <figure className={styles.figure}>
                {pngs[template.id] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={pngs[template.id]}
                    alt=""
                    width={WIDTH}
                    height={(size.h / size.w) * WIDTH}
                  />
                ) : (
                  <div
                    className={styles.pending}
                    style={{ width: WIDTH, height: (size.h / size.w) * WIDTH }}
                  />
                )}
                <figcaption className="mono">SATORI → RESVG</figcaption>
              </figure>
            </div>
          </section>
        );
      })}
    </div>
  );
}
