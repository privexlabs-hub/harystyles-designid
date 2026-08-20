"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { TEMPLATES, getTemplate } from "@/lib/templates/registry";
import { renderTemplate } from "@/lib/templates/render";
import { SIZE_LIST } from "@/lib/templates/sizes";
import type { AccentId, ThemeId } from "@/lib/templates/theme";
import type { BackgroundId, CornerId, DensityId, LockupId, Variant } from "@/lib/templates/types";

/** A subscription that never fires: the render is server-then-client, once. */
const subscribeNever = () => () => {};

/**
 * A single artboard, at its true pixel size, with nothing around it.
 *
 * scripts/visreg.mjs screenshots the element marked `data-artboard` and diffs
 * it against the Satori render of the same request, so this page exists to make
 * the DOM half capturable: no scaling, no chrome, and a `data-ready` flag that
 * only appears once the webfonts have actually loaded — a screenshot taken
 * mid-swap would diff as drift that is not there.
 *
 * The request is read from the query string rather than a route parameter
 * because the site is a static export and the catalog grows a category at a time.
 */
export function VisregClient() {
  const [ready, setReady] = useState(false);

  // The query string may only be read after hydration — the site is a static
  // export, so prerendering this would bake one variant into the HTML. A
  // subscription that never fires is how you say "client only" without a
  // setState in an effect.
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);
  const params = useMemo(
    () => (mounted ? new URLSearchParams(window.location.search) : null),
    [mounted],
  );

  useEffect(() => {
    if (!params) return;
    let cancelled = false;
    // Two frames after fonts settle, so the layout that gets photographed is
    // the one the browser has finished with.
    document.fonts.ready.then(() =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => !cancelled && setReady(true)),
      ),
    );
    return () => {
      cancelled = true;
    };
  }, [params]);

  if (!params) return null;

  const template = getTemplate(params.get("t") ?? "") ?? TEMPLATES[0];
  if (!template) return <div data-artboard data-error="no templates registered" />;

  const size =
    template.sizes.find((s) => s.id === params.get("size")) ??
    SIZE_LIST.find((s) => s.id === params.get("size")) ??
    template.sizes[0];

  const variant: Partial<Variant> = {};
  const theme = params.get("theme");
  const accent = params.get("accent");
  const background = params.get("background");
  const lockup = params.get("lockup");
  const corner = params.get("corner");
  const density = params.get("density");
  const layout = params.get("layout");
  if (theme) variant.theme = theme as ThemeId;
  if (accent) variant.accent = accent as AccentId;
  if (background) variant.background = background as BackgroundId;
  if (lockup) variant.lockup = lockup as LockupId;
  if (corner) variant.corner = corner as CornerId;
  if (density) variant.density = density as DensityId;
  if (layout) variant.layout = Number(layout);

  return (
    <>
      {/* The capture has to be the artboard and nothing else: the site header,
          the skip link and the dev-tools overlay all sit above a fixed element
          and would diff as drift. */}
      <style>{`
        body > *:not(#main) { display: none !important; }
        nextjs-portal { display: none !important; }
        #main { margin: 0 !important; padding: 0 !important; }
      `}</style>
      <div
        data-artboard
        data-ready={ready ? "1" : "0"}
        data-template={template.id}
        // Pinned to the viewport origin so the screenshot can be an integer
        // clip rect: an element bounding box lands on a half pixel often
        // enough that measuring it instead costs a row of pixels.
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 2147483647,
          width: size.w,
          height: size.h,
          overflow: "hidden",
        }}
      >
        {renderTemplate({ template, size, variant, slide: Number(params.get("slide") ?? 0) })}
      </div>
    </>
  );
}
