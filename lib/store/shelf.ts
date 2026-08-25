"use client";

/**
 * The shelf — saved work.
 *
 * The brand's own word for a private collection of kept things, and its own
 * promise about one: *"Yours alone — never shown to writers, never used to
 * recommend things, never shared."* That is literally true here. Everything
 * lives in this browser; there is no server to send it to.
 */
import { STORES, idbAll, idbDelete, idbGet, idbPut } from "./idb";
import type { Project } from "./editor";

export type SavedProject = Project & {
  /** A picture of the first page, drawn when the project was saved. */
  cover?: Blob;
};

/** Newest first — the shelf is a record of what you were last working on. */
export async function listProjects(): Promise<SavedProject[]> {
  const entries = await idbAll<SavedProject>(STORES.projects);
  return entries
    .map(([, project]) => project)
    .filter(Boolean)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function readProject(id: string): Promise<SavedProject | null> {
  return idbGet<SavedProject>(STORES.projects, id);
}

export async function saveProject(project: Project, cover?: Blob): Promise<boolean> {
  // Keep the existing cover if this save did not produce a new one, so a quick
  // save does not blank the shelf card.
  const existing = cover ? null : await readProject(project.id);
  const record: SavedProject = {
    ...project,
    updatedAt: Date.now(),
    cover: cover ?? existing?.cover,
  };
  return idbPut(STORES.projects, project.id, record);
}

export function deleteProject(id: string): Promise<boolean> {
  return idbDelete(STORES.projects, id);
}

/**
 * A JSON copy of a project, for taking work somewhere else.
 *
 * The cover is dropped: it is a picture the app can redraw, and base64 of it
 * would multiply the file size for nothing.
 */
export function toJson(project: Project): string {
  const { pages, id, name, updatedAt } = project;
  return JSON.stringify({ harystyles: 1, project: { id, name, updatedAt, pages } }, null, 2);
}

/**
 * Reads a project back, checking enough of its shape to fail loudly rather than
 * loading something half-formed into the editor.
 */
export function fromJson(text: string): Project | null {
  try {
    const parsed = JSON.parse(text) as { harystyles?: number; project?: Project };
    const project = parsed?.project;
    if (!project || !Array.isArray(project.pages) || project.pages.length === 0) return null;
    if (!project.pages.every((p) => typeof p?.templateId === "string" && typeof p?.id === "string")) {
      return null;
    }
    return {
      id: project.id ?? `proj-${Date.now().toString(36)}`,
      name: project.name ?? "Untitled",
      updatedAt: project.updatedAt ?? Date.now(),
      pages: project.pages,
    };
  } catch {
    return null;
  }
}
