"use client";

import { useState } from "react";
import { expectBytes, sharedClient } from "@/lib/export/client";
import { resolveValues, snapshotProject, useEditor } from "@/lib/store/editor";
import { saveProject } from "@/lib/store/shelf";
import styles from "./SaveControls.module.css";

/**
 * Save, save-as, and start again.
 *
 * Saving renders a cover from the first page so the shelf shows the work rather
 * than a filename. That is one extra render per save, which is affordable
 * because saving is deliberate — unlike a thumbnail, it does not happen on every
 * keystroke.
 */
export function SaveControls() {
  const project = useEditor((s) => s.project);
  const renameProject = useEditor((s) => s.renameProject);
  const newProject = useEditor((s) => s.newProject);

  const [state, setState] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  async function cover(): Promise<Blob | undefined> {
    const first = project.pages[0];
    if (!first) return undefined;
    try {
      const result = expectBytes(
        await sharedClient().run({
          kind: "thumbnail",
          req: {
            templateId: first.templateId,
            sizeId: first.sizeId ?? undefined,
            variant: first.variant,
            values: resolveValues(useEditor.getState(), first),
            slide: first.slide,
          },
          width: 420,
        }),
      );
      return new Blob([result.buffer], { type: result.mime });
    } catch {
      // A project without a cover is still worth saving.
      return undefined;
    }
  }

  async function save(askForName: boolean) {
    let name = project.name;
    if (askForName || name === "Untitled") {
      const answer = window.prompt("Call it what?", name === "Untitled" ? "" : name);
      if (answer === null) return;
      name = answer.trim() || "Untitled";
      renameProject(name);
    }

    setState("saving");
    const ok = await saveProject({ ...snapshotProject(), name }, await cover());
    setState(ok ? "saved" : "failed");
    // The confirmation is not news for long.
    setTimeout(() => setState("idle"), 2500);
  }

  const label =
    state === "saving" ? "Saving…" : state === "saved" ? "Saved" : state === "failed" ? "Would not save" : "Save";

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.button}
        onClick={() => void save(false)}
        disabled={state === "saving"}
        data-state={state}
        title="Keep this on your shelf"
      >
        {label}
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={() => void save(true)}
        disabled={state === "saving"}
        title="Save as a separate project"
      >
        Save as
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          if (!window.confirm("Start something new? Anything unsaved is not recoverable.")) return;
          newProject();
        }}
      >
        New
      </button>
    </div>
  );
}
