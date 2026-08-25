"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { EmptyState, Skeleton } from "@/components/ui";
import { deleteProject, fromJson, listProjects, saveProject, toJson, type SavedProject } from "@/lib/store/shelf";
import { makePage, useEditor } from "@/lib/store/editor";
import { DOCUMENT_STARTERS } from "@/lib/templates/documents";
import { DEFAULT_VARIANT } from "@/lib/templates/types";
import { getTemplate } from "@/lib/templates/registry";
import styles from "./shelf.module.css";

/** A saved project's cover, held as an object URL for as long as it is on screen. */
function Cover({ blob }: { blob?: Blob }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) return;
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

  return (
    <div className={styles.cover}>
      {url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={url} alt="" className={styles.coverImage} />
      ) : (
        <span className="mono" style={{ fontSize: 10, color: "var(--fg-faint)" }}>
          NO COVER
        </span>
      )}
    </div>
  );
}

function when(ms: number): string {
  const days = Math.floor((Date.now() - ms) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(ms).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function ShelfClient() {
  const router = useRouter();
  const [projects, setProjects] = useState<SavedProject[] | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const loadProject = useEditor((s) => s.loadProject);
  const newProject = useEditor((s) => s.newProject);

  const refresh = useCallback(async () => {
    setProjects(await listProjects());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  /**
   * Turns a starter into a real project.
   *
   * Its pages carry their copy directly, so a document is self-contained from
   * the moment it is created — several pages share a template and would
   * otherwise fight over one shared draft.
   */
  const startDocument = (starterId: string) => {
    const starter = DOCUMENT_STARTERS.find((d) => d.id === starterId);
    if (!starter) return;

    const pages = starter.pages.map((sp) => {
      const template = getTemplate(sp.templateId);
      const base = makePage(sp.templateId);
      return {
        ...base,
        variant: { ...DEFAULT_VARIANT, ...template?.variantDefaults, ...sp.variant },
        values: { ...(template?.defaults ?? {}), ...(sp.values ?? {}) },
      };
    });

    newProject(pages, starter.name);
    router.push("/editor");
  };

  const open = (project: SavedProject) => {
    // The cover is a picture of the project, not part of it.
    const { cover: _cover, ...rest } = project;
    void _cover;
    loadProject(rest);
    router.push("/editor");
  };

  const duplicate = async (project: SavedProject) => {
    const copy = {
      ...project,
      id: `proj-${Date.now().toString(36)}`,
      name: `${project.name} copy`,
      updatedAt: Date.now(),
    };
    await saveProject(copy, project.cover);
    await refresh();
    setNote(`Copied “${project.name}”.`);
  };

  const remove = async (project: SavedProject) => {
    if (!window.confirm(`Delete “${project.name}”? It is not recoverable.`)) return;
    await deleteProject(project.id);
    await refresh();
    setNote(`Deleted “${project.name}”.`);
  };

  const rename = async (project: SavedProject, name: string) => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === project.name) return;
    await saveProject({ ...project, name: trimmed }, project.cover);
    await refresh();
  };

  const exportJson = (project: SavedProject) => {
    const { cover: _cover, ...rest } = project;
    void _cover;
    const blob = new Blob([toJson(rest)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/[^\w-]+/g, "-").toLowerCase()}.harystyles.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    const project = fromJson(await file.text());
    if (!project) {
      setNote("That file is not a harystyles project, or it is damaged.");
      return;
    }
    await saveProject({ ...project, id: `proj-${Date.now().toString(36)}` });
    await refresh();
    setNote(`Added “${project.name}” to the shelf.`);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className="eyebrow">YOUR SHELF</div>
        <h1 className={`title-display ${styles.title}`}>
          The work you{" "}
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            kept.
          </span>
        </h1>
        <p className={`body-reading ${styles.lede}`}>
          Everything here lives in this browser and nowhere else. There is no account and no server
          to send it to — which also means clearing your site data clears the shelf, so export
          anything you would be sorry to lose.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            onClick={() => {
              newProject();
              router.push("/editor");
            }}
          >
            Start something new
          </button>
          <button type="button" className={styles.button} onClick={() => fileInput.current?.click()}>
            Bring in a project
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className={styles.hiddenInput}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importJson(file);
              e.target.value = "";
            }}
          />
        </div>
        {note && (
          <p className="body-sm" style={{ marginTop: "var(--s-3)" }} role="status">
            {note}
          </p>
        )}
      </header>

      <section style={{ marginBottom: "var(--s-9)" }}>
        <h2 className="eyebrow" style={{ marginBottom: "var(--s-2)" }}>
          START A DOCUMENT
        </h2>
        <p className="body-sm" style={{ margin: "0 0 var(--s-4)", maxWidth: "60ch" }}>
          Print pages at 300 dpi, which export as a single PDF. Text does not flow between pages —
          each page holds its own copy, the way every template here does.
        </p>
        <div className={styles.grid}>
          {DOCUMENT_STARTERS.map((starter) => (
            <button
              key={starter.id}
              type="button"
              className={styles.starter}
              onClick={() => startDocument(starter.id)}
            >
              <span className="title-sm">{starter.name}</span>
              <span className="body-sm" style={{ color: "var(--fg-muted)" }}>
                {starter.blurb}
              </span>
              <span className="mono" style={{ fontSize: 9, color: "var(--fg-faint)" }}>
                {starter.outline.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </section>

      <h2 className="eyebrow" style={{ marginBottom: "var(--s-4)" }}>
        SAVED WORK
      </h2>

      {projects === null && (
        <div className={styles.grid}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.card}>
              <Skeleton height={200} radius="var(--r-md)" />
              <Skeleton height={20} width="70%" />
              <Skeleton height={12} width="40%" />
            </div>
          ))}
        </div>
      )}

      {projects?.length === 0 && (
        <EmptyState
          title="Nothing on the shelf yet."
          body="Make something in the editor and save it, and it will be here when you come back."
          action={
            <Link href="/editor" className={styles.primary} style={{ display: "inline-flex", alignItems: "center" }}>
              Open the editor
            </Link>
          }
        />
      )}

      {projects && projects.length > 0 && (
        <div className={styles.grid}>
          {projects.map((project) => (
            <article key={project.id} className={styles.card}>
              <Cover blob={project.cover} />
              <input
                className={styles.name}
                defaultValue={project.name}
                aria-label={`Name of ${project.name}`}
                onBlur={(e) => void rename(project, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
              />
              <div className={`mono ${styles.meta}`} style={{ fontSize: 10 }}>
                <span>
                  {project.pages.length} {project.pages.length === 1 ? "PAGE" : "PAGES"}
                </span>
                <span>{when(project.updatedAt).toUpperCase()}</span>
              </div>
              <div className={styles.cardActions}>
                <button type="button" className={styles.primary} onClick={() => open(project)}>
                  Open
                </button>
                <button type="button" className={styles.button} onClick={() => void duplicate(project)}>
                  Duplicate
                </button>
                <button type="button" className={styles.button} onClick={() => exportJson(project)}>
                  Export
                </button>
                <button
                  type="button"
                  className={`${styles.button} ${styles.danger}`}
                  onClick={() => void remove(project)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
