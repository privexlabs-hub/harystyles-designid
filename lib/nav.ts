/** The playbook's table of contents. Section numbers match the design canvas. */
export type NavItem = { href: string; num: string; label: string; blurb: string };

export const PLAYBOOK: NavItem[] = [
  { href: "/playbook/brand", num: "01", label: "Brand", blurb: "Positioning, lockups, clear space, iconography — and what not to do with the mark." },
  { href: "/playbook/voice", num: "02", label: "Voice", blurb: "Messaging pillars, headline and CTA patterns, and the words we use — and the ones we don't." },
  { href: "/playbook/type", num: "03", label: "Type", blurb: "Three families. Fraunces for display and reading, Inter Tight for UI, JetBrains Mono for metadata." },
  { href: "/playbook/color", num: "04", label: "Colour", blurb: "An OKLCH ink palette with a single warm amber accent. Mood swatches for discovery only." },
  { href: "/playbook/spacing", num: "05", label: "Spacing", blurb: "Quiet rules for generous, unhurried space — plus radii, shadows and motion." },
  { href: "/playbook/components", num: "06", label: "Components", blurb: "Buttons, cards, badges, inputs, menus, toasts, modals — every piece in isolation." },
];

export const SCREENS: NavItem[] = [
  { href: "/playbook/screens/ios", num: "07", label: "iOS", blurb: "Tonight → Moods → Read → Patron, and the writer's own identity." },
  { href: "/playbook/screens/android", num: "08", label: "Android", blurb: "Material 3 in harystyles tokens. Same tone, different motion." },
  { href: "/playbook/screens/web", num: "09", label: "Web reader", blurb: "The reading experience on desktop, distinct from the writer's studio." },
  { href: "/playbook/screens/studio", num: "10", label: "Studio", blurb: "The writer-side dashboard. No graphs — just letters, patrons and the writing." },
  { href: "/playbook/screens/marketing", num: "11", label: "Marketing", blurb: "The home page — quiet, literary, never shouting." },
];

export const ALL_SECTIONS = [...PLAYBOOK, ...SCREENS];
