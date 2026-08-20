/**
 * Every artboard size the editor can produce, at the dimensions the platforms
 * actually want.
 *
 * `safe` marks the region that survives the platform's own cropping — YouTube
 * channel art is the notorious one, where only 1546×423 of a 2560×1440 canvas
 * is visible on every device. The editor draws these as guides and excludes
 * them from the export.
 */
export type SafeArea = { w: number; h: number; note: string };

export type Size = {
  id: string;
  label: string;
  w: number;
  h: number;
  safe?: SafeArea;
};

const size = (id: string, label: string, w: number, h: number, safe?: SafeArea): Size => ({
  id,
  label,
  w,
  h,
  safe,
});

export const SIZES = {
  square: size("square", "Square · 1080×1080", 1080, 1080),
  portrait: size("portrait", "Portrait · 1080×1350", 1080, 1350),
  landscape: size("landscape", "Landscape · 1080×566", 1080, 566),
  vertical: size("vertical", "Vertical · 1080×1920", 1080, 1920, {
    w: 1015,
    h: 1350,
    note: "Reels and Stories overlay their own chrome; keep type inside this box.",
  }),
  youtube: size("youtube", "YouTube · 1280×720", 1280, 720),
  wide: size("wide", "Wide · 1600×900", 1600, 900),
  hd: size("hd", "Full HD · 1920×1080", 1920, 1080),
  og: size("og", "Open Graph · 1200×630", 1200, 630),
  avatar: size("avatar", "Avatar · 400×400", 400, 400),
  pinterest: size("pinterest", "Pinterest · 1000×1500", 1000, 1500),

  // Covers and banners — each platform picks its own shape.
  xHeader: size("xHeader", "X header · 1500×500", 1500, 500),
  linkedinCover: size("linkedinCover", "LinkedIn cover · 1128×191", 1128, 191),
  facebookCover: size("facebookCover", "Facebook cover · 820×312", 820, 312),
  youtubeArt: size("youtubeArt", "YouTube channel art · 2560×1440", 2560, 1440, {
    w: 1546,
    h: 423,
    note: "Only this centre strip is visible on every device. Everything else is decoration.",
  }),
  twitchBanner: size("twitchBanner", "Twitch banner · 1200×480", 1200, 480),
  podcastCover: size("podcastCover", "Podcast cover · 3000×3000", 3000, 3000),
  newsletterHeader: size("newsletterHeader", "Newsletter header · 1200×400", 1200, 400),
  eventBanner: size("eventBanner", "Event banner · 1920×1080", 1920, 1080),
  communityBanner: size("communityBanner", "Community banner · 1920×480", 1920, 480),

  // Ads.
  adLandscape: size("adLandscape", "Ad landscape · 1200×628", 1200, 628),

  // Email bodies are a fixed width and a variable height.
  emailHeader: size("emailHeader", "Email header · 600×240", 600, 240),
  emailBlock: size("emailBlock", "Email block · 600×600", 600, 600),
  emailTall: size("emailTall", "Email feature · 600×800", 600, 800),
  emailBanner: size("emailBanner", "Email CTA banner · 600×320", 600, 320),
} as const satisfies Record<string, Size>;

export type SizeId = keyof typeof SIZES;

export const SIZE_LIST = Object.values(SIZES) as Size[];
