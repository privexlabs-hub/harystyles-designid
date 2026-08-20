import { Avatar, Btn, Icon } from "@/components/ui";
import { ReaderTopNav } from "./ReaderTopNav";

/**
 * Moods, on desktop. The counts are the web screen's own — they are not in the
 * shared fixture, which carries no per-mood totals.
 */
const MOODS = [
  { l: "Tender", c: "var(--mood-tender)", count: 312 },
  { l: "Restless", c: "var(--mood-restless)", count: 184 },
  { l: "Melancholy", c: "var(--mood-melancholy)", count: 421 },
  { l: "Still", c: "var(--mood-still)", count: 156 },
  { l: "Burning", c: "var(--mood-burning)", count: 98 },
  { l: "Untethered", c: "var(--mood-untethered)", count: 247 },
];

/** "Marisol Cruz" is the PIECES spelling; the web source said "Marisol Ortiz". */
const PICKS = [
  { t: "A small inventory of ordinary love", a: "Ines Marlowe", h: 25 },
  { t: "Letters my mother never sent", a: "Saoirse Linn", h: 200 },
  { t: "On loving someone who is leaving", a: "Tomás Vega", h: 280 },
  { t: "The light in the kitchen at 4am", a: "Marisol Cruz", h: 10 },
];

export function WebMoods() {
  return (
    <div style={{ background: "var(--bg)", height: "100%", display: "flex", flexDirection: "column" }}>
      <ReaderTopNav active="moods" />
      <div style={{ flex: 1, overflow: "auto" }}>
        <section style={{ padding: "60px 40px 40px", maxWidth: 1280, margin: "0 auto" }}>
          <div className="mono" style={{ marginBottom: 14 }}>
            READ BY FEELING — NOT BY TOPIC
          </div>
          <h1 className="title-display" style={{ margin: 0, fontSize: 64, lineHeight: 1.0, marginBottom: 18 }}>
            What did you bring{" "}
            <span className="italic-display" style={{ color: "var(--accent)" }}>
              home tonight?
            </span>
          </h1>
          <p className="body-reading" style={{ maxWidth: "52ch", color: "var(--fg-muted)", fontSize: 18 }}>
            Pick the mood you arrived in. We&apos;ll meet you there. No tags, no trending — just the kind of writing that
            fits the kind of evening you&apos;re having.
          </p>
        </section>

        {/* Mood grid */}
        <section style={{ padding: "20px 40px 40px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {MOODS.map((m) => (
              <button
                key={m.l}
                style={{
                  aspectRatio: "5 / 3",
                  padding: 28,
                  textAlign: "left",
                  background: `color-mix(in oklch, ${m.c} 14%, var(--bg-card))`,
                  border: `1px solid color-mix(in oklch, ${m.c} 40%, var(--border-soft))`,
                  borderRadius: 16,
                  color: "var(--fg)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all var(--dur-2)",
                }}
              >
                <span
                  style={{ width: 14, height: 14, borderRadius: 999, background: m.c, boxShadow: `0 0 24px ${m.c}` }}
                />
                <div>
                  <div className="title-display" style={{ fontSize: 36, lineHeight: 1.0, color: "var(--fg-strong)" }}>
                    {m.l}
                  </div>
                  <div className="mono" style={{ fontSize: 10, marginTop: 8, color: m.c }}>
                    {m.count} LETTERS
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Editorial picks for "Tender" */}
        <section
          style={{
            padding: "60px 40px 80px",
            maxWidth: 1280,
            margin: "0 auto",
            borderTop: "1px solid var(--border-soft)",
            marginTop: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <div className="mono" style={{ marginBottom: 8, color: "var(--mood-tender)" }}>
                ● TENDER · 312 LETTERS
              </div>
              <h2 className="title-display" style={{ margin: 0, fontSize: 36 }}>
                For the kind of evening that{" "}
                <span className="italic-display" style={{ color: "var(--accent)" }}>
                  asks for quiet.
                </span>
              </h2>
            </div>
            <Btn size="sm" variant="ghost" iconRight={<Icon.arrowRight />}>
              See all 312
            </Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
            {PICKS.map((p) => (
              <article
                key={p.t}
                style={{
                  padding: 20,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: 14,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div className="mono" style={{ fontSize: 9 }}>
                  ESSAY · 7 MIN
                </div>
                <h3 className="title-sm" style={{ margin: 0, fontSize: 18, lineHeight: 1.25 }}>
                  {p.t}
                </h3>
                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar name={p.a} size={20} hue={p.h} />
                  <span className="caption">{p.a}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
