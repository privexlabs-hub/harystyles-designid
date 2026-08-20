"""Compresses a TTF to WOFF2 in place-ish (same basename, .woff2 extension).

Used by scripts/fetch-fonts.mjs so the browser and Satori load byte-identical
outlines. Google serves two different files for the same CSS request — a
subsetted *variable* WOFF2 to modern browsers and a static instance as TTF to
legacy ones — and the two do not measure the same, which makes the DOM preview
and the exported PNG break lines differently.
"""

import sys
from fontTools.ttLib import TTFont

src, dest = sys.argv[1], sys.argv[2]
font = TTFont(src)
font.flavor = "woff2"
font.save(dest)
