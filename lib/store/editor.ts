"use client";

/**
 * Editor state.
 *
 * Three decisions worth knowing about:
 *
 * 1. A **page** is the unit of work — one artboard, with its template, size,
 *    variant and slide. A **project** is an ordered list of them. A single
 *    artboard is simply a one-page project, so nothing about the common case
 *    got heavier when multi-page arrived.
 *
 * 2. **Copy stays keyed by template**, with a page holding only an optional
 *    override. That preserves the property this editor has always had — wander
 *    the library and come back, and what you wrote is still there — while still
 *    letting two pages of the same template say different things. See
 *    `resolveValues` and `setField` for exactly when a page gets its own copy.
 *
 * 3. Undo is patch-based, not snapshot-based. A snapshot per keystroke would
 *    copy every template's values on every character; a patch records only what
 *    changed, and typing runs coalesce so a step feels like an edit rather than
 *    a character. Every closure addresses a page by **id**, never by index —
 *    indices shift under reorder and delete, and an undo that rewinds the wrong
 *    page is worse than no undo at all.
 */
import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TEMPLATES, getTemplate } from "@/lib/templates/registry";
import { DEFAULT_VARIANT, type FieldValue, type FieldValues, type Variant } from "@/lib/templates/types";
import { SIZES, type Size, type SizeId } from "@/lib/templates/sizes";
import type { FormatId } from "@/lib/export/formats";

// ---------------------------------------------------------------- ids

let idCounter = 0;

/**
 * A locally unique id.
 *
 * Not `crypto.randomUUID()`: that is undefined on any non-HTTPS origin other
 * than localhost, and this is a static export somebody may well open over plain
 * HTTP or from a file server.
 */
function makeId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}`;
}

// ---------------------------------------------------------------- model

export type Page = {
  id: string;
  templateId: string;
  sizeId: SizeId | null;
  variant: Variant;
  /** Which slide of a fixed-deck template this page shows. */
  slide?: number;
  /** Copy belonging to this page alone. Absent means "use the shared draft". */
  values?: FieldValues;
};

export type Project = {
  id: string;
  name: string;
  pages: Page[];
  updatedAt: number;
};

type Patch = {
  /** What the user did. Shown on the undo button. */
  label: string;
  undo: () => void;
  redo: () => void;
  /** Edits sharing a key within the merge window collapse into one step. */
  mergeKey?: string;
  at: number;
};

const MERGE_WINDOW_MS = 700;

export type ExportSettings = {
  format: FormatId;
  scale: number;
  quality: number;
  transparent: boolean;
};

type EditorState = {
  project: Project;
  activePage: number;
  /** Shared drafts, keyed by template. Only templates actually edited appear. */
  values: Record<string, FieldValues>;

  zoom: number;
  fitRequest: number;
  showGuides: boolean;
  exportSettings: ExportSettings;

  past: Patch[];
  future: Patch[];

  selectTemplate: (id: string) => void;
  selectSize: (id: SizeId) => void;
  setVariant: (patch: Partial<Variant>, label?: string) => void;
  setField: (key: string, value: FieldValue) => void;
  resetTemplate: () => void;
  setSlide: (n: number) => void;

  setActivePage: (index: number) => void;
  addPage: (templateId?: string) => void;
  duplicatePage: (pageId?: string) => void;
  removePage: (pageId?: string) => void;
  movePage: (pageId: string, beforePageId: string | null) => void;
  expandDeck: () => void;

  newProject: (pages?: Page[], name?: string) => void;
  loadProject: (project: Project) => void;
  renameProject: (name: string) => void;

  setZoom: (z: number) => void;
  requestFit: () => void;
  toggleGuides: () => void;
  setExportSettings: (patch: Partial<ExportSettings>) => void;

  undo: () => void;
  redo: () => void;
};

const FIRST = TEMPLATES[0]?.id ?? "";

/** A page showing a template at its own preferred variant. */
export function makePage(templateId: string, slide = 0): Page {
  const template = getTemplate(templateId);
  return {
    id: makeId("page"),
    templateId,
    sizeId: null,
    variant: { ...DEFAULT_VARIANT, ...template?.variantDefaults },
    slide,
  };
}

function emptyProject(): Project {
  return { id: makeId("proj"), name: "Untitled", pages: [makePage(FIRST)], updatedAt: Date.now() };
}

// ---------------------------------------------------------------- selectors

/**
 * The page being edited.
 *
 * Returns a stored object, so the reference is stable and this is safe to use
 * directly as a zustand selector. Anything that *builds* an object inside a
 * selector re-renders forever under React 19 — `useCurrentValues` at the bottom
 * of this file exists because of exactly that.
 *
 * Undefined is possible: `activePage` can point past the end between a delete
 * and the re-clamp, so callers guard.
 */
export const selectPage = (s: EditorState): Page | undefined => s.project.pages[s.activePage];

export function useActivePage(): Page | undefined {
  return useEditor(selectPage);
}

/** The size a template is currently being rendered at. */
export function currentSize(state: { templateId: string; sizeId: SizeId | null }): Size {
  const template = getTemplate(state.templateId);
  if (!template) return SIZES.square;
  const chosen = state.sizeId ? template.sizes.find((s) => s.id === state.sizeId) : undefined;
  return chosen ?? template.sizes[0];
}

/**
 * Copy for a page: the template's defaults, then the shared draft, then the
 * page's own override if it has one.
 *
 * NOT safe as a zustand selector — it builds a new object every call.
 */
export function resolveValues(
  state: Pick<EditorState, "values">,
  page: Page | undefined,
): FieldValues {
  if (!page) return {};
  const template = getTemplate(page.templateId);
  if (!template) return {};
  return { ...template.defaults, ...(state.values[page.templateId] ?? {}), ...(page.values ?? {}) };
}

/** How many pages in the project show this template. */
function countUsing(project: Project, templateId: string): number {
  return project.pages.reduce((n, p) => (p.templateId === templateId ? n + 1 : n), 0);
}

const touch = (project: Project, pages: Page[]): Project => ({ ...project, pages, updatedAt: Date.now() });

/** Replaces one page, addressed by id so reorder and delete cannot misdirect it. */
function withPage(project: Project, pageId: string, fn: (p: Page) => Page): Project {
  return touch(
    project,
    project.pages.map((p) => (p.id === pageId ? fn(p) : p)),
  );
}

export const useEditor = create<EditorState>()(
  persist(
    (set, get) => {
      /** Records a patch, merging with the previous one when the edit continues. */
      const record = (patch: Omit<Patch, "at">) => {
        const now = Date.now();
        const past = get().past;
        const last = past[past.length - 1];

        const merges =
          last &&
          patch.mergeKey !== undefined &&
          last.mergeKey === patch.mergeKey &&
          now - last.at < MERGE_WINDOW_MS;

        // Merging keeps the OLD undo (back to where the run started) and the NEW
        // redo, so one undo rewinds the whole typed phrase.
        const merged: Patch = merges ? { ...patch, undo: last.undo, at: now } : { ...patch, at: now };

        set({ past: [...(merges ? past.slice(0, -1) : past), merged].slice(-200), future: [] });
      };

      /** Keeps activePage inside the project after pages come and go. */
      const clamp = (index: number, length: number) => Math.max(0, Math.min(index, length - 1));

      /**
       * Gives every page on a template its own copy of the resolved values.
       *
       * Called at the moment a second page of the same template appears. Until
       * then they share one draft, which is what makes editing a single artboard
       * feel exactly as it always has; from then on they are independent, which
       * is what stops two proof slides fighting over one sentence.
       */
      const materialiseIfShared = (project: Project, templateId: string): Project => {
        if (countUsing(project, templateId) < 2) return project;
        const state = get();
        return touch(
          project,
          project.pages.map((p) =>
            p.templateId === templateId && p.values === undefined
              ? { ...p, values: { ...(state.values[templateId] ?? {}) } }
              : p,
          ),
        );
      };

      return {
        project: emptyProject(),
        activePage: 0,
        values: {},

        zoom: 1,
        fitRequest: 0,
        showGuides: true,
        exportSettings: { format: "png", scale: 2, quality: 90, transparent: false },

        past: [],
        future: [],

        // ------------------------------------------------------ the page

        selectTemplate: (id) => {
          const template = getTemplate(id);
          const page = selectPage(get());
          if (!template || !page) return;

          const pid = page.id;
          const before = page;
          // A template may prefer a different theme or layout to its neighbours.
          const after: Page = { ...makePage(id), id: pid };

          set({ project: withPage(materialiseIfShared(get().project, id), pid, () => after) });
          record({
            label: `Open ${template.name}`,
            undo: () => set({ project: withPage(get().project, pid, () => before) }),
            redo: () => set({ project: withPage(get().project, pid, () => after) }),
          });
          get().requestFit();
        },

        selectSize: (id) => {
          const page = selectPage(get());
          if (!page) return;
          const pid = page.id;
          const before = page.sizeId;
          set({ project: withPage(get().project, pid, (p) => ({ ...p, sizeId: id })) });
          record({
            label: "Change size",
            undo: () => set({ project: withPage(get().project, pid, (p) => ({ ...p, sizeId: before })) }),
            redo: () => set({ project: withPage(get().project, pid, (p) => ({ ...p, sizeId: id })) }),
          });
          get().requestFit();
        },

        setVariant: (patch, label = "Change variant") => {
          const page = selectPage(get());
          if (!page) return;
          const pid = page.id;
          const before = page.variant;
          const after = { ...before, ...patch };
          set({ project: withPage(get().project, pid, (p) => ({ ...p, variant: after })) });
          record({
            label,
            // Scoped to the page: the same axis on two pages must not merge.
            mergeKey: `${pid}:variant:${Object.keys(patch).join(",")}`,
            undo: () => set({ project: withPage(get().project, pid, (p) => ({ ...p, variant: before })) }),
            redo: () => set({ project: withPage(get().project, pid, (p) => ({ ...p, variant: after })) }),
          });
        },

        setField: (key, value) => {
          const page = selectPage(get());
          if (!page) return;
          const pid = page.id;
          const templateId = page.templateId;

          // One page on this template and no override yet: write to the shared
          // draft, exactly as this editor always has. Otherwise the page owns
          // its copy and the write goes there.
          const ownsCopy = page.values !== undefined || countUsing(get().project, templateId) > 1;

          if (!ownsCopy) {
            const before = get().values[templateId] ?? {};
            const after = { ...before, [key]: value };
            const write = (v: FieldValues) => set({ values: { ...get().values, [templateId]: v } });
            write(after);
            record({
              label: `Edit ${key}`,
              mergeKey: `${templateId}:${key}`,
              undo: () => write(before),
              redo: () => write(after),
            });
            return;
          }

          const before = page.values ?? { ...(get().values[templateId] ?? {}) };
          const after = { ...before, [key]: value };
          const write = (v: FieldValues) =>
            set({ project: withPage(get().project, pid, (p) => ({ ...p, values: v })) });
          write(after);
          record({
            label: `Edit ${key}`,
            mergeKey: `${pid}:${key}`,
            undo: () => write(before),
            redo: () => write(after),
          });
        },

        resetTemplate: () => {
          const page = selectPage(get());
          if (!page) return;
          const pid = page.id;
          const templateId = page.templateId;

          const pageBefore = page.values;
          const sharedBefore = get().values[templateId];
          if (pageBefore === undefined && sharedBefore === undefined) return;

          const apply = () => {
            const next = { ...get().values };
            delete next[templateId];
            set({
              values: next,
              project: withPage(get().project, pid, (p) => {
                const { values: _drop, ...rest } = p;
                void _drop;
                return rest;
              }),
            });
          };

          apply();
          record({
            label: "Reset to defaults",
            undo: () =>
              set({
                values: sharedBefore === undefined ? get().values : { ...get().values, [templateId]: sharedBefore },
                project: withPage(get().project, pid, (p) =>
                  pageBefore === undefined ? p : { ...p, values: pageBefore },
                ),
              }),
            redo: apply,
          });
        },

        setSlide: (n) => {
          const page = selectPage(get());
          if (!page) return;
          set({ project: withPage(get().project, page.id, (p) => ({ ...p, slide: Math.max(0, n) })) });
        },

        // ------------------------------------------------------ the project

        setActivePage: (index) => {
          set({ activePage: clamp(index, get().project.pages.length) });
          get().requestFit();
        },

        addPage: (templateId) => {
          const from = selectPage(get());
          const id = templateId ?? from?.templateId ?? FIRST;
          const page = makePage(id);
          const at = get().activePage + 1;

          const insert = () => {
            const pages = [...get().project.pages];
            pages.splice(Math.min(at, pages.length), 0, page);
            set({ project: materialiseIfShared(touch(get().project, pages), id), activePage: Math.min(at, pages.length - 1) });
          };

          insert();
          record({
            label: "Add page",
            undo: () => {
              const pages = get().project.pages.filter((p) => p.id !== page.id);
              set({ project: touch(get().project, pages), activePage: clamp(at - 1, pages.length) });
            },
            redo: insert,
          });
          get().requestFit();
        },

        duplicatePage: (pageId) => {
          const source = pageId ? get().project.pages.find((p) => p.id === pageId) : selectPage(get());
          if (!source) return;

          // The copy carries its own values from the start, so editing one does
          // not silently rewrite the other.
          const copy: Page = {
            ...source,
            id: makeId("page"),
            values: { ...resolveValuesFor(get(), source) },
          };
          const at = get().project.pages.findIndex((p) => p.id === source.id) + 1;

          const insert = () => {
            const pages = [...get().project.pages];
            pages.splice(at, 0, copy);
            set({ project: materialiseIfShared(touch(get().project, pages), copy.templateId), activePage: at });
          };

          insert();
          record({
            label: "Duplicate page",
            undo: () => {
              const pages = get().project.pages.filter((p) => p.id !== copy.id);
              set({ project: touch(get().project, pages), activePage: clamp(at - 1, pages.length) });
            },
            redo: insert,
          });
        },

        removePage: (pageId) => {
          const project = get().project;
          if (project.pages.length <= 1) return; // A project is never empty.

          const target = pageId ? project.pages.find((p) => p.id === pageId) : selectPage(get());
          if (!target) return;
          const at = project.pages.findIndex((p) => p.id === target.id);

          const drop = () => {
            const pages = get().project.pages.filter((p) => p.id !== target.id);
            set({ project: touch(get().project, pages), activePage: clamp(at, pages.length) });
          };

          drop();
          record({
            label: "Delete page",
            undo: () => {
              const pages = [...get().project.pages];
              // Re-derive the slot defensively: the list may have changed shape.
              pages.splice(Math.min(at, pages.length), 0, target);
              set({ project: touch(get().project, pages), activePage: Math.min(at, pages.length - 1) });
            },
            redo: drop,
          });
          get().requestFit();
        },

        movePage: (pageId, beforePageId) => {
          const order = () => get().project.pages.map((p) => p.id);
          const before = order();

          const apply = (targetIds: string[]) => {
            const byId = new Map(get().project.pages.map((p) => [p.id, p]));
            const pages = targetIds.map((id) => byId.get(id)).filter(Boolean) as Page[];
            const active = pages.findIndex((p) => p.id === (selectPage(get())?.id ?? ""));
            set({ project: touch(get().project, pages), activePage: active < 0 ? 0 : active });
          };

          const next = before.filter((id) => id !== pageId);
          // Recorded as "before this page", not "to index n" — an index means a
          // different thing after any other reorder or delete.
          const at = beforePageId ? next.indexOf(beforePageId) : next.length;
          next.splice(at < 0 ? next.length : at, 0, pageId);

          apply(next);
          record({ label: "Reorder pages", undo: () => apply(before), redo: () => apply(next) });
        },

        expandDeck: () => {
          const page = selectPage(get());
          if (!page) return;
          const template = getTemplate(page.templateId);
          const slides = template?.slides ?? 1;
          if (slides < 2) return;

          const before = get().project.pages;
          const at = get().activePage;

          const expand = () => {
            const shared = { ...(get().values[page.templateId] ?? {}) };
            const made: Page[] = Array.from({ length: slides }, (_, i) => ({
              ...page,
              id: i === 0 ? page.id : makeId("page"),
              slide: i,
              // Every slide of a deck shares one set of fields — the deck's copy
              // is written once and each slide reads its own keys from it — so
              // they all start from the same resolved draft.
              values: shared,
            }));
            const pages = [...before];
            pages.splice(at, 1, ...made);
            set({ project: touch(get().project, pages), activePage: at });
          };

          expand();
          record({
            label: "Expand deck to pages",
            undo: () => set({ project: touch(get().project, before), activePage: at }),
            redo: expand,
          });
          get().requestFit();
        },

        newProject: (pages, name = "Untitled") => {
          const project: Project = {
            id: makeId("proj"),
            name,
            pages: pages?.length ? pages : [makePage(FIRST)],
            updatedAt: Date.now(),
          };
          // A new project starts a new history: undoing across the boundary
          // would resurrect pages that belong to a document you have left.
          set({ project, activePage: 0, past: [], future: [] });
          get().requestFit();
        },

        loadProject: (project) => {
          set({ project: { ...project, pages: [...project.pages] }, activePage: 0, past: [], future: [] });
          get().requestFit();
        },

        renameProject: (name) => {
          const before = get().project.name;
          const apply = (n: string) => set({ project: { ...get().project, name: n, updatedAt: Date.now() } });
          apply(name);
          record({ label: "Rename", mergeKey: "project:name", undo: () => apply(before), redo: () => apply(name) });
        },

        // ------------------------------------------------------ viewport

        setZoom: (z) => set({ zoom: Math.min(4, Math.max(0.05, z)) }),
        // A counter rather than a boolean: the canvas watches it and refits on
        // every increment, so two fit requests in a row both take effect.
        requestFit: () => set({ fitRequest: get().fitRequest + 1 }),
        toggleGuides: () => set({ showGuides: !get().showGuides }),
        setExportSettings: (patch) => set({ exportSettings: { ...get().exportSettings, ...patch } }),

        undo: () => {
          const past = get().past;
          const patch = past[past.length - 1];
          if (!patch) return;
          patch.undo();
          set({ past: past.slice(0, -1), future: [patch, ...get().future].slice(0, 200) });
        },

        redo: () => {
          const [patch, ...rest] = get().future;
          if (!patch) return;
          patch.redo();
          set({ past: [...get().past, patch], future: rest });
        },
      };
    },
    {
      name: "harystyles-editor",
      version: 1,
      /**
       * Turns a pre-pages saved state into a one-page project.
       *
       * Without this, zustand shallow-merges the old blob into the new initial
       * state: `project` keeps its default value while the stale keys ride along
       * as dead properties, and the page silently reverts to the default
       * template. `values` passes through untouched, so nothing anyone typed is
       * lost.
       */
      migrate: (persisted, from) => {
        const old = persisted as Partial<{
          templateId: string;
          sizeId: SizeId | null;
          variant: Variant;
          values: Record<string, FieldValues>;
          showGuides: boolean;
          exportSettings: ExportSettings;
        }>;

        if (from >= 1) return persisted as EditorState;

        // The catalogue has churned, so a saved id may no longer exist.
        const templateId = old?.templateId && getTemplate(old.templateId) ? old.templateId : FIRST;

        return {
          values: old?.values ?? {},
          showGuides: old?.showGuides ?? true,
          exportSettings:
            old?.exportSettings ?? { format: "png", scale: 2, quality: 90, transparent: false },
          activePage: 0,
          project: {
            id: makeId("proj"),
            name: "Untitled",
            updatedAt: Date.now(),
            pages: [
              {
                id: makeId("page"),
                templateId,
                sizeId: old?.sizeId ?? null,
                // Spread over the default so a variant saved before an axis
                // existed does not arrive missing a key.
                variant: { ...DEFAULT_VARIANT, ...old?.variant },
                slide: 0,
              },
            ],
          },
        } as unknown as EditorState;
      },
      // History holds closures, which do not survive serialisation, and the
      // viewport is a property of the session rather than the document.
      partialize: (s) => ({
        project: s.project,
        activePage: s.activePage,
        values: s.values,
        showGuides: s.showGuides,
        exportSettings: s.exportSettings,
      }),
    },
  ),
);

/** `resolveValues` against the live store, for use inside actions. */
function resolveValuesFor(state: EditorState, page: Page): FieldValues {
  return resolveValues(state, page);
}

/**
 * The active page's copy, defaults included.
 *
 * Referentially stable between edits, which is what keeps the canvas from
 * re-rendering a full artboard on every unrelated store change. Built in a
 * `useMemo` over atomic selectors rather than inside one, because a selector
 * that constructs an object re-renders forever under React 19.
 */
export function useCurrentValues(): FieldValues {
  const templateId = useEditor((s) => selectPage(s)?.templateId ?? "");
  const shared = useEditor((s) => s.values[selectPage(s)?.templateId ?? ""]);
  const own = useEditor((s) => selectPage(s)?.values);
  return useMemo(() => {
    const template = getTemplate(templateId);
    if (!template) return {};
    return { ...template.defaults, ...(shared ?? {}), ...(own ?? {}) };
  }, [templateId, shared, own]);
}

/** Copy for any page in the project — used by export, which walks all of them. */
export function valuesForPage(page: Page): FieldValues {
  return resolveValues(useEditor.getState(), page);
}

/**
 * The project with every page's copy resolved and inlined.
 *
 * A page normally reads its copy from the shared draft keyed by template, which
 * is what makes wandering the library free. That indirection cannot leave the
 * session: a saved or exported project has to be self-contained, or reopening it
 * next week would show the template defaults wherever the draft had been lost or
 * overwritten by other work.
 */
export function snapshotProject(): Project {
  const state = useEditor.getState();
  return {
    ...state.project,
    pages: state.project.pages.map((page) => ({ ...page, values: resolveValues(state, page) })),
  };
}
