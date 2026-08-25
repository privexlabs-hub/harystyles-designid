/**
 * The design system as a zip someone can hand to a printer or a contractor.
 *
 * Nothing here is generated: every file already ships with the site, and this
 * module only collects them. The one exception is tokens.css — the real one is
 * bundled and hashed by the build, so fetching it would hand over a file full
 * of app selectors. The token VALUES are already in lib/color.ts (they have to
 * be, because Satori cannot read CSS), so a clean stylesheet is emitted from
 * there instead. scripts/check-tokens.mjs is what keeps the two honest.
 *
 * Everything is fetched from the built site rather than imported, so the zip
 * carries the exact bytes a browser would load — and no font ever enters the
 * JS bundle.
 */
import { downloadZip } from "client-zip";
import { HEX, OKLCH_TOKENS, type TokenName } from "@/lib/color";
import { saveBlob } from "./download";

/** Filenames under /assets/logo/. Hardcoded because a static export has no
 *  directory listing, and a missing file is better caught here than silently. */
const LOGO_FILES = [
  "wordmark.svg",
  "wordmark-ink.svg",
  "lockup-horizontal.svg",
  "lockup-horizontal-ink.svg",
  "lockup-stacked.svg",
  "tagline-lockup.svg",
  "stamp.svg",
  "logomark-amber.svg",
  "logomark-ink.svg",
  "logomark-vellum.svg",
  "logomark-mono.svg",
  "logomark-inverted.svg",
  "app-icon-amber.svg",
  "app-icon-ink.svg",
  "app-icon-vellum.svg",
  "app-icon-amber-512.png",
  "app-icon-ink-512.png",
  "app-icon-vellum-512.png",
];

const FAVICON_FILES = [
  "favicon.ico",
  "favicon.svg",
  "icon-192.png",
  "icon-512.png",
  "icon-512-maskable.png",
  "apple-touch-icon.png",
  "site.webmanifest",
];

type FontEntry = { family: string; weight: number; style: string; ttf: string; woff2: string };

type ZipEntry = { name: string; input: Uint8Array | string; lastModified: Date };

/**
 * Missing assets are skipped rather than fatal.
 *
 * A brand kit that arrives one icon short is worth more than an error message,
 * and the README reports what actually landed — so a gap is visible without
 * costing the whole download.
 */
async function fetchBytes(url: string): Promise<Uint8Array | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return new Uint8Array(await res.arrayBuffer());
  } catch {
    return null;
  }
}

/** The token layer of app/tokens.css, rebuilt from the values Satori uses. */
function tokensCss(): string {
  const lines = [
    "/*",
    " * harystyles design tokens.",
    " *",
    " * Authored in OKLCH; the hex beside each line is the sRGB fallback, and is",
    " * what non-OKLCH tools (and the SVG/PNG exports) actually use.",
    " */",
    ":root {",
  ];

  for (const [name, [l, c, h]] of Object.entries(OKLCH_TOKENS)) {
    const hex = HEX[name as TokenName];
    lines.push(`  --${name}: oklch(${l} ${c} ${h}); /* ${hex} */`);
  }

  lines.push("}", "");
  return lines.join("\n");
}

/** The same values as data, for anything that would rather not parse CSS. */
function paletteJson(): string {
  return JSON.stringify(
    {
      generated: new Date().toISOString(),
      space: "oklch",
      note: "L is 0–1, C is chroma, h is degrees. `hex` is the clipped sRGB equivalent.",
      tokens: Object.fromEntries(
        Object.entries(OKLCH_TOKENS).map(([name, [l, c, h]]) => [
          name,
          { oklch: { l, c, h }, hex: HEX[name as TokenName], css: `oklch(${l} ${c} ${h})` },
        ]),
      ),
    },
    null,
    2,
  );
}

function readme(fonts: FontEntry[], counts: Record<string, number>): string {
  const families = [...new Set(fonts.map((f) => f.family))];
  return [
    "harystyles — brand kit",
    "======================",
    "",
    `Assembled ${new Date().toLocaleString()}.`,
    "",
    "What's in here",
    "--------------",
    `  tokens.css     Every colour token, in OKLCH with an sRGB hex beside it.`,
    `  palette.json   The same values as data, for tooling that won't parse CSS.`,
    `  fonts/         ${counts.fonts} files — ${families.join(", ")}.`,
    `                 .woff2 for the web, .ttf for design tools and print.`,
    `  logo/          ${counts.logo} files — wordmark, lockups, marks, app icons.`,
    `  favicon/       ${counts.favicon} files — the full favicon set plus the web manifest.`,
    "",
    "Using the type",
    "--------------",
    "  Display and editorial headings   Fraunces",
    "  Long-form reading                Fraunces Text",
    "  Interface, labels, buttons       Inter Tight",
    "  Numbers, code, metadata          JetBrains Mono",
    "The Noto faces are fallbacks for symbols and emoji; they are not brand type.",
    "",
    "Licence",
    "-------",
    "The fonts are licensed under the SIL Open Font License 1.1 and are NOT ours",
    "to relicense. fonts/LICENSE.txt names each family and where it came from, and",
    "travels with them: under the OFL you may use, embed and modify these files,",
    "including commercially, but you may not sell them on their own, and anything",
    "derived from them stays under OFL. The full licence text is at",
    "https://openfontlicense.org.",
    "",
    "The logo, wordmark and app icons are harystyles trade dress. Use them to",
    "refer to harystyles — don't restyle them, recolour them outside the palette,",
    "or use them as your own mark. The colour tokens are yours to reference freely.",
    "",
  ].join("\n");
}

export type BrandKitResult = { ok: true; files: number; bytes: number } | { ok: false; message: string };

/**
 * Builds the zip in memory and saves it.
 *
 * No streaming here, unlike batch.ts: the whole kit is a few megabytes of files
 * that already exist on disk, so the complexity of the File System Access path
 * would buy nothing.
 */
export async function downloadBrandKit(base = ""): Promise<BrandKitResult> {
  try {
    const entries: ZipEntry[] = [];
    const now = new Date();
    const add = (name: string, input: Uint8Array | string) =>
      entries.push({ name, input, lastModified: now });

    const manifestRes = await fetch(`${base}/assets/fonts/manifest.json`);
    if (!manifestRes.ok) throw new Error("Font manifest is missing.");
    const fonts = (await manifestRes.json()) as FontEntry[];

    // Both formats of every face, fetched in parallel — they are static files
    // on the same origin, so the browser's own connection pool paces this.
    const fontUrls = [...new Set(fonts.flatMap((f) => [f.woff2, f.ttf]))];
    const fontFiles = await Promise.all(
      fontUrls.map(async (url) => ({ url, bytes: await fetchBytes(`${base}${url}`) })),
    );
    for (const file of fontFiles) {
      if (file.bytes) add(`fonts/${file.url.slice(file.url.lastIndexOf("/") + 1)}`, file.bytes);
    }

    const licence = await fetchBytes(`${base}/assets/fonts/LICENSE.txt`);
    if (licence) add("fonts/LICENSE.txt", licence);
    add("fonts/manifest.json", JSON.stringify(fonts, null, 2));

    const logo = await Promise.all(
      LOGO_FILES.map(async (name) => ({ name, bytes: await fetchBytes(`${base}/assets/logo/${name}`) })),
    );
    for (const file of logo) if (file.bytes) add(`logo/${file.name}`, file.bytes);

    const favicon = await Promise.all(
      FAVICON_FILES.map(async (name) => ({
        name,
        bytes: await fetchBytes(`${base}/assets/favicon/${name}`),
      })),
    );
    for (const file of favicon) if (file.bytes) add(`favicon/${file.name}`, file.bytes);

    add("tokens.css", tokensCss());
    add("palette.json", paletteJson());
    add(
      "README.txt",
      readme(fonts, {
        // Counted from what landed, not from what was asked for.
        fonts: entries.filter((e) => e.name.startsWith("fonts/")).length,
        logo: entries.filter((e) => e.name.startsWith("logo/")).length,
        favicon: entries.filter((e) => e.name.startsWith("favicon/")).length,
      }),
    );

    const blob = await downloadZip(entries).blob();
    saveBlob(blob, "harystyles-brand-kit.zip");
    return { ok: true, files: entries.length, bytes: blob.size };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}
