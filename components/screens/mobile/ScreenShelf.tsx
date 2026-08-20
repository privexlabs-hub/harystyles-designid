import { ArticleCard, TabBar } from "@/components/ui";
import { PIECES } from "@/lib/fixtures";

const HIGHLIGHTS = [
  {
    quote:
      "We do not leave cities, I think. They unfasten from us, slowly, the way a coat slips off a chair.",
    from: "On the small grief of leaving a city",
    author: "Ines Marlowe",
  },
  {
    quote: "Some people leave to find themselves; some find themselves by refusing to.",
    from: "A letter to the version of me who stayed",
    author: "Tomás Vega",
  },
];

/** What the reader kept: the lines first, the letters second. */
export function ScreenShelf() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100%", paddingBottom: 100 }}>
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
      </div>
      <header style={{ padding: "12px 24px 24px" }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          YOUR SHELF
        </div>
        <h1 className="title-display" style={{ margin: 0, fontSize: 36, lineHeight: 1.05 }}>
          The pieces you
          <br />
          <span className="italic-display">held onto.</span>
        </h1>
      </header>

      <div style={{ padding: "0 24px" }}>
        {/* Highlights */}
        <div className="eyebrow" style={{ marginBottom: 14 }}>
          HIGHLIGHTS · 7 SAVED
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.from}
              style={{
                padding: 18,
                background: "var(--bg-card)",
                borderRadius: "var(--r-lg)",
                borderLeft: "2px solid var(--accent)",
                border: "1px solid var(--border-soft)",
              }}
            >
              <p className="pullquote" style={{ margin: 0, fontSize: 18, lineHeight: 1.3 }}>
                {`"${h.quote}"`}
              </p>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="caption">
                  from <em>{h.from}</em>
                </div>
                <div className="mono" style={{ fontSize: 9 }}>
                  SAVE AS CARD
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="eyebrow" style={{ marginTop: 32, marginBottom: 14 }}>
          KEPT TO READ AGAIN
        </div>
        {PIECES.slice(0, 3).map((p) => (
          <ArticleCard key={p.id} piece={p} />
        ))}
      </div>
      <TabBar active="shelf" />
    </div>
  );
}
