import { Icon } from "@/components/ui";
import { ReaderTopNav } from "./ReaderTopNav";

const TABS: { l: string; a?: boolean; c: string }[] = [
  { l: "Kept lines", a: true, c: "1,204" },
  { l: "Saved letters", a: false, c: "47" },
  { l: "Patrons of", a: false, c: "3" },
];

/**
 * The kept lines. "Daniyar Khan" and "Marisol Cruz" follow PIECES — the web
 * source spelled them "Daniyar Ahn" and "Marisol Ortiz".
 */
const CARDS = [
  {
    q: "We do not leave cities, I think. They unfasten from us, slowly, the way a coat slips off a chair.",
    a: "Ines Marlowe",
    t: "On the small grief of leaving a city",
    c: "var(--mood-tender)",
  },
  {
    q: "I have been collecting goodbyes the way some people collect coins.",
    a: "Tomás Vega",
    t: "A letter to the version of me who stayed",
    c: "var(--mood-melancholy)",
  },
  {
    q: "The river forgets nothing. That is its kindness, and also its cruelty.",
    a: "Daniyar Khan",
    t: "What the river kept",
    c: "var(--mood-still)",
  },
  {
    q: "Some mornings I am only the kettle, and the kettle is enough.",
    a: "Marisol Cruz",
    t: "A morning, a kettle, the cold",
    c: "var(--mood-tender)",
  },
  {
    q: "April was a long room with no door at the end of it.",
    a: "Saoirse Linn",
    t: "Notes from a sleepless April",
    c: "var(--mood-restless)",
  },
  {
    q: "She wrote to her daughter every Sunday for forty years and never sent a single one.",
    a: "Ines Marlowe",
    t: "Letters my mother never sent",
    c: "var(--mood-melancholy)",
  },
];

/** Your shelf — kept lines, saved letters, the writers you support. */
export function WebShelf() {
  return (
    <div style={{ background: "var(--bg)", height: "100%", display: "flex", flexDirection: "column" }}>
      <ReaderTopNav active="shelf" />
      <div style={{ flex: 1, overflow: "auto" }}>
        <section style={{ padding: "60px 40px 32px", maxWidth: 1280, margin: "0 auto" }}>
          <div className="mono" style={{ marginBottom: 14 }}>
            YOUR SHELF · PRIVATE TO YOU
          </div>
          <h1 className="title-display" style={{ margin: 0, fontSize: 64, lineHeight: 1.0, marginBottom: 16 }}>
            The lines that{" "}
            <span className="italic-display" style={{ color: "var(--accent)" }}>
              stayed.
            </span>
          </h1>
          <p className="body-reading" style={{ maxWidth: "52ch", color: "var(--fg-muted)", fontSize: 17 }}>
            Sentences you kept while reading. Letters you saved for later. Patrons of yours. Yours alone — never shown to
            writers, never used to recommend things, never shared.
          </p>
        </section>

        {/* Tabs */}
        <div style={{ borderBottom: "1px solid var(--border-soft)", padding: "0 40px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 32 }}>
            {TABS.map((tab) => (
              <button
                key={tab.l}
                style={{
                  padding: "16px 0",
                  background: "none",
                  border: 0,
                  cursor: "pointer",
                  color: tab.a ? "var(--fg)" : "var(--fg-muted)",
                  borderBottom: `2px solid ${tab.a ? "var(--accent)" : "transparent"}`,
                  fontFamily: "var(--font-ui)",
                  fontSize: 14,
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {tab.l}{" "}
                <span className="mono" style={{ fontSize: 10, color: "var(--fg-faint)" }}>
                  {tab.c}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Kept lines — masonry of quote cards */}
        <section style={{ padding: "40px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {CARDS.map((card) => (
              <div
                key={card.q}
                style={{
                  padding: 28,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-soft)",
                  borderLeft: `3px solid ${card.c}`,
                  borderRadius: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div className="title-display" style={{ fontSize: 22, color: "var(--accent)", lineHeight: 1, opacity: 0.7 }}>
                  ❦
                </div>
                <p className="pullquote" style={{ margin: 0, fontSize: 18, lineHeight: 1.4 }}>
                  &quot;{card.q}&quot;
                </p>
                <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border-soft)" }}>
                  <div className="caption" style={{ fontSize: 11, color: "var(--fg)" }}>
                    — {card.a}
                  </div>
                  <div className="mono" style={{ fontSize: 9, marginTop: 4 }}>
                    {card.t}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: -4 }}>
                  <button
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      color: "var(--fg-muted)",
                      cursor: "pointer",
                    }}
                  >
                    <Icon.share />
                  </button>
                  <button
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      color: "var(--fg-muted)",
                      cursor: "pointer",
                    }}
                  >
                    <Icon.close />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
