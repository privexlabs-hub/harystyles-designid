"use client";

import { getTemplate } from "@/lib/templates/registry";
import { currentSize, selectPage, useCurrentValues, useEditor } from "@/lib/store/editor";
import {
  ACCENTS,
  ACCENT_LABELS,
  THEMES,
  THEME_LABELS,
} from "@/lib/templates/theme";
import { BACKGROUNDS, BACKGROUND_LABELS, CORNERS, DEFAULT_VARIANT, DENSITIES, LOCKUPS, LOCKUP_LABELS, type FieldDef } from "@/lib/templates/types";
import { ExportPanel } from "./ExportPanel";
import { ImageField } from "./ImageField";
import styles from "./Inspector.module.css";

/** One labelled control. */
function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className={styles.row}>
      <span className={styles.label}>{label}</span>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
}

/** A segmented control. Used for every axis with a handful of options. */
function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  columns,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  columns?: number;
}) {
  return (
    <div
      className={styles.segmented}
      role="radiogroup"
      style={columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined}
    >
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          data-active={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Field({ field }: { field: FieldDef }) {
  const values = useCurrentValues();
  const setField = useEditor((s) => s.setField);
  const raw = values[field.key];

  if (field.kind === "textarea") {
    return (
      <Row label={field.label} hint={field.hint}>
        <textarea
          className={styles.input}
          rows={field.rows ?? 3}
          value={typeof raw === "string" ? raw : ""}
          onChange={(e) => setField(field.key, e.target.value)}
        />
      </Row>
    );
  }

  if (field.kind === "list") {
    // One item per line: a repeater with add/remove buttons is more chrome than
    // this needs, and a writer already thinks of a list as lines.
    const lines = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split("\n") : [];
    return (
      <Row
        label={field.label}
        hint={field.hint ?? `One ${field.itemLabel.toLowerCase()} per line, up to ${field.max}.`}
      >
        <textarea
          className={styles.input}
          rows={Math.min(field.max, Math.max(3, lines.length + 1))}
          value={lines.join("\n")}
          onChange={(e) =>
            setField(
              field.key,
              e.target.value.split("\n").slice(0, field.max),
            )
          }
        />
      </Row>
    );
  }

  if (field.kind === "number") {
    return (
      <Row label={field.label} hint={field.hint}>
        <input
          className={styles.input}
          type="number"
          min={field.min}
          max={field.max}
          value={typeof raw === "number" ? raw : Number(raw) || 0}
          onChange={(e) => setField(field.key, Number(e.target.value))}
        />
      </Row>
    );
  }

  if (field.kind === "toggle") {
    return (
      <Row label={field.label} hint={field.hint}>
        <button
          type="button"
          role="switch"
          aria-checked={raw === true}
          className={styles.toggle}
          data-on={raw === true}
          onClick={() => setField(field.key, raw !== true)}
        >
          <i />
        </button>
      </Row>
    );
  }

  if (field.kind === "image") {
    return (
      <ImageField
        label={field.label}
        hint={field.hint}
        value={typeof raw === "string" ? raw : ""}
        onChange={(ref) => setField(field.key, ref)}
      />
    );
  }

  if (field.kind === "select") {
    return (
      <Row label={field.label} hint={field.hint}>
        <select
          className={styles.input}
          value={typeof raw === "string" ? raw : ""}
          onChange={(e) => setField(field.key, e.target.value)}
        >
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Row>
    );
  }

  return (
    <Row label={field.label} hint={field.hint}>
      <input
        className={styles.input}
        type="text"
        value={typeof raw === "string" ? raw : ""}
        onChange={(e) => setField(field.key, e.target.value)}
      />
    </Row>
  );
}

export function Inspector() {
  const templateId = useEditor((s) => selectPage(s)?.templateId ?? "");
  const sizeId = useEditor((s) => selectPage(s)?.sizeId ?? null);
  const variant = useEditor((s) => selectPage(s)?.variant ?? DEFAULT_VARIANT);
  const slide = useEditor((s) => selectPage(s)?.slide ?? 0);
  const setVariant = useEditor((s) => s.setVariant);
  const selectSize = useEditor((s) => s.selectSize);
  const setSlide = useEditor((s) => s.setSlide);
  const resetTemplate = useEditor((s) => s.resetTemplate);
  const showGuides = useEditor((s) => s.showGuides);
  const toggleGuides = useEditor((s) => s.toggleGuides);

  const template = getTemplate(templateId);
  const size = currentSize({ templateId, sizeId });
  if (!template) return null;

  return (
    <div className={styles.panel}>
      <header className={styles.head}>
        <div className="title-sm">{template.name}</div>
        <p className={`body-sm ${styles.blurb}`}>{template.blurb}</p>
      </header>

      <section className={styles.section}>
        <h3 className="eyebrow">CONTENT</h3>
        {template.fields.map((f) => (
          <Field key={f.key} field={f} />
        ))}
        <button
          type="button"
          className={styles.ghost}
          onClick={() => {
            // One click used to discard every word on the artboard with no way
            // back except undo, which is not where anyone looks first.
            if (window.confirm("Put the default copy back? What you have written here is not recoverable.")) {
              resetTemplate();
            }
          }}
        >
          Reset to the default copy
        </button>
      </section>

      {template.slides && template.slides > 1 && (
        <section className={styles.section}>
          <h3 className="eyebrow">SLIDE</h3>
          <Segmented
            value={slide}
            columns={5}
            options={Array.from({ length: template.slides }, (_, i) => ({
              value: i,
              label: String(i + 1),
            }))}
            onChange={setSlide}
          />
        </section>
      )}

      {template.sizes.length > 1 && (
        <section className={styles.section}>
          <h3 className="eyebrow">SIZE</h3>
          <Segmented
            value={size.id}
            columns={1}
            options={template.sizes.map((s) => ({ value: s.id, label: s.label }))}
            onChange={(v) => selectSize(v as never)}
          />
        </section>
      )}

      <section className={styles.section}>
        <h3 className="eyebrow">BRAND</h3>

        <Row label="Theme">
          <Segmented
            value={variant.theme}
            columns={3}
            options={THEMES.map((t) => ({ value: t, label: THEME_LABELS[t] }))}
            onChange={(v) => setVariant({ theme: v }, "Change theme")}
          />
        </Row>

        <Row label="Accent" hint="Amber is the brand accent. The mood hues are for discovery artwork.">
          <Segmented
            value={variant.accent}
            columns={3}
            options={ACCENTS.map((a) => ({ value: a, label: ACCENT_LABELS[a] }))}
            onChange={(v) => setVariant({ accent: v }, "Change accent")}
          />
        </Row>

        <Row label="Background">
          <Segmented
            value={variant.background}
            columns={3}
            options={BACKGROUNDS.map((b) => ({ value: b, label: BACKGROUND_LABELS[b] }))}
            onChange={(v) => setVariant({ background: v }, "Change background")}
          />
        </Row>
      </section>

      <section className={styles.section}>
        <h3 className="eyebrow">LAYOUT</h3>

        <Row label="Arrangement">
          <Segmented
            value={variant.layout}
            columns={2}
            options={template.layouts.map((l, i) => ({ value: i, label: l }))}
            onChange={(v) => setVariant({ layout: v }, "Change arrangement")}
          />
        </Row>

        <Row label="Lockup">
          <Segmented
            value={variant.lockup}
            columns={2}
            options={LOCKUPS.map((l) => ({ value: l, label: LOCKUP_LABELS[l] }))}
            onChange={(v) => setVariant({ lockup: v }, "Change lockup")}
          />
        </Row>

        <Row label="Lockup corner">
          <Segmented
            value={variant.corner}
            columns={2}
            options={CORNERS.map((c) => ({ value: c, label: c.replace("-", " ") }))}
            onChange={(v) => setVariant({ corner: v }, "Move lockup")}
          />
        </Row>

        <Row label="Density" hint="Compact tightens the margin, for busier artboards.">
          <Segmented
            value={variant.density}
            columns={2}
            options={DENSITIES.map((d) => ({ value: d, label: d }))}
            onChange={(v) => setVariant({ density: v }, "Change density")}
          />
        </Row>

        {size.safe && (
          <Row label="Safe-area guide" hint={size.safe.note}>
            <button
              type="button"
              role="switch"
              aria-checked={showGuides}
              className={styles.toggle}
              data-on={showGuides}
              onClick={toggleGuides}
            >
              <i />
            </button>
          </Row>
        )}
      </section>

      <ExportPanel />
    </div>
  );
}
