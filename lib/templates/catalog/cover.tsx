/**
 * Covers and banners — one shape per platform, each with its own crop.
 *
 * These are the least forgiving formats in the system. A LinkedIn cover is a
 * 191px letterbox slit; YouTube channel art is 2560×1440 of which only the
 * centre 1546×423 survives on a television; a podcast cover is looked at in a
 * phone list at 55px. So the copy here is deliberately short — a lockup, a
 * line, sometimes a detail — and anything that would not read at the size the
 * platform actually shows has been left out rather than shrunk.
 */
import { SIZES } from "../sizes";
import { BANNER_KIT, EVENT_KIT, template, type Kit } from "../define";
import type { FieldValues } from "../types";

const cover = (
  id: string,
  name: string,
  blurb: string,
  size: (typeof SIZES)[keyof typeof SIZES],
  kit: Kit,
  defaults: FieldValues,
  variantDefaults?: Parameters<typeof template>[1]["variantDefaults"],
) =>
  template(
    "cover",
    { id: `cover/${id}`, name, blurb, sizes: [size], variantDefaults },
    { ...kit, defaults },
  );

export const COVER_TEMPLATES = [
  cover(
    "x-header",
    "X / Twitter header",
    "1500×500. The avatar covers the lower left, so everything sits right of centre and above the fold.",
    SIZES.xHeader,
    BANNER_KIT,
    {
      eyebrow: "Letters, not posts",
      headline: "Five letters, every evening.",
      detail: "harystyles.com",
    },
    { background: "lamp", corner: "top-right", layout: 0 },
  ),

  cover(
    "linkedin-cover",
    "LinkedIn cover",
    "1128×191 — a letterbox slit. It holds the lockup and four words. Anything more is lost.",
    SIZES.linkedinCover,
    BANNER_KIT,
    {
      eyebrow: "",
      headline: "Letters, not posts.",
      detail: "",
    },
    { corner: "top-right", lockup: "mark", density: "compact", layout: 0 },
  ),

  cover(
    "facebook-cover",
    "Facebook cover",
    "820×312, and the corners are rounded away on a phone. Kept centred for that reason.",
    SIZES.facebookCover,
    BANNER_KIT,
    {
      eyebrow: "Tonight",
      headline: "A quiet place to read.",
      detail: "harystyles.com",
    },
    { background: "grain", layout: 0 },
  ),

  cover(
    "youtube-art",
    "YouTube channel art",
    "2560×1440, but only the centre 1546×423 is visible on every device. Everything lives in that strip; the corners carry nothing.",
    SIZES.youtubeArt,
    BANNER_KIT,
    {
      eyebrow: "harystyles",
      headline: "Writers, read aloud.",
      detail: "New every Thursday evening",
    },
    { background: "lamp", lockup: "none", layout: 0 },
  ),

  cover(
    "twitch-banner",
    "Twitch banner",
    "1200×480, sat under a bright page. Ink and a single warm line.",
    SIZES.twitchBanner,
    BANNER_KIT,
    {
      eyebrow: "Live, most Sundays",
      headline: "Writing, in real time.",
      detail: "harystyles.com/live",
    },
    { background: "gradient", layout: 1 },
  ),

  cover(
    "podcast-cover",
    "Podcast cover",
    "3000×3000, shown at 55px in a phone list. The mark and the name; the rest is for the few who see it large.",
    SIZES.podcastCover,
    BANNER_KIT,
    {
      eyebrow: "",
      headline: "harystyles",
      detail: "Letters, read aloud",
    },
    { background: "lamp", lockup: "none", accent: "amber", layout: 3 },
  ),

  cover(
    "newsletter-header",
    "Newsletter header",
    "1200×400, at the top of the evening letter. Warm, and out of the way of the writing below.",
    SIZES.newsletterHeader,
    BANNER_KIT,
    {
      eyebrow: "Thursday evening",
      headline: "The lamp is lit.",
      detail: "Five letters, hand-picked",
    },
    { background: "lamp", accent: "amber", layout: 0 },
  ),

  cover(
    "og-cover",
    "Website / Open Graph cover",
    "1200×630. The card a shared link becomes, so it says what the place is rather than what the page is.",
    SIZES.og,
    BANNER_KIT,
    {
      eyebrow: "harystyles.com",
      headline: "Five letters, every evening.",
      detail: "Free to read · 90% to the writer",
    },
    { background: "rule", lockup: "tagline", layout: 1 },
  ),

  cover(
    "event-banner",
    "Event banner",
    "1920×1080, for the page an evening is announced on. Enough room to say when.",
    SIZES.eventBanner,
    EVENT_KIT,
    {
      eyebrow: "An evening of letters",
      title: "Reading aloud, together.",
      date: "March 28",
      detail: "20:00 GMT · online · free",
      body: "Six writers read the letter they were most afraid to publish. Come and listen; you need not say anything.",
      footLeft: "harystyles.com/events",
      footRight: "",
    },
    { background: "lamp", accent: "wine", layout: 0 },
  ),

  cover(
    "community-banner",
    "Community banner",
    "1920×480. A wide strip above a room of readers — a name and a line, nothing to click.",
    SIZES.communityBanner,
    BANNER_KIT,
    {
      eyebrow: "Readers and writers",
      headline: "The reading room.",
      detail: "Slow talk about letters",
    },
    { background: "grain", accent: "still", layout: 2 },
  ),
];
