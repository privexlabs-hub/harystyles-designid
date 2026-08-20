import { ArticleCard, TabBar } from "@/components/ui";
import { PIECES, type Piece } from "@/lib/fixtures";
import { StatusFiller } from "./StatusFiller";

/** The home screen: the evening's five letters, and nothing after them. */
export function ScreenTonight({ onOpen }: { onOpen?: (p: Piece) => void }) {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100%", paddingBottom: 100 }}>
      <StatusFiller />
      {/* Lamp ribbon */}
      <div style={{ padding: "8px 24px 0" }}>
        <div
          className="mono"
          style={{
            fontSize: 10,
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "var(--accent)",
              boxShadow: "var(--shadow-glow)",
            }}
          />
          THE LAMP IS LIT · 9:41 PM
        </div>
      </div>
      <header style={{ padding: "12px 24px 18px" }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          YOUR EVENING · MARCH 14
        </div>
        {/*
          Copy correction: the source said "Five pieces" here and "Five letters"
          on the Android home. "letter" is the word the brand voice page lists
          under words-we-say; "piece/post" sits under words-we-don't. Both
          platforms now say "Five letters".
        */}
        <h1 className="title-display" style={{ margin: 0, fontSize: 40, lineHeight: 1.05 }}>
          Five letters
          <br />
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            for tonight.
          </span>
        </h1>
        <p
          className="body-ui"
          style={{ marginTop: 14, color: "var(--fg-muted)", maxWidth: "32ch" }}
        >
          When you finish them, the app will close. The next ration arrives at sunset tomorrow.
        </p>
      </header>

      <div style={{ padding: "0 24px" }}>
        {PIECES.map((p) => (
          // Only hand down a handler when there is one: a bound closure would
          // otherwise cross the server/client boundary and fail to serialise.
          <ArticleCard key={p.id} piece={p} onOpen={onOpen ? () => onOpen(p) : undefined} />
        ))}
        <div
          style={{
            marginTop: 28,
            padding: "28px 20px",
            textAlign: "center",
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <div className="italic-display title-md" style={{ color: "var(--fg-muted)" }}>
            {"That's all for tonight."}
          </div>
          <p className="caption" style={{ marginTop: 8 }}>
            The lamp will be lit again at sunset.
          </p>
        </div>
      </div>

      <TabBar active="home" />
    </div>
  );
}
