import type { ReactElement } from "react";
import { Avatar, HSLogomark, HSWordmark, Icon } from "@/components/ui";
import { AndroidNavBar } from "./AndroidNavBar";
import { AndroidStatusBar } from "./AndroidStatusBar";

/**
 * The Android feed keeps its own trimmed card list rather than ArticleCard —
 * Material 3 wants elevated surfaces and rounded corners where iOS wants hairline
 * rules, so the same three letters are drawn differently on purpose.
 */
const CARDS = [
  { t: "On the small grief of leaving a city", a: "Ines Marlowe", h: 25, m: "MELANCHOLY", min: 7, prem: false },
  { t: "A letter to the version of me who stayed", a: "Tomás Vega", h: 280, m: "TENDER", min: 12, prem: true },
  { t: "Notes from a sleepless April", a: "Saoirse Linn", h: 200, m: "RESTLESS", min: 5, prem: false },
];

const NAV: { i: ReactElement; l: string; a?: boolean }[] = [
  { i: <Icon.candle />, l: "Tonight", a: true },
  { i: <Icon.search />, l: "Moods" },
  { i: <Icon.letter />, l: "Letters" },
  { i: <Icon.bookmark />, l: "Shelf" },
  { i: <Icon.user />, l: "Me" },
];

export function AndroidHome() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100%", paddingBottom: 28 }}>
      <AndroidStatusBar />
      <header
        style={{
          padding: "16px 20px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <HSLogomark size={24} />
          <HSWordmark size={18} />
        </div>
        <button
          type="button"
          aria-label="Search"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 999,
            width: 36,
            height: 36,
            display: "grid",
            placeItems: "center",
            color: "var(--fg)",
          }}
        >
          <Icon.search />
        </button>
      </header>

      <div style={{ padding: "8px 20px 0" }}>
        <div className="mono" style={{ fontSize: 10, color: "var(--accent)", marginBottom: 6 }}>
          ● THE LAMP IS LIT · 9:41 PM
        </div>
        {/* The iOS Tonight screen said "Five pieces"; this one already said
            "Five letters", which is the word the brand voice page keeps. Both
            now read the same. */}
        <h1 className="title-display" style={{ margin: 0, fontSize: 32, lineHeight: 1.05 }}>
          Five letters
          <br />
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            for tonight.
          </span>
        </h1>
      </div>

      {/* Feed cards — Material 3 elevated */}
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        {CARDS.map((p) => (
          <div
            key={p.t}
            style={{
              padding: 16,
              background: "var(--bg-elevated)",
              borderRadius: 16,
              border: "1px solid var(--border-soft)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Avatar name={p.a} hue={p.h} size={20} />
              <span className="caption" style={{ color: "var(--fg)" }}>
                {p.a}
              </span>
              {p.prem && (
                <span
                  className="mono"
                  style={{
                    marginLeft: "auto",
                    color: "var(--wine-300)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Icon.lock />
                  PATRON
                </span>
              )}
            </div>
            <div className="title-sm" style={{ fontSize: 17, marginBottom: 8 }}>
              {p.t}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <span className="mono" style={{ fontSize: 9, color: "var(--fg-faint)" }}>
                {p.min} MIN
              </span>
              <span className="mono" style={{ fontSize: 9, color: "var(--fg-faint)" }}>
                {p.m}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Material 3 FAB */}
      <button
        type="button"
        aria-label="Write"
        style={{
          // The source put the FAB at 80, which the 64px nav (itself at 28)
          // painted over. Raised to clear the nav by the Material 16dp margin.
          position: "absolute",
          bottom: 108,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 16,
          border: 0,
          background: "var(--accent)",
          color: "var(--ink-1000)",
          boxShadow: "var(--shadow-md), var(--shadow-glow)",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
        }}
      >
        <Icon.feather />
      </button>

      {/* Bottom nav (Material 3) */}
      <nav
        style={{
          position: "absolute",
          bottom: 28,
          left: 0,
          right: 0,
          height: 64,
          background: "var(--bg-raised)",
          borderTop: "1px solid var(--border-soft)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {NAV.map((t) => (
          <button
            key={t.l}
            type="button"
            style={{
              background: "none",
              border: 0,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: t.a ? "var(--accent)" : "var(--fg-faint)",
            }}
          >
            <span
              style={{
                padding: "4px 16px",
                borderRadius: 999,
                background: t.a ? "color-mix(in oklch, var(--accent) 18%, transparent)" : "transparent",
              }}
            >
              {t.i}
            </span>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, letterSpacing: "0.04em" }}>
              {t.l}
            </span>
          </button>
        ))}
      </nav>
      <AndroidNavBar />
    </div>
  );
}
