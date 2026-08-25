"use client";

import { useMemo, useState } from "react";
import { TEMPLATES, populatedCategories, templatesIn } from "@/lib/templates/registry";
import { CATEGORY_META, type CategoryId } from "@/lib/templates/types";
import { selectPage, useEditor } from "@/lib/store/editor";
import { Thumbnail } from "./Thumbnail";
import styles from "./Library.module.css";

/**
 * The template library.
 *
 * Search covers name, category and blurb, because people look for "story" as
 * readily as they look for "vertical".
 */
export function Library() {
  const templateId = useEditor((s) => selectPage(s)?.templateId ?? "");
  const selectTemplate = useEditor((s) => s.selectTemplate);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");

  const categories = populatedCategories();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = category === "all" ? TEMPLATES : templatesIn(category);
    if (!q) return pool;
    return pool.filter((t) =>
      [t.name, t.blurb, t.category, t.id].some((s) => s.toLowerCase().includes(q)),
    );
  }, [query, category]);

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <input
          className={styles.search}
          type="search"
          value={query}
          placeholder="Search templates"
          aria-label="Search templates"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className={styles.categories}>
        <button
          type="button"
          className={styles.chip}
          data-active={category === "all"}
          onClick={() => setCategory("all")}
        >
          All <span className="mono">{TEMPLATES.length}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={styles.chip}
            data-active={category === c}
            onClick={() => setCategory(c)}
            title={CATEGORY_META[c].blurb}
          >
            {CATEGORY_META[c].label} <span className="mono">{templatesIn(c).length}</span>
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {results.map((t) => (
          <button
            key={t.id}
            type="button"
            className={styles.card}
            data-active={t.id === templateId}
            onClick={() => selectTemplate(t.id)}
            title={t.blurb}
          >
            <Thumbnail template={t} />
            <span className={styles.cardName}>{t.name}</span>
            <span className={`mono ${styles.cardSize}`}>
              {t.sizes[0].w}×{t.sizes[0].h}
              {t.slides ? ` · ${t.slides} slides` : ""}
            </span>
          </button>
        ))}
        {!results.length && (
          <p className="body-sm" style={{ gridColumn: "1 / -1" }}>
            Nothing matches “{query}”.
          </p>
        )}
      </div>
    </div>
  );
}
