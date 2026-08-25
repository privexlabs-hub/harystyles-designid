# harystyles — brand identity playbook & asset editor

A static site with two halves:

- **The playbook** — the harystyles design system as responsive documentation:
  brand, type, colour, spacing, components, and the product itself rendered in
  device and browser mockups.
- **The editor** — a client-side design tool that produces branded artwork from
  that system across eleven formats, and exports it as PNG, JPEG, WebP, SVG or
  PDF, one at a time or as a zip.

Frontend only. No backend, no database, no API. Every font, icon and texture is
self-hosted; the app makes no network request at runtime.

Ported from the Claude Design canvas `harystyles.html`, whose original files are
kept unchanged in `.source/` for reference.

## Running it

```bash
npm install
npm run assets   # once — downloads fonts, generates logos, favicons, textures
npm run dev
npm run build    # emits a fully static site into out/
```

`npm run assets` is not part of the build. Its output is committed, so a clone
runs without it; re-run it only when a font or the logomark changes.

## Checks

Static checks — `npm run check:all`:

| Command | What it proves |
| --- | --- |
| `npm run check:tokens` | `lib/color.ts` and `app/tokens.css` still agree |
| `npm run lint:satori` | No template uses CSS that Satori silently ignores |
| `npm run visreg` | Every template renders identically in the DOM and in the export |
| `npx tsc --noEmit` | Types |
| `/check` (dev) | The same DOM-vs-Satori comparison, by eye |

Runtime checks, against a built site — `npm run build`, then `npm run serve:out`
in one terminal and `npm run verify` in another:

| Command | What it proves |
| --- | --- |
| `npm run verify:export` | PNG/JPEG/WebP/SVG/PDF come out at the exact pixel dimensions asked for, measured from the file headers |
| `npm run verify:batch` | "Export all" produces a zip with every asset, a manifest and a README |
| `npm run verify:responsive` | No route scrolls sideways at 360–1920, and none logs a console error |
| `npm run verify:a11y` | The editor is operable from the keyboard with a visible focus ring, and every colour pairing meets WCAG AA |
| `npm run verify:pages` | Add, duplicate, reorder, undo and delete pages; they survive a reload; a project exports one PDF page per artboard |
| `npm run verify:shelf` | A project saves, appears on the shelf with a cover, and reopens with its copy intact |
| `npm run verify:images` | A dropped photograph previews, exports inside the file, and survives a reload |
| `npm run verify:documents` | A starter opens as a real multi-page project and exports as a correctly sized A4 PDF |
| `npm run verify:layout` | The editor's three panes sit in the right columns, in the right order, with the artboard centred and drawable, at ten widths |

## Pages, projects and the shelf

A **page** is one artboard: a template, a size, a variant. A **project** is an
ordered list of pages, and a single artboard is simply a one-page project — so
the common case pays nothing for the machinery.

Copy is keyed by template, with a page holding an optional override. That keeps
the property the editor has always had (wander the library, come back, your
words are still there) while letting two pages of the same template say
different things. The rule is exact: with one page on a template, edits go to
the shared draft; the moment a second page of that template appears, both
materialise their own copy and diverge from there.

Saving takes a snapshot with every page's copy resolved and inlined, so a saved
project is self-contained rather than entangled with the live drafts.

**Text does not flow between pages.** Each page holds its own copy, the way all
149 templates do. Satori cannot measure and re-break a paragraph across a page
boundary, and a DOM-side auto-split would drift from the exported page — the
precise failure the visual-regression suite exists to catch.

## Documents

Four starters, all in the brand's own vocabulary: a notebook (its word for a
series of letters), a printed letter, a press kit, and the annual letter — what
a company with no shareholders writes instead of a report. Print pages are
authored at 300 dpi, so A4 at 2480×3508 exports as a PDF measuring exactly
595×842 points.

The generic business documents — proposals with pricing tables, whitepapers with
executive summaries, CVs — are deliberately absent. They need a vocabulary the
brand explicitly rejects.

## A note on the layout check

`verify:layout` asserts geometry — position, size, order — rather than presence,
and it exists because a regression once shipped through a suite that was entirely
green. A stray element in the shell's grid moved every pane one column right,
dropped the inspector onto a second row and left the canvas with zero height at
one whole breakpoint band. Every other check passed: they drive the UI by
selector, so they proved each control existed while none of them could see that
the editor was unusable.

A selector test proves a control is there. It says nothing about whether it is
anywhere a person could reach.

## How a template works

A template is authored **once**, as a React element tree, and rendered by two
engines: React DOM for the live preview, and Satori (→ resvg → PNG) for the
export. There is no second implementation to keep in sync, so the preview cannot
describe a different design from the file you download.

The price is that templates are written against Satori's CSS subset. The rules
are enforced by `lib/satori/constraints.ts` and documented there; the three that
cost the most time to discover were:

1. **Yoga defaults `flex-shrink` to 0** where CSS defaults it to 1, so a flex
   child never shrinks and simply overlaps its siblings.
2. **Satori does not decompose the `flex` shorthand.** `flex: "1 1 0%"` leaves
   `flexGrow` unset; use the longhands.
3. **`flexBasis` resolves against the main axis.** A basis of 0 inside a column
   zeroes the block's *height*, and its content spills over whatever follows.

A fourth is worth stating because it is invisible rather than wrong: Google
Fonts answers one CSS request with two different fonts — a subsetted *variable*
WOFF2 for modern browsers and a static instance as TTF for legacy ones. Satori
can only read the TTF. Left alone, the browser and the exporter set the same
string in different fonts, ~9% apart in width, which breaks lines in different
places. `scripts/fetch-fonts.mjs` therefore compresses the WOFF2 from our own
TTF rather than downloading Google's.

## Layout of the code

```
app/
  playbook/…            the documentation routes
  editor/               the asset editor
  check/                DOM-vs-Satori comparison (dev)
  tokens.css            the design system, ported verbatim
  fonts.css             generated from the font manifest
components/
  ui/                   the design system's components
  frames/               device and browser shells
  screens/              the product, as portraits
  playbook/             documentation primitives
  editor/               canvas, pages rail, library, inspector, export, save
lib/
  color.ts              OKLCH maths and the token values
  templates/            sizes, themes, layouts, the catalogue
  satori/               fonts and the render call
  export/               worker, formats, batching, filenames
  store/                editor state, the shelf, images, IndexedDB
scripts/                asset generation and the checks
public/assets/          fonts, logos, favicons, textures — all self-hosted
```

## Exported assets

Filenames are deterministic — `{category}/{slug}--{theme}-{accent}@{scale}.{ext}`
— so re-running an export overwrites rather than accumulating copies. A batch
also writes a `manifest.json` and a `README.txt` naming the platform each shape
is for.
