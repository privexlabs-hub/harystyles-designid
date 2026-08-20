/** The playbook's table of contents. Section numbers match the design canvas. */
export type NavItem = { href: string; num: string; label: string; blurb: string };

export const PLAYBOOK: NavItem[] = [
  { href: "/playbook/brand", num: "01", label: "Brand", blurb: "Voice, lockups, iconography, the words we use — and the ones we don't." },
  { href: "/playbook/type", num: "02", label: "Type", blurb: "Three families. Fraunces for display and reading, Inter Tight for UI, JetBrains Mono for metadata." },
  { href: "/playbook/color", num: "03", label: "Colour", blurb: "An OKLCH ink palette with a single warm amber accent. Mood swatches for discovery only." },
  { href: "/playbook/spacing", num: "04", label: "Spacing", blurb: "Quiet rules for generous, unhurried space — plus radii, shadows and motion." },
  { href: "/playbook/components", num: "05", label: "Components", blurb: "Buttons, cards, badges, inputs, menus, toasts, modals — every piece in isolation." },
];

export const SCREENS: NavItem[] = [
  { href: "/playbook/screens/ios", num: "06", label: "iOS", blurb: "Tonight → Moods → Read → Patron, and the writer's own identity." },
  { href: "/playbook/screens/android", num: "08", label: "Android", blurb: "Material 3 in harystyles tokens. Same tone, different motion." },
  { href: "/playbook/screens/web", num: "09", label: "Web reader", blurb: "The reading experience on desktop, distinct from the writer's studio." },
  { href: "/playbook/screens/studio", num: "10", label: "Studio", blurb: "The writer-side dashboard. No graphs — just letters, patrons and the writing." },
  { href: "/playbook/screens/marketing", num: "11", label: "Marketing", blurb: "The home page — quiet, literary, never shouting." },
];

export const ALL_SECTIONS = [...PLAYBOOK, ...SCREENS];
