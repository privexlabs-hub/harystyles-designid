/**
 * Avatar · 400×400 — the mark, in every colourway.
 *
 * An avatar is seen at 32px far more often than at 400, so there is nothing to
 * write here: the whole design is a colour decision. These eight are named by
 * colour because that is how they are asked for — "the ink one", "the white
 * one" — and each is realised through the variation axes rather than by drawing
 * anything new.
 */
import { HEX } from "@/lib/color";
import { SIZES } from "../sizes";
import { AVATAR_KIT, template, type Kit } from "../define";
import type { FieldValues } from "../types";

const avatar = (
  id: string,
  name: string,
  blurb: string,
  kit: Kit,
  defaults: FieldValues,
  variantDefaults?: Parameters<typeof template>[1]["variantDefaults"],
) =>
  template(
    "avatar",
    { id: `avatar/${id}`, name, blurb, sizes: [SIZES.avatar], variantDefaults },
    { ...kit, defaults },
  );

export const AVATAR_TEMPLATES = [
  avatar(
    "indigo",
    "Avatar · Indigo",
    "The default. Indigo mark on ink, which is how the profile reads everywhere.",
    AVATAR_KIT,
    { markColor: "", discColor: "" },
    { theme: "ink", accent: "indigo", layout: 0 },
  ),

  avatar(
    "ink",
    "Avatar · Ink",
    "Stealth. The mark barely above its own background, for places the brand should not announce itself.",
    AVATAR_KIT,
    { markColor: HEX["ink-600"], discColor: "" },
    { theme: "ink", accent: "indigo", layout: 0 },
  ),

  avatar(
    "white",
    "Avatar · White",
    "For light surfaces — a directory, a press page, anywhere the page underneath is paper.",
    AVATAR_KIT,
    { markColor: HEX["ink-1000"], discColor: "" },
    { theme: "paper", accent: "indigo", layout: 0 },
  ),

  avatar(
    "radial",
    "Avatar · Radial",
    "The campaign one. The lamp is lit behind the mark; use it while a season is running, then put it away.",
    AVATAR_KIT,
    { markColor: "", discColor: "" },
    { theme: "ink", accent: "amber", background: "lamp", layout: 0 },
  ),

  avatar(
    "monochrome",
    "Avatar · Monochrome",
    "One colour, no accent. For print, embroidery and anything that will be reproduced badly.",
    AVATAR_KIT,
    { markColor: HEX["ink-50"], discColor: "" },
    { theme: "ink", accent: "indigo", layout: 1 },
  ),

  avatar(
    "inverted",
    "Avatar · Inverted",
    "Ink mark on a pale disc — the reverse of the default, for dark headers and dark app rows.",
    AVATAR_KIT,
    { markColor: HEX["ink-1000"], discColor: HEX["ink-50"] },
    { theme: "ink", accent: "indigo", layout: 3 },
  ),

  avatar(
    "symbol",
    "Avatar · Symbol / mark",
    "The mark held inside its hairline stamp. The formal one, for a masthead or a footer credit.",
    AVATAR_KIT,
    { markColor: "", discColor: "" },
    { theme: "paper", accent: "wine", layout: 1 },
  ),

  avatar(
    "photo",
    "Avatar · Photo / founder",
    "The disc arrangement, sized and cropped for a face. Drop the photograph in through the editor's image field; until then it carries the mark.",
    AVATAR_KIT,
    { markColor: HEX["ink-1000"], discColor: HEX["amber-200"] },
    { theme: "ink", accent: "amber", layout: 3 },
  ),
];
