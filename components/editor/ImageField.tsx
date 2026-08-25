"use client";

import { useEffect, useRef, useState } from "react";
import { FieldNote } from "@/components/ui";
import { deleteImage, importImage, isImageRef, readImage } from "@/lib/store/images";
import styles from "./ImageField.module.css";

/**
 * Choose or drop a photograph.
 *
 * Everything stays in this browser — there is nothing to upload to — which is
 * worth saying in the field itself rather than in a help page nobody opens.
 */
export function ImageField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (ref: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [meta, setMeta] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "reading" | "failed">("idle");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;

    if (!isImageRef(value)) {
      setPreview(null);
      setMeta(null);
      return;
    }

    void readImage(value).then((stored) => {
      if (cancelled || !stored) {
        // The reference outlived its bytes — a cleared store, most likely.
        if (!cancelled) setState("failed");
        return;
      }
      url = URL.createObjectURL(stored.blob);
      setPreview(url);
      setMeta(`${stored.width}×${stored.height} · ${Math.round(stored.blob.size / 1024)} KB`);
    });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [value]);

  async function accept(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setState("failed");
      return;
    }
    setState("reading");
    const ref = await importImage(file);
    if (!ref) {
      setState("failed");
      return;
    }
    setState("idle");
    onChange(ref);
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>

      <div
        className={styles.drop}
        data-dragging={dragging}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void accept(e.dataTransfer.files?.[0]);
        }}
      >
        {preview ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={preview} alt="" className={styles.preview} />
        ) : (
          <span className={styles.empty}>{state === "reading" ? "Reading…" : "Drop a photograph"}</span>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={() => input.current?.click()}>
          {preview ? "Replace" : "Choose"}
        </button>
        {preview && (
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              if (isImageRef(value)) void deleteImage(value);
              onChange("");
            }}
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        className={styles.input}
        onChange={(e) => {
          void accept(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {state === "failed" ? (
        <FieldNote tone="alarm">
          That would not read as an image. Try a JPEG, PNG or WebP.
        </FieldNote>
      ) : meta ? (
        <FieldNote tone="hint">{meta} · kept in this browser only</FieldNote>
      ) : hint ? (
        <FieldNote tone="hint">{hint}</FieldNote>
      ) : null}
    </div>
  );
}
