"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { expectBytes, sharedClient } from "@/lib/export/client";
import { getTemplate } from "@/lib/templates/registry";
import { currentSize, resolveValues, selectPage, useEditor, type Page } from "@/lib/store/editor";
import styles from "./PagesRail.module.css";

/**
 * The pages in the project, and what you can do to them.
 *
 * Hidden entirely for a one-page project, so a single artboard is exactly the
 * editor it always was and pays nothing for machinery it does not use.
 */
function PageThumb({ page }: { page: Page }) {
  const [url, setUrl] = useState<string | null>(null);

  // Selected atomically and merged in a memo. `resolveValues` builds a new
  // object every call, so using it directly as a selector would re-render for
  // ever — the same trap useCurrentValues exists to avoid.
  const shared = useEditor((s) => s.values[page.templateId]);
  const values = useMemo(
    () => resolveValues({ values: shared ? { [page.templateId]: shared } : {} }, page),
    [shared, page],
  );
  const size = currentSize(page);

  // A signature of everything that changes the picture. Re-rendering a
  // thumbnail on every keystroke would put a Satori render behind each one, so
  // the effect is debounced and keyed on the content rather than the object.
  const signature = JSON.stringify([page.templateId, page.sizeId, page.variant, page.slide, values]);

  const latest = useRef(signature);
  latest.current = signature;

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    const timer = setTimeout(async () => {
      try {
        const result = expectBytes(
          await sharedClient().run({
            kind: "thumbnail",
            req: {
              templateId: page.templateId,
              sizeId: page.sizeId ?? undefined,
              variant: page.variant,
              values,
              slide: page.slide,
            },
            width: 144,
          }),
        );
        if (cancelled || latest.current !== signature) return;
        objectUrl = URL.createObjectURL(new Blob([result.buffer], { type: result.mime }));
        setUrl(objectUrl);
      } catch {
        // A page that will not draw still gets a slot in the rail; the canvas
        // and its error boundary are where that failure is explained.
      }
    }, 450);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return (
    <span className={styles.thumb} style={{ aspectRatio: `${size.w} / ${size.h}` }}>
      {url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={url} alt="" className={styles.image} />
      ) : (
        <span className={styles.pending} />
      )}
    </span>
  );
}

export function PagesRail() {
  const pages = useEditor((s) => s.project.pages);
  const activePage = useEditor((s) => s.activePage);
  const setActivePage = useEditor((s) => s.setActivePage);
  const addPage = useEditor((s) => s.addPage);
  const duplicatePage = useEditor((s) => s.duplicatePage);
  const removePage = useEditor((s) => s.removePage);
  const movePage = useEditor((s) => s.movePage);
  const expandDeck = useEditor((s) => s.expandDeck);
  const templateId = useEditor((s) => selectPage(s)?.templateId ?? "");

  const [dragging, setDragging] = useState<string | null>(null);
  const [dropBefore, setDropBefore] = useState<string | null>(null);

  const template = getTemplate(templateId);
  const deck = (template?.slides ?? 1) > 1;

  // One page and no deck to expand: there is nothing here worth the space.
  if (pages.length < 2 && !deck) return null;

  return (
    <div className={styles.rail} role="group" aria-label="Pages in this project">
      {/* Only the thumbnails scroll. The actions used to sit inside the scroll
          container after every page, so adding pages carried Duplicate and
          Delete off the side of the screen — and in a narrow column they were
          drawn over the library entirely. */}
      <div className={styles.strip}>
        {pages.map((page, index) => (
        <button
          key={page.id}
          type="button"
          className={styles.page}
          data-active={index === activePage}
          data-dragging={dragging === page.id}
          data-dropbefore={dropBefore === page.id}
          aria-current={index === activePage ? "true" : undefined}
          aria-label={`Page ${index + 1} of ${pages.length}`}
          onClick={() => setActivePage(index)}
          draggable
          onDragStart={() => setDragging(page.id)}
          onDragEnd={() => {
            setDragging(null);
            setDropBefore(null);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (dragging && dragging !== page.id) setDropBefore(page.id);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragging && dragging !== page.id) movePage(dragging, page.id);
            setDragging(null);
            setDropBefore(null);
          }}
        >
          <PageThumb page={page} />
          <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>
        </button>
      ))}

        <button
          type="button"
          className={styles.add}
          onClick={() => addPage()}
          aria-label="Add a page after this one"
        >
          <span aria-hidden>+</span>
          Add
        </button>
      </div>

      <div className={styles.tools}>
        <button type="button" className={styles.tool} onClick={() => duplicatePage()}>
          Duplicate
        </button>
        <button
          type="button"
          className={styles.tool}
          onClick={() => removePage()}
          disabled={pages.length <= 1}
          title={pages.length <= 1 ? "A project keeps at least one page" : undefined}
        >
          Delete
        </button>
        {deck && (
          <button type="button" className={styles.tool} onClick={() => expandDeck()}>
            Expand deck
          </button>
        )}
      </div>

      <p className={styles.note}>
        Text does not flow between pages — each page holds its own copy.
      </p>
    </div>
  );
}
