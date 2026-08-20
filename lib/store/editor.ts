"use client";

/**
 * Editor state.
 *
 * Two decisions worth knowing about:
 *
 * 1. Undo is patch-based, not snapshot-based. A snapshot per keystroke would
 *    copy every template's field values on every character; a patch records only
 *    what changed. Typing runs are coalesced so undo steps feel like edits
 *    rather than characters.
 *
 * 2. Field values are keyed by template id and kept even when you switch away,
 *    so wandering through the library does not lose the copy you wrote. Only the
 *    templates you have actually touched are stored.
 */
import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TEMPLATES, getTemplate } from "@/lib/templates/registry";
import { DEFAULT_VARIANT, type FieldValue, type FieldValues, type Variant } from "@/lib/templates/types";
import { SIZES, type Size, type SizeId } from "@/lib/templates/sizes";
import type { FormatId } from "@/lib/export/formats";

type Patch = {
  /** What the user did, shown in the undo tooltip. */
  label: string;
  undo: () => void;
  redo: () => void;
  /** Edits to the same field within this window merge into one step. */
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
  templateId: string;
  sizeId: SizeId | null;
  variant: Variant;
  /** Only templates the user has edited appear here. */
  values: Record<string, FieldValues>;
  slide: number;

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

  setZoom: (z: number) => void;
  requestFit: () => void;
  toggleGuides: () => void;
  setExportSettings: (patch: Partial<ExportSettings>) => void;

  undo: () => void;
  redo: () => void;
};

/** The size a template is currently being rendered at. */
export function currentSize(state: Pick<EditorState, "templateId" | "sizeId">): Size {
  const template = getTemplate(state.templateId);
  if (!template) return SIZES.square;
  const chosen = state.sizeId ? template.sizes.find((s) => s.id === state.sizeId) : undefined;
  return chosen ?? template.sizes[0];
}

/**
 * Defaults merged with whatever the user has typed.
 *
 * NOT safe as a zustand selector — it builds a new object every call, which
 * would re-render on every store read forever. Call it from a useMemo over
 * `useTemplateOverrides()` instead; `useCurrentValues()` below does exactly that.
 */
export function currentValues(state: Pick<EditorState, "templateId" | "values">): FieldValues {
  const template = getTemplate(state.templateId);
  if (!template) return {};
  return { ...template.defaults, ...(state.values[state.templateId] ?? {}) };
}

const FIRST = TEMPLATES[0]?.id ?? "";

/** The user's edits for the active template, or undefined if untouched. */
export function useTemplateOverrides(): FieldValues | undefined {
  return useEditor((s) => s.values[s.templateId]);
}

export const useEditor = create<EditorState>()(
  persist(
    (set, get) => {
      /** Records a patch, merging with the previous one when it is the same edit continuing. */
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
        // redo, so an undo rewinds the whole typed phrase.
        const merged: Patch = merges
          ? { ...patch, undo: last.undo, at: now }
          : { ...patch, at: now };

        set({
          past: [...(merges ? past.slice(0, -1) : past), merged].slice(-200),
          future: [],
        });
      };

      return {
        templateId: FIRST,
        sizeId: null,
        variant: { ...DEFAULT_VARIANT },
        values: {},
        slide: 0,

        zoom: 1,
        fitRequest: 0,
        showGuides: true,
        exportSettings: { format: "png", scale: 2, quality: 90, transparent: false },

        past: [],
        future: [],

        selectTemplate: (id) => {
          const template = getTemplate(id);
          if (!template) return;
          const before = { templateId: get().templateId, sizeId: get().sizeId, variant: get().variant, slide: get().slide };
          // A template may prefer a different theme or layout to its neighbours.
          const after = {
            templateId: id,
            sizeId: null,
            variant: { ...DEFAULT_VARIANT, ...template.variantDefaults },
            slide: 0,
          };
          set(after);
          record({
            label: `Open ${template.name}`,
            undo: () => set(before),
            redo: () => set(after),
          });
          get().requestFit();
        },

        selectSize: (id) => {
          const before = get().sizeId;
          set({ sizeId: id });
          record({ label: "Change size", undo: () => set({ sizeId: before }), redo: () => set({ sizeId: id }) });
          get().requestFit();
        },

        setVariant: (patch, label = "Change variant") => {
          const before = get().variant;
          const after = { ...before, ...patch };
          set({ variant: after });
          record({
            label,
            mergeKey: `variant:${Object.keys(patch).join(",")}`,
            undo: () => set({ variant: before }),
            redo: () => set({ variant: after }),
          });
        },

        setField: (key, value) => {
          const id = get().templateId;
          const before = get().values[id] ?? {};
          const after = { ...before, [key]: value };
          set({ values: { ...get().values, [id]: after } });
          record({
            label: `Edit ${key}`,
            mergeKey: `${id}:${key}`,
            undo: () => set({ values: { ...get().values, [id]: before } }),
            redo: () => set({ values: { ...get().values, [id]: after } }),
          });
        },

        resetTemplate: () => {
          const id = get().templateId;
          const before = get().values[id];
          if (!before) return;
          const next = { ...get().values };
          delete next[id];
          set({ values: next });
          record({
            label: "Reset to defaults",
            undo: () => set({ values: { ...get().values, [id]: before } }),
            redo: () => {
              const n = { ...get().values };
              delete n[id];
              set({ values: n });
            },
          });
        },

        setSlide: (n) => set({ slide: Math.max(0, n) }),

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
      // History holds closures, which do not survive serialisation, and the
      // viewport is a property of the session rather than the document.
      partialize: (s) => ({
        templateId: s.templateId,
        sizeId: s.sizeId,
        variant: s.variant,
        values: s.values,
        showGuides: s.showGuides,
        exportSettings: s.exportSettings,
      }),
    },
  ),
);

/**
 * The active template's values, defaults included.
 *
 * Referentially stable between edits, which is what keeps the canvas from
 * re-rendering a full artboard on every unrelated store change.
 */
export function useCurrentValues(): FieldValues {
  const templateId = useEditor((s) => s.templateId);
  const overrides = useEditor((s) => s.values[s.templateId]);
  return useMemo(() => {
    const template = getTemplate(templateId);
    if (!template) return {};
    return { ...template.defaults, ...(overrides ?? {}) };
  }, [templateId, overrides]);
}
