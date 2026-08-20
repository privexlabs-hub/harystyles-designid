"use client";

import { useEffect, useState } from "react";
import { detectCapability, scaleLimitFor, type Capability } from "@/lib/export/capability";
import { FORMATS, PDF_IS_RASTER, formatById, jpeg, pdf, pdfMultiPage, png, svg, webp } from "@/lib/export/formats";
import type { FormatId } from "@/lib/export/formats";
import { assetFilename, saveBlob } from "@/lib/export/download";
import { planBatch, runBatch, type BatchHandle, type BatchProgress, type BatchScope } from "@/lib/export/batch";
import { getTemplate } from "@/lib/templates/registry";
import { currentSize, useEditor } from "@/lib/store/editor";
import styles from "./ExportPanel.module.css";

const SCALES = [1, 2, 3];

function bytesLabel(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function ExportPanel() {
  const templateId = useEditor((s) => s.templateId);
  const sizeId = useEditor((s) => s.sizeId);
  const variant = useEditor((s) => s.variant);
  const slide = useEditor((s) => s.slide);
  const settings = useEditor((s) => s.exportSettings);
  const setSettings = useEditor((s) => s.setExportSettings);

  const [cap, setCap] = useState<Capability | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState<BatchProgress | null>(null);
  const [handle, setHandle] = useState<BatchHandle | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const template = getTemplate(templateId);
  const size = currentSize({ templateId, sizeId });

  useEffect(() => {
    detectCapability().then(setCap).catch(() => setCap(null));
  }, []);

  if (!template) return null;

  const format = formatById(settings.format);
  const limit = cap ? scaleLimitFor(size, cap) : null;
  const maxScale = limit?.maxScale ?? 3;
  const scale = Math.min(settings.scale, maxScale);

  const req = { templateId, sizeId: size.id, variant, slide };

  async function exportOne() {
    setNote(null);
    setBusy("Rendering…");
    try {
      const isCarousel = (template!.slides ?? 1) > 1;

      if (settings.format === "svg") {
        const text = await svg(req);
        saveBlob(
          new Blob([text], { type: "image/svg+xml" }),
          assetFilename({ templateId, variant, scale: 1, ext: "svg" }),
        );
      } else if (settings.format === "pdf") {
        // A carousel is one document, not ten downloads.
        const bytes = isCarousel
          ? await pdfMultiPage(
              Array.from({ length: template!.slides! }, (_, i) => ({ ...req, slide: i })),
              { scale },
            )
          : await pdf(req, { scale });
        saveBlob(
          new Blob([bytes.slice().buffer as ArrayBuffer], { type: "application/pdf" }),
          assetFilename({ templateId, variant, scale, ext: "pdf" }),
        );
      } else {
        const raster =
          settings.format === "png"
            ? await png(req, { scale, transparent: settings.transparent })
            : settings.format === "jpeg"
              ? await jpeg(req, { scale, quality: settings.quality })
              : await webp(req, { scale, quality: settings.quality });

        saveBlob(
          new Blob([raster.bytes.slice().buffer as ArrayBuffer], { type: raster.mime }),
          assetFilename({ templateId, variant, scale, ext: format.ext }),
        );
        setNote(`${raster.width}×${raster.height} · ${bytesLabel(raster.bytes.length)}`);
      }
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setBusy(null);
    }
  }

  async function exportBatch(scope: BatchScope) {
    setNote(null);
    const plan = planBatch(scope, {
      formats: [settings.format],
      scale,
      quality: settings.quality,
      transparent: settings.transparent,
    });

    if (!plan.ok) {
      setNote(plan.refusal.message);
      return;
    }

    // The count and the estimate go in front of the user before anything runs —
    // a five-hundred-file download should never be a surprise.
    const proceed = window.confirm(
      `${plan.jobs.length} files, roughly ${bytesLabel(plan.estimatedBytes)}.\n\n` +
        `Rendering these can take a while and the tab must stay open. Continue?`,
    );
    if (!proceed) return;

    setBusy("Exporting…");
    const h = runBatch(plan, { formats: [settings.format], scale, quality: settings.quality }, setProgress);
    setHandle(h);

    const result = await h.result;
    setHandle(null);
    setProgress(null);
    setBusy(null);
    setNote(
      result.ok
        ? `${result.files} files · ${bytesLabel(result.bytes)}${result.streamed ? " · streamed to disk" : ""}`
        : result.message,
    );
  }

  return (
    <section className={styles.panel}>
      <h3 className="eyebrow">EXPORT</h3>

      <div className={styles.formats}>
        {FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            data-active={f.id === settings.format}
            onClick={() => setSettings({ format: f.id as FormatId })}
            title={f.note}
          >
            {f.label}
          </button>
        ))}
      </div>

      {format.scalable && (
        <label className={styles.row}>
          <span className={styles.label}>Scale</span>
          <div className={styles.scales}>
            {SCALES.map((s) => (
              <button
                key={s}
                type="button"
                data-active={s === scale}
                disabled={s > maxScale}
                onClick={() => setSettings({ scale: s })}
                title={s > maxScale ? limit?.reason : `${size.w * s}×${size.h * s}`}
              >
                {s}×
              </button>
            ))}
          </div>
          <span className={styles.hint}>
            {size.w * scale}×{size.h * scale}
            {limit && limit.maxScale < 3 && ` · ${limit.reason}`}
          </span>
        </label>
      )}

      {format.quality && (
        <label className={styles.row}>
          <span className={styles.label}>
            Quality <span className="mono">{settings.quality}</span>
          </span>
          <input
            type="range"
            min={60}
            max={100}
            value={settings.quality}
            onChange={(e) => setSettings({ quality: Number(e.target.value) })}
          />
        </label>
      )}

      {format.transparency && (
        <label className={styles.rowInline}>
          <input
            type="checkbox"
            checked={settings.transparent}
            onChange={(e) => setSettings({ transparent: e.target.checked })}
          />
          <span className={styles.label}>Transparent background</span>
        </label>
      )}

      {settings.format === "pdf" && PDF_IS_RASTER && (
        <p className={styles.warning}>
          The PDF embeds the rendered image, so its text is not selectable. Export SVG if you
          need vector artwork.
        </p>
      )}

      <button type="button" className={styles.primary} onClick={exportOne} disabled={!!busy}>
        {busy ?? `Download ${format.label}`}
      </button>

      <h3 className="eyebrow" style={{ marginTop: "var(--s-4)" }}>
        EXPORT ALL
      </h3>
      <div className={styles.batch}>
        <button type="button" onClick={() => exportBatch({ kind: "template", templateId })} disabled={!!busy}>
          This template
        </button>
        <button
          type="button"
          onClick={() => exportBatch({ kind: "category", category: template.category })}
          disabled={!!busy}
        >
          All {template.category}
        </button>
        <button type="button" onClick={() => exportBatch({ kind: "everything" })} disabled={!!busy}>
          Everything
        </button>
      </div>

      {progress && (
        <div className={styles.progress}>
          <div className={styles.bar}>
            <span style={{ width: `${(progress.done / progress.total) * 100}%` }} />
          </div>
          <span className="mono">
            {progress.done}/{progress.total} · {progress.currentName}
          </span>
          <button type="button" className={styles.ghost} onClick={() => handle?.cancel()}>
            Cancel
          </button>
        </div>
      )}

      {note && <p className={styles.note}>{note}</p>}
    </section>
  );
}
