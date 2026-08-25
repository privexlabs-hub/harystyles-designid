"use client";

import { useEffect, useState } from "react";
import { selectPage, useEditor } from "@/lib/store/editor";
import { Canvas } from "./Canvas";
import { CanvasErrorBoundary } from "./ErrorBoundary";
import { PagesRail } from "./PagesRail";
import { SaveControls } from "./SaveControls";
import { Inspector } from "./Inspector";
import { Library } from "./Library";
import styles from "./EditorShell.module.css";

type Pane = "library" | "inspector" | null;

/**
 * The editor's three panes.
 *
 * On a desktop they sit side by side. Below the breakpoint the canvas keeps the
 * whole screen and the two panels become sheets — a three-column editor squeezed
 * into 390px is three unusable columns rather than one usable one.
 */
export function EditorShell() {
  const [sheet, setSheet] = useState<Pane>(null);
  const undo = useEditor((s) => s.undo);
  const redo = useEditor((s) => s.redo);
  const requestFit = useEditor((s) => s.requestFit);
  const templateId = useEditor((s) => selectPage(s)?.templateId ?? "");
  const addPage = useEditor((s) => s.addPage);
  const pageCount = useEditor((s) => s.project.pages.length);
  const canUndo = useEditor((s) => s.past.length > 0);
  const canRedo = useEditor((s) => s.future.length > 0);
  // Patch.label has been recorded since the beginning and shown nowhere.
  const undoLabel = useEditor((s) => s.past[s.past.length - 1]?.label);
  const redoLabel = useEditor((s) => s.future[0]?.label);

  // Zustand's persist rehydrates after mount, so the first paint would show the
  // default template and then swap. Holding the panes back one frame avoids it.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z") {
        // Undo still works while typing — that is what a writer expects — but
        // the browser's own field-level undo goes first, so only intercept it
        // outside a field.
        if (typing) return;
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
      if (!typing && (e.key === "0" || e.key === "f")) {
        e.preventDefault();
        requestFit();
      }
      if (e.key === "Escape") setSheet(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, requestFit]);

  return (
    <div className={styles.shell}>
      {/*
        The library is one button per template, so without these the export
        controls sit 219 tab stops from the top — technically reachable and
        practically not. Hidden until focused, in the same manner as the
        site-wide skip link.
      */}
      <nav className={styles.skips} aria-label="Skip within the editor">
        <a href="#editor-canvas">Skip to the artboard</a>
        <a href="#editor-inspector">Skip to editing</a>
      </nav>
      <div className={styles.library}>{ready && <Library />}</div>

      <div className={styles.centre} id="editor-canvas">
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.sheetButton}
            onClick={() => setSheet(sheet === "library" ? null : "library")}
          >
            Templates
          </button>
          <div className={styles.history}>
            {/* Words rather than ↶ ↷: neither arrow is in the brand faces, and
                the fallback renders them as empty boxes. */}
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              title={undoLabel ? `Undo — ${undoLabel} (⌘Z)` : "Nothing to undo"}
            >
              Undo
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              title={redoLabel ? `Redo — ${redoLabel} (⇧⌘Z)` : "Nothing to redo"}
            >
              Redo
            </button>
            <button type="button" onClick={requestFit} title="Fit to screen (F)">
              Fit
            </button>
            {/* Always here, not only in the pages rail — the rail hides itself
                for a one-page project, which would leave no way to reach two. */}
            <button
              type="button"
              onClick={() => addPage()}
              title="Add a page to this project"
            >
              Add page
            </button>
          </div>
          <SaveControls />
          <button
            type="button"
            className={styles.sheetButton}
            onClick={() => setSheet(sheet === "inspector" ? null : "inspector")}
          >
            Edit
          </button>
        </div>
        {ready && (
          <CanvasErrorBoundary templateId={templateId} onReset={requestFit}>
            <Canvas />
          </CanvasErrorBoundary>
        )}
        {ready && <PagesRail />}
      </div>

      <div className={styles.inspector} id="editor-inspector" tabIndex={-1}>
        {ready && <Inspector />}
      </div>

      {sheet && (
        <>
          <button
            type="button"
            className={styles.scrim}
            aria-label="Close panel"
            onClick={() => setSheet(null)}
          />
          <div className={styles.sheet} role="dialog" aria-modal="true">
            <div className={styles.sheetGrip} />
            {sheet === "library" ? <Library /> : <Inspector />}
          </div>
        </>
      )}
    </div>
  );
}
