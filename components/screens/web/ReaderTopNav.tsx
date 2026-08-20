import { Avatar, HSLogomark, HSWordmark, Icon } from "@/components/ui";

const LINKS = [
  { id: "tonight", label: "Tonight" },
  { id: "moods", label: "Moods" },
  { id: "writers", label: "Writers" },
  { id: "shelf", label: "Your shelf" },
] as const;

export type ReaderNavId = (typeof LINKS)[number]["id"];

/** The reader app's top nav. Shared by Tonight, Moods, Writer and Shelf. */
export function ReaderTopNav({ active = "tonight" }: { active?: ReaderNavId }) {
  return (
    <header
      style={{
        height: 64,
        padding: "0 40px",
        borderBottom: "1px solid var(--border-soft)",
        display: "flex",
        alignItems: "center",
        gap: 32,
        background: "var(--bg)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <HSLogomark size={24} />
        <HSWordmark size={18} />
      </div>
      <nav style={{ display: "flex", gap: 28, marginLeft: 24 }}>
        {LINKS.map((l) => (
          <a
            key={l.id}
            style={{
              color: active === l.id ? "var(--fg)" : "var(--fg-muted)",
              fontFamily: "var(--font-ui)",
              fontSize: 14,
              fontWeight: active === l.id ? 500 : 400,
              textDecoration: "none",
              position: "relative",
              paddingBottom: 2,
              borderBottom: active === l.id ? "1px solid var(--accent)" : "1px solid transparent",
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
        <span
          className="mono"
          style={{ fontSize: 10, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <span
            style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)", boxShadow: "var(--shadow-glow)" }}
          />
          LAMP LIT · 9:41 PM
        </span>
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--fg)",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon.search />
        </button>
        <Avatar name="You" size={32} hue={45} />
      </div>
    </header>
  );
}
