"use client";

import { useEffect, useState } from "react";
import { detectCapability, scaleLimitFor, type Capability } from "@/lib/export/capability";
import { FORMATS, PDF_IS_RASTER, formatById, jpeg, pdf, pdfMultiPage, png, svg, webp } from "@/lib/export/formats";
import type { FormatId } from "@/lib/export/formats";
import { assetFilename, saveBlob } from "@/lib/export/download";
import { planBatch, runBatch, type BatchHandle, type BatchPage, type BatchProgress, type BatchScope } from "@/lib/export/batch";
import { collectImages } from "@/lib/store/images";
import { getTemplate } from "@/lib/templates/registry";
import { currentSize, resolveValues, selectPage, useCurrentValues, useEditor } from "@/lib/store/editor";
import { DEFAULT_VARIANT } from "@/lib/templates/types";
import styles from "./ExportPanel.module.css";

const SCALES = [1, 2, 3];

function bytesLabel(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function ExportPanel() {
  const templateId = useEditor((s) => selectPage(s)?.templateId ?? "");
  const sizeId = useEditor((s) => selectPage(s)?.sizeId ?? null);
  const variant = useEditor((s) => selectPage(s)?.variant ?? DEFAULT_VARIANT);
  const slide = useEditor((s) => selectPage(s)?.slide ?? 0);
  const values = useCurrentValues();
  const pages = useEditor((s) => s.project.pages);
  const projectName = useEditor((s) => s.project.name);
  const settings = useEditor((s) => s.exportSettings);
  const setSettings = useEditor((s) => s.setExportSettings);

  const [cap, setCap] = useState<Capability | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState<BatchProgress | null>(null);
  const [handle, setHandle] = useState<BatchHandle | null>(null);
  const [note, setNote] = useState<string | null>(null);
  /**
   * Whether the clipboard can take an image at all.
   *
   * Detected in an effect rather than inline so the server-rendered markup and
   * the first client render agree — and hidden rather than disabled, because a
   * button that explains it cannot do the thing is worse than no button.
   */
  const [canCopy, setCanCopy] = useState(false);

  const template = getTemplate(templateId);
  const size = currentSize({ templateId, sizeId });

  useEffect(() => {
    detectCapability().then(setCap).catch(() => setCap(null));
    setCanCopy(
      typeof ClipboardItem === "function" && typeof navigator?.clipboard?.write === "function",
    );
  }, []);

  if (!template) return null;

  const format = formatById(settings.format);
  const limit = cap ? scaleLimitFor(size, cap) : null;
  const maxScale = limit?.maxScale ?? 3;
  const scale = Math.min(settings.scale, maxScale);

  // `values` is the whole point of the editor and was missing here: without it
  // every download rendered the template's stock copy while the canvas showed
  // what you had typed.
  const req = { templateId, sizeId: size.id, variant, slide, values };

  async function exportOne() {
    setNote(null);
    setBusy("Rendering…");
    try {
      // Photographs live in IndexedDB, so they have to be fetched before the
      // request can cross into the worker.
      const images = await collectImages(values);
      const withImages = { ...req, images };
      const isCarousel = (template!.slides ?? 1) > 1;
      const multiPage = pages.length > 1;

      if (settings.format === "svg") {
        const text = await svg(withImages);
        saveBlob(
          new Blob([text], { type: "image/svg+xml" }),
          assetFilename({ templateId, variant, scale: 1, ext: "svg" }),
        );
      } else if (settings.format === "pdf") {
        // A project is one document, not one download per page — and so is a
        // carousel, which is a deck whether or not it has been expanded.
        const bytes = multiPage
          ? await pdfMultiPage(await pageRequests(), { scale })
          : isCarousel
            ? await pdfMultiPage(
                Array.from({ length: template!.slides! }, (_, i) => ({ ...withImages, slide: i })),
                { scale },
              )
            : await pdf(withImages, { scale });
        saveBlob(
          new Blob([bytes.slice().buffer as ArrayBuffer], { type: "application/pdf" }),
          multiPage
            ? `${projectName.replace(/[^\w-]+/g, "-").toLowerCase()}.pdf`
            : assetFilename({ templateId, variant, scale, ext: "pdf" }),
        );
        if (multiPage) setNote(`${pages.length} pages · ${bytesLabel(bytes.length)}`);
      } else {
        const raster =
          settings.format === "png"
            ? await png(withImages, { scale, transparent: settings.transparent })
            : settings.format === "jpeg"
              ? await jpeg(withImages, { scale, quality: settings.quality })
              : await webp(withImages, { scale, quality: settings.quality });

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

  /**
   * Every page as an export request.
   *
   * Read straight from the store rather than from the component's props,
   * because only the ACTIVE page's values are in scope here — the others need
   * resolving against their own overrides.
   */
  async function pageRequests(): Promise<BatchPage[]> {
    const store = useEditor.getState();
    return Promise.all(
      store.project.pages.map(async (pg) => {
        const pageValues = resolveValues(store, pg);
        return {
          templateId: pg.templateId,
          sizeId: currentSize(pg).id as string,
          variant: pg.variant,
          slide: pg.slide,
          values: pageValues,
          images: await collectImages(pageValues),
        };
      }),
    );
  }

  /**
   * The artboard onto the clipboard.
   *
   * NOT awaited before the ClipboardItem is built. Safari treats an await
   * before `clipboard.write` as losing the user gesture and rejects the whole
   * call, so the item is constructed synchronously from a PROMISE of the blob —
   * which Safari accepts and Chrome has accepted since 104. The catch handles
   * the older shape, where the constructor only takes a settled Blob; that path
   * has already lost the gesture in Safari, which is exactly why it is second.
   */
  function copyOne() {
    setNote(null);
    setBusy("Copying…");

    const blob = (async () => {
      const images = await collectImages(values);
      const raster = await png({ ...req, images }, { scale, transparent: settings.transparent });
      return new Blob([raster.bytes.slice().buffer as ArrayBuffer], { type: "image/png" });
    })();

    const write = (async () => {
      let item: ClipboardItem;
      try {
        item = new ClipboardItem({ "image/png": blob });
      } catch {
        item = new ClipboardItem({ "image/png": await blob });
      }
      await navigator.clipboard.write([item]);
    })();

    write
      .then(() => setNote("Copied to clipboard."))
      .catch((err: unknown) =>
        setNote(err instanceof Error ? `Copy failed — ${err.message}` : "Copy failed."),
      )
      .finally(() => setBusy(null));
  }

  async function exportBatch(scope: BatchScope) {
    setNote(null);
    const plan = planBatch(scope, {
      formats: [settings.format],
      scale,
      quality: settings.quality,
      transparent: settings.transparent,
      // Every template the user has actually typed into. Anything untouched
      // falls back to its defaults inside renderTemplate.
      drafts: useEditor.getState().values,
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
    const h = runBatch(
      plan,
      { formats: [settings.format], scale, quality: settings.quality, drafts: useEditor.getState().values },
      setProgress,
    );
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

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={exportOne} disabled={!!busy}>
          {busy ?? `Download ${format.label}`}
        </button>
        {canCopy && (
          <button
            type="button"
            className={styles.secondary}
            onClick={copyOne}
            disabled={!!busy}
            title="Copy this artboard to the clipboard as a PNG"
          >
            Copy
          </button>
        )}
      </div>

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
        <button
          type="button"
          onClick={async () => exportBatch({ kind: "project", pages: await pageRequests() })}
          disabled={!!busy}
        >
          This project
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
