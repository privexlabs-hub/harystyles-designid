/**
 * YouTube · 1280×720 — thumbnails.
 *
 * A thumbnail is read at about 210px wide, in a column of other thumbnails, by
 * someone who is not yet interested. Two or three words, set enormous, is the
 * whole craft of it; four is the ceiling and anything past that is decoration
 * nobody can read. So almost everything here is the hook kit, which sizes its
 * one line as large as the artboard allows.
 *
 * The kicker and cue carry the rest — the writer's name, the running time, the
 * handle — and they are allowed to be small, because they are read after the
 * click, not before it.
 */
import { SIZES } from "../sizes";
import { BANNER_KIT, HOOK_KIT, STAT_KIT, template, type Kit } from "../define";
import type { FieldValues } from "../types";

const youtube = (
  id: string,
  name: string,
  blurb: string,
  kit: Kit,
  defaults: FieldValues,
  variantDefaults?: Parameters<typeof template>[1]["variantDefaults"],
) =>
  template(
    "youtube",
    { id: `youtube/${id}`, name, blurb, sizes: [SIZES.youtube], variantDefaults },
    { ...kit, defaults },
  );

export const YOUTUBE_TEMPLATES = [
  youtube("tutorial", "Tutorial", "What the viewer will be able to do afterwards. Three words.", HOOK_KIT, {
    kicker: "Tutorial",
    hook: "Keep a line",
    cue: "4 min · harystyles.com",
    index: "",
  }, { layout: 0 }),

  youtube("how-to", "How-to", "The task, named as a task.", HOOK_KIT, {
    kicker: "How to",
    hook: "Start a notebook",
    cue: "6 min",
    index: "",
  }, { background: "grain", layout: 1 }),

  youtube("review", "Review", "The verdict, not the subject.", HOOK_KIT, {
    kicker: "Read together",
    hook: "Worth the night",
    cue: "Ines Marlowe · 11 min",
    index: "",
  }, { background: "rule", layout: 0 }),

  youtube("product", "Product", "The thing itself, named.", HOOK_KIT, {
    kicker: "A look inside",
    hook: "The shelf",
    cue: "Everything you kept",
    index: "",
  }, { background: "lamp", layout: 1 }),

  youtube("feature", "Feature", "One new thing, in two words.", HOOK_KIT, {
    kicker: "New",
    hook: "Notebooks",
    cue: "Letters, in order",
    index: "",
  }, { layout: 3 }),

  youtube("hot-take", "Hot take", "The opinion, stated flat. No shouting, no question mark.", HOOK_KIT, {
    kicker: "An opinion",
    hook: "The feed lost",
    cue: "9 min",
    index: "",
  }, { background: "grain", layout: 3 }),

  youtube("interview", "Interview", "Who it is with, which is the reason to watch.", HOOK_KIT, {
    kicker: "In conversation",
    hook: "Ines Marlowe",
    cue: "On writing at night · 38 min",
    index: "",
  }, { background: "lamp", layout: 0 }),

  youtube("podcast", "Podcast", "The episode's one idea, plus its number.", HOOK_KIT, {
    kicker: "The lamp is lit",
    hook: "Writing badly",
    cue: "Ada and Ines · 52 min",
    index: "Ep. 14",
  }, { layout: 2 }),

  youtube("launch", "Launch", "It is here. Two words, warm ground.", HOOK_KIT, {
    kicker: "Out tonight",
    hook: "Letters in Irish",
    cue: "Eleven writers",
    index: "",
  }, { background: "lamp", layout: 1, accent: "still" }),

  youtube("announcement", "Announcement", "A short line and its date, when the news needs a when.", BANNER_KIT, {
    eyebrow: "28 March",
    headline: "Reading aloud",
    detail: "20:00 GMT · online · free",
  }, { background: "rule", layout: 0 }),

  youtube("case-study", "Case study", "The number is the thumbnail. The words underneath it are small on purpose.", STAT_KIT, {
    eyebrow: "A writer's year",
    figure: "412",
    label: "patrons, from none",
    body: "",
    footLeft: "",
    footRight: "",
  }, { layout: 1 }),

  youtube("list-roundup", "List / roundup", "A count and a noun. The list itself is in the video.", HOOK_KIT, {
    kicker: "Roundup",
    hook: "Five letters",
    cue: "The ones we kept · March",
    index: "",
  }, { background: "grain", layout: 0 }),
];
