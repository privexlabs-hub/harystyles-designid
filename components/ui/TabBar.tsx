import { Icon } from "./Icon";

/**
 * The mobile tab bar. Five destinations, no more — there is no notifications
 * tab and no activity feed, because there is nothing to notify about.
 *
 * Positioned absolutely: it belongs to the device screen it sits in, not the page.
 */
const TABS = [
  { id: "home", label: "Tonight", icon: <Icon.candle /> },
  { id: "discover", label: "Moods", icon: <Icon.search /> },
  { id: "letters", label: "Letters", icon: <Icon.letter /> },
  { id: "shelf", label: "Shelf", icon: <Icon.bookmark /> },
  { id: "me", label: "Me", icon: <Icon.user /> },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export function TabBar({
  active = "home",
  onChange,
}: {
  active?: TabId;
  onChange?: (id: TabId) => void;
}) {
  return (
    <nav
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 78,
        paddingBottom: 18,
        background: "color-mix(in oklch, var(--bg) 88%, transparent)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border-soft)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          // Bound only when a handler exists, so the bar can be server-rendered
          // inside a client shell without an unserialisable prop.
          onClick={onChange ? () => onChange(t.id) : undefined}
          style={{
            background: "none",
            border: 0,
            cursor: "pointer",
            color: active === t.id ? "var(--accent)" : "var(--fg-faint)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            fontFamily: "var(--font-ui)",
            fontSize: 10,
            letterSpacing: "0.04em",
            padding: 6,
          }}
        >
          {t.icon}
          <span style={{ textTransform: "uppercase", fontWeight: 500 }}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
