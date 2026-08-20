"use client";

import { useState } from "react";
import { ArticleCard, Avatar, Btn, Icon, TabBar } from "@/components/ui";
import { PIECES } from "@/lib/fixtures";

const NOTEBOOKS = [
  { title: "Letters from a leaving city", count: 8, color: "var(--mood-melancholy)" },
  { title: "On loving slowly", count: 12, color: "var(--mood-tender)" },
  { title: "Sleepless April", count: 6, color: "var(--mood-restless)" },
];

const TABS = ["letters", "patrons-only", "about"] as const;

/**
 * A writer's page. Pen name forward, no follower count, no share count — the
 * numbers on it are letters written and years spent, which are not scores.
 *
 * The status bar here is the source's own trimmed variant (no wifi glyph), not
 * StatusFiller — kept as drawn so the profile artboard matches the canvas.
 */
export function ScreenProfile({ onBack, onPatron }: { onBack?: () => void; onPatron?: () => void }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("letters");
  const writerPieces = PIECES.slice(0, 4);
  return (
    <div style={{ background: "var(--bg)", minHeight: "100%", paddingBottom: 100 }}>
      {/* Status bar */}
      <div
        style={{
          height: 52,
          paddingTop: 16,
          paddingLeft: 28,
          paddingRight: 28,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-ui)",
          fontSize: 15,
          fontWeight: 600,
          color: "var(--fg-strong)",
        }}
      >
        <span>9:41</span>
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          <span style={{ display: "flex", gap: 2 }}>
            {[3, 5, 7, 9].map((h) => (
              <span
                key={h}
                style={{ width: 3, height: h, background: "var(--fg-strong)", borderRadius: 1 }}
              />
            ))}
          </span>
          <span
            style={{
              width: 24,
              height: 11,
              border: "1px solid var(--fg-strong)",
              borderRadius: 3,
              padding: 1,
            }}
          >
            <span
              style={{
                display: "block",
                width: "75%",
                height: "100%",
                background: "var(--fg-strong)",
                borderRadius: 1,
              }}
            />
          </span>
        </span>
      </div>
      <div
        style={{ padding: "8px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          style={{ background: "none", border: 0, color: "var(--fg)", cursor: "pointer", padding: 6 }}
        >
          <Icon.back />
        </button>
        <button
          type="button"
          aria-label="More"
          style={{ background: "none", border: 0, color: "var(--fg)", cursor: "pointer", padding: 6 }}
        >
          <Icon.more />
        </button>
      </div>

      {/* Hero — pen name forward, no follower counts */}
      <header style={{ padding: "16px 28px 28px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Avatar name="Ines" hue={25} size={72} />
        </div>
        <h1
          className="title-display"
          style={{ margin: "16px 0 6px", fontSize: 40, lineHeight: 1.05, letterSpacing: "-0.025em" }}
        >
          Ines{" "}
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            Marlowe
          </span>
        </h1>
        <p className="caption" style={{ color: "var(--fg-faint)" }}>
          a pen name · writes from somewhere coastal
        </p>

        <p
          className="body-reading"
          style={{
            marginTop: 18,
            fontSize: 16,
            lineHeight: 1.55,
            maxWidth: "32ch",
            marginInline: "auto",
            color: "var(--fg-muted)",
            fontStyle: "italic",
          }}
        >
          {
            '"I write letters to people I have not met yet. Some of them are leaving. Some of them are staying. All of them are tender."'
          }
        </p>

        <div style={{ marginTop: 22, display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn variant="primary" size="md" icon={<Icon.candle />} onClick={onPatron}>
            Become a patron
          </Btn>
          <Btn variant="outline" size="md">
            Subscribe free
          </Btn>
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            gap: 28,
            paddingTop: 22,
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <div>
            <div className="mono-num" style={{ fontSize: 18, color: "var(--fg)" }}>
              34
            </div>
            <div className="caption" style={{ fontSize: 10 }}>
              LETTERS
            </div>
          </div>
          <div>
            <div className="mono-num" style={{ fontSize: 18, color: "var(--fg)" }}>
              3 yrs
            </div>
            <div className="caption" style={{ fontSize: 10 }}>
              WRITING HERE
            </div>
          </div>
          <div>
            <div className="mono-num" style={{ fontSize: 18, color: "var(--accent)" }}>
              ♡
            </div>
            <div className="caption" style={{ fontSize: 10 }}>
              SMALL CIRCLE
            </div>
          </div>
        </div>
      </header>

      {/* Series — like personal notebooks */}
      <div style={{ padding: "0 24px" }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          NOTEBOOKS
        </div>
        <div className="no-scrollbar" style={{ display: "flex", gap: 12, overflowX: "auto" }}>
          {NOTEBOOKS.map((n) => (
            <div
              key={n.title}
              style={{
                minWidth: 200,
                padding: 18,
                background: "var(--bg-card)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--r-lg)",
                borderLeft: `3px solid ${n.color}`,
              }}
            >
              <div className="mono" style={{ fontSize: 9, color: "var(--fg-faint)", marginBottom: 8 }}>
                {n.count} LETTERS
              </div>
              <div className="title-sm" style={{ fontSize: 16, lineHeight: 1.25 }}>
                {n.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          marginTop: 28,
          padding: "0 24px",
          borderBottom: "1px solid var(--border-soft)",
          display: "flex",
          gap: 24,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: "12px 0",
              background: "none",
              border: 0,
              cursor: "pointer",
              color: tab === t ? "var(--fg)" : "var(--fg-faint)",
              borderBottom: `2px solid ${tab === t ? "var(--accent)" : "transparent"}`,
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              fontWeight: 500,
              textTransform: "capitalize",
              letterSpacing: "0.02em",
            }}
          >
            {t === "patrons-only" ? "Patrons only" : t}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 24px" }}>
        {writerPieces.map((p) => (
          <ArticleCard key={p.id} piece={{ ...p, author: "Ines Marlowe", hue: 25 }} />
        ))}
      </div>

      <TabBar active="me" />
    </div>
  );
}
