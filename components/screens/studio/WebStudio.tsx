import type { ReactElement } from "react";
import { Avatar, Btn, HSLogomark, HSWordmark, Icon } from "@/components/ui";

const NAV: { l: string; i: ReactElement | null; a?: boolean; t?: string }[] = [
  { l: "Letters", i: <Icon.letter />, a: true },
  { l: "Drafts", i: <Icon.pencil /> },
  { l: "Notebooks", i: <Icon.bookmark /> },
  { l: "Patrons", i: <Icon.heart /> },
  { l: "Earnings", i: null, a: false, t: "$284" },
];

const NOTEBOOKS: { l: string; c: string; n: number }[] = [
  { l: "Letters from a leaving city", c: "var(--mood-melancholy)", n: 8 },
  { l: "On loving slowly", c: "var(--mood-tender)", n: 12 },
  { l: "Sleepless April", c: "var(--mood-restless)", n: 6 },
];

/** Quiet numbers, no graphs — the studio never turns writing into a dashboard. */
const STATS: { l: string; v: string; c: string; h?: string }[] = [
  { l: "PATRONS", v: "412", c: "+18 this month", h: "var(--accent)" },
  { l: "MONTHLY", v: "$1,648", c: "your share, after fees" },
  { l: "READ TONIGHT", v: "284", c: "across 3 letters" },
  { l: "KEPT LINES", v: "1,204", c: "all-time, by readers" },
];

const ROWS = [
  { t: "On the small grief of leaving a city", s: "PUBLIC", k: 412, p: 412, d: "Mar 14" },
  { t: "What the river kept", s: "PATRON", k: 284, p: 284, d: "Mar 8" },
  { t: "Loving someone who is leaving", s: "PUBLIC", k: 156, p: 412, d: "Mar 6" },
  { t: "A morning, a kettle, the cold", s: "DRAFT", k: 0, p: 0, d: "Mar 3" },
  { t: "Letters my mother never sent", s: "PUBLIC", k: 89, p: 412, d: "Feb 28" },
];

const COLUMNS = "1fr 100px 100px 100px 100px";

/** The writer-side dashboard. */
export function WebStudio() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", height: "100%", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{ background: "var(--bg-raised)", borderRight: "1px solid var(--border-soft)", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <HSLogomark size={28} />
          <HSWordmark size={20} />
        </div>
        <div
          style={{
            padding: 12,
            background: "var(--bg-elevated)",
            borderRadius: 10,
            marginBottom: 16,
            border: "1px solid var(--border-soft)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar name="Ines" hue={25} size={28} />
            <div style={{ flex: 1 }}>
              <div className="body-sm" style={{ color: "var(--fg)", fontWeight: 500 }}>
                Ines Marlowe
              </div>
              <div className="caption" style={{ fontSize: 10 }}>
                writing studio
              </div>
            </div>
          </div>
        </div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          STUDIO
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((item) => (
            <button
              key={item.l}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: item.a ? "color-mix(in oklch, var(--accent) 14%, transparent)" : "transparent",
                border: 0,
                cursor: "pointer",
                borderRadius: 8,
                color: item.a ? "var(--accent)" : "var(--fg-muted)",
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                textAlign: "left",
              }}
            >
              {item.i ?? <span style={{ width: 20 }} />}
              <span style={{ flex: 1 }}>{item.l}</span>
              {item.t && (
                <span className="mono" style={{ fontSize: 10, color: "var(--fg)" }}>
                  {item.t}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="eyebrow" style={{ marginTop: 24, marginBottom: 10 }}>
          NOTEBOOKS
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NOTEBOOKS.map((nb) => (
            <button
              key={nb.l}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: "transparent",
                border: 0,
                cursor: "pointer",
                borderRadius: 8,
                color: "var(--fg-muted)",
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                textAlign: "left",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 999, background: nb.c }} />
              <span style={{ flex: 1 }}>{nb.l}</span>
              <span className="mono" style={{ fontSize: 9 }}>
                {nb.n}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ padding: 32, overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <div className="eyebrow">YOUR STUDIO</div>
            <h1 className="title-display" style={{ margin: "6px 0 0", fontSize: 40, lineHeight: 1.1 }}>
              Welcome back,{" "}
              <span className="italic-display" style={{ color: "var(--accent)" }}>
                Ines.
              </span>
            </h1>
            <p className="caption" style={{ marginTop: 6 }}>
              You&apos;ve written 34 letters · 412 patrons read every one.
            </p>
          </div>
          <Btn variant="primary" size="lg" icon={<Icon.feather />}>
            Write a letter
          </Btn>
        </div>

        {/* Stats — quiet, no graphs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          {STATS.map((s) => (
            <div
              key={s.l}
              style={{
                padding: 22,
                background: "var(--bg-card)",
                border: "1px solid var(--border-soft)",
                borderRadius: 14,
              }}
            >
              <div className="mono" style={{ fontSize: 9, color: s.h || "var(--fg-faint)" }}>
                {s.l}
              </div>
              <div className="title-display" style={{ fontSize: 36, lineHeight: 1.1, marginTop: 8 }}>
                {s.v}
              </div>
              <div className="caption" style={{ marginTop: 4 }}>
                {s.c}
              </div>
            </div>
          ))}
        </div>

        {/* Letters table */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-soft)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: COLUMNS,
              padding: "14px 22px",
              borderBottom: "1px solid var(--border-soft)",
            }}
          >
            {["LETTER", "STATUS", "KEPT", "PATRONS", "WRITTEN"].map((h) => (
              <div key={h} className="mono" style={{ fontSize: 9 }}>
                {h}
              </div>
            ))}
          </div>
          {ROWS.map((r) => (
            <div
              key={r.t}
              style={{
                display: "grid",
                gridTemplateColumns: COLUMNS,
                padding: "16px 22px",
                borderTop: "1px solid var(--border-soft)",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {r.s === "DRAFT" ? (
                  <Icon.pencil style={{ color: "var(--fg-faint)" }} />
                ) : r.s === "PATRON" ? (
                  <Icon.lock style={{ color: "var(--wine-300)" }} />
                ) : (
                  <Icon.letter style={{ color: "var(--fg-muted)" }} />
                )}
                <div>
                  <div className="body-sm" style={{ color: "var(--fg)", fontWeight: 500 }}>
                    {r.t}
                  </div>
                </div>
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  color:
                    r.s === "DRAFT" ? "var(--fg-faint)" : r.s === "PATRON" ? "var(--wine-300)" : "var(--fg-muted)",
                }}
              >
                {r.s}
              </div>
              <div className="mono-num" style={{ fontSize: 13, color: "var(--fg)" }}>
                {r.k}
              </div>
              <div className="mono-num" style={{ fontSize: 13, color: "var(--fg)" }}>
                {r.p}
              </div>
              <div className="caption">{r.d}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
