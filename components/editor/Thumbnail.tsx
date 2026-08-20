"use client";

import { useEffect, useRef, useState } from "react";
import { expectBytes, sharedClient } from "@/lib/export/client";
import { readThumbnail, writeThumbnail } from "@/lib/store/thumbnailCache";
import type { TemplateDef } from "@/lib/templates/types";
import { DEFAULT_VARIANT } from "@/lib/templates/types";
import styles from "./Thumbnail.module.css";

/**
 * A library thumbnail, rendered through the same pipeline as the export.
 *
 * Two things make this affordable:
 *
 *  - IntersectionObserver, so only the cards actually on screen are rendered.
 *    The library can hold a hundred and fifty templates and rendering them all
 *    on mount would lock the tab for a minute.
 *
 *  - a two-tier cache: object URLs in memory so scrolling back up is free, and
 *    the PNG blobs in IndexedDB so a reload does not pay for the grid again.
 *
 * The worker renders at the template's true dimensions and resvg scales the
 * result down; asking Satori for a small artboard would re-wrap the text and
 * the thumbnail would show a different design from the one you get.
 */
const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

const WIDTH = 220;

function thumbnailUrl(template: TemplateDef): Promise<string> {
  const cached = cache.get(template.id);
  if (cached) return Promise.resolve(cached);

  const existing = inflight.get(template.id);
  if (existing) return existing;

  const job = (async () => {
    const stored = await readThumbnail(template.id);
    if (stored) {
      const url = URL.createObjectURL(stored);
      cache.set(template.id, url);
      inflight.delete(template.id);
      return url;
    }

    const result = expectBytes(
      await sharedClient().run({
        kind: "thumbnail",
        req: {
          templateId: template.id,
          sizeId: template.sizes[0].id,
          variant: { ...DEFAULT_VARIANT, ...template.variantDefaults },
          values: {},
          slide: 0,
        },
        width: WIDTH,
      }),
    );
    const blob = new Blob([result.buffer], { type: result.mime });
    void writeThumbnail(template.id, blob);

    const url = URL.createObjectURL(blob);
    cache.set(template.id, url);
    inflight.delete(template.id);
    return url;
  })();

  inflight.set(template.id, job);
  return job;
}

export function Thumbnail({ template }: { template: TemplateDef }) {
  const ref = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState(() => cache.get(template.id) ?? null);
  const size = template.sizes[0];

  useEffect(() => {
    if (url) return;
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        thumbnailUrl(template)
          .then((u) => !cancelled && setUrl(u))
          .catch((err) => console.error(`Thumbnail failed for ${template.id}`, err));
      },
      { rootMargin: "200px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [template, url]);

  return (
    <div
      ref={ref}
      className={styles.frame}
      style={{ aspectRatio: `${size.w} / ${size.h}` }}
    >
      {url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={url} alt="" className={styles.image} loading="lazy" />
      ) : (
        <span className={styles.pending} />
      )}
    </div>
  );
}
