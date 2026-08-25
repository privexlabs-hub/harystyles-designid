/**
 * Document · print pages.
 *
 * The brand's own long-form artefacts, in its own vocabulary: a notebook is a
 * series of letters, and the annual report is a letter to patrons. What is
 * deliberately absent — books with copyright pages, proposals with pricing
 * tables, whitepapers with executive summaries — belongs to a different kind of
 * business than this one.
 *
 * These are the page types. `lib/templates/documents.ts` arranges them into
 * starters.
 */
import { PAGE_KIT, template, type Kit } from "../define";
import { SIZES } from "../sizes";
import type { FieldValues } from "../types";

const doc = (
  id: string,
  name: string,
  blurb: string,
  kit: Kit,
  defaults: FieldValues,
  variantDefaults?: Parameters<typeof template>[1]["variantDefaults"],
) =>
  template(
    "document",
    {
      id: `document/${id}`,
      name,
      blurb,
      // A4 first, with US Letter and a 6×9in book page as alternatives on the
      // same template rather than as separate entries.
      sizes: [SIZES.a4, SIZES.letter, SIZES.book],
      variantDefaults,
    },
    { ...kit, defaults },
  );

export const DOCUMENT_TEMPLATES = [
  doc("cover", "Cover", "The front of a notebook, a letter, or a press kit.", PAGE_KIT, {
    runningHead: "A notebook",
    title: "Letters from a leaving city",
    standfirst: "Eight letters about departure, gathered in the order they were written.",
    body: "",
    byline: "Ines Marlowe",
    folio: "",
  }, { layout: 2, background: "lamp", lockup: "none" }),

  doc("opener", "Opener", "The first page of a letter or a section.", PAGE_KIT, {
    runningHead: "Letters from a leaving city",
    title: "On the small grief of leaving a city",
    standfirst: "A small inventory of what was left behind, and what came along by mistake.",
    body:
      "I packed the kettle last. It seemed important — the last warm thing in the apartment that had ever held me. The radiator had been broken since November, and for four months I had boiled water just to feel something hot in the kitchen, just to make the windows fog.\n\n" +
      "The boxes had agreed-upon names: books, winter, kitchen, misc. The last one swelled with the things that did not deserve a category.",
    byline: "Ines Marlowe",
    folio: "1",
  }, { layout: 1, lockup: "none" }),

  doc("text", "Text page", "A page of the letter, continuing.", PAGE_KIT, {
    runningHead: "Letters from a leaving city",
    title: "",
    standfirst: "",
    body:
      "A single earring whose pair I had been mourning for two years. The receipt from a restaurant where I had been told something I would not let myself forget. A magnet shaped like a fish.\n\n" +
      "We do not leave cities, I think. They unfasten from us, slowly, the way a coat slips off a chair.\n\n" +
      "The grief of leaving a place is not the grief of a person. It does not require permission, or warning, or the dignity of being said aloud. You can pack it into a box marked misc and discover it three years later, in another city, when you reach for a kettle that is not yours.",
    byline: "",
    folio: "2",
  }, { layout: 0, lockup: "none" }),

  doc("colophon", "Colophon", "How the thing was made, and by whom.", PAGE_KIT, {
    runningHead: "Letters from a leaving city",
    title: "A note on this notebook",
    standfirst: "",
    body:
      "Eight letters, written between March and December and posted on the evenings they were finished. Set in Fraunces, with Inter Tight for anything that is not the writing itself.\n\n" +
      "Read first at harystyles.com, where the lamp is lit at sunset. Ninety per cent of what patrons pay goes to the writer.",
    byline: "",
    folio: "❦",
  }, { layout: 3, lockup: "none" }),
];
