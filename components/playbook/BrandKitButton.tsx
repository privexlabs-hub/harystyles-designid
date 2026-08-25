"use client";

import { useState } from "react";
import { downloadBrandKit } from "@/lib/export/brandkit";
import styles from "./BrandKitButton.module.css";

/**
 * The whole kit, as one file.
 *
 * A client island on an otherwise static page: the zip is assembled in the
 * browser from the files already served here, so there is nothing to build or
 * host — and nothing to go stale when a token or a lockup changes.
 */
export function BrandKitButton() {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function run() {
    setNote(null);
    setBusy(true);
    const result = await downloadBrandKit();
    setBusy(false);
    setNote(
      result.ok
        ? `${result.files} files · ${(result.bytes / (1024 * 1024)).toFixed(1)} MB`
        : result.message,
    );
  }

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.button} onClick={run} disabled={busy}>
        <span className="body-sm" style={{ color: "var(--fg)" }}>
          {busy ? "Assembling…" : "Everything — tokens, fonts, logos"}
        </span>
        <span className="mono" style={{ fontSize: 9 }}>
          ZIP
        </span>
      </button>
      {note && <p className={`mono ${styles.note}`}>{note}</p>}
    </div>
  );
}
