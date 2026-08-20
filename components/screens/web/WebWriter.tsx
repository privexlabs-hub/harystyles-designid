import { Avatar, Btn, Icon } from "@/components/ui";
import { ReaderTopNav } from "./ReaderTopNav";

const TABS: { l: string; a?: boolean; lock?: boolean }[] = [
  { l: "Letters", a: true },
  { l: "Notebooks" },
  { l: "Patron-only", a: false, lock: true },
  { l: "About" },
];

const NOTEBOOKS = [
  {
    t: "Letters from a leaving city",
    n: 8,
    c: "var(--mood-melancholy)",
    d: "On Lisbon, on departure, on the small geographies of loss.",
  },
  {
    t: "On loving slowly",
    n: 12,
    c: "var(--mood-tender)",
    d: "Twelve letters about the kind of love that doesn't announce itself.",
  },
  { t: "Sleepless April", n: 6, c: "var(--mood-restless)", d: "Notes from a month of bad sleep and good light." },
];

/**
 * Ines's letters. Two of these titles are hers alone and never appear in
 * PIECES — the writer page carries its own back catalogue.
 */
const LETTERS: { t: string; d: string; min: number; m: string; k: number; prem?: boolean }[] = [
  { t: "On the small grief of leaving a city", d: "Mar 14", min: 7, m: "TENDER", k: 412 },
  { t: "What the river kept", d: "Mar 8", min: 9, m: "STILL", k: 284, prem: true },
  { t: "Loving someone who is leaving", d: "Mar 6", min: 11, m: "TENDER", k: 156 },
  { t: "Letters my mother never sent", d: "Feb 28", min: 8, m: "MELANCHOLY", k: 89 },
  { t: "A morning, a kettle, the cold", d: "Feb 21", min: 5, m: "STILL", k: 62 },
  { t: "I don't know how to end this letter", d: "Feb 14", min: 6, m: "TENDER", k: 348, prem: true },
];

/** The writer's home on the web — Ines Marlowe. */
export function WebWriter() {
  return (
    <div style={{ background: "var(--bg)", height: "100%", display: "flex", flexDirection: "column" }}>
      <ReaderTopNav active="writers" />
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Hero */}
        <section
          style={{
            padding: "60px 40px",
            borderBottom: "1px solid var(--border-soft)",
            background:
              "linear-gradient(180deg, color-mix(in oklch, var(--mood-tender) 8%, var(--bg)), var(--bg))",
          }}
        >
          <div
            style={{
              maxWidth: 1080,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: 32,
              alignItems: "center",
            }}
          >
            <Avatar name="Ines" size={120} hue={25} ring />
            <div>
              <div className="mono" style={{ marginBottom: 10 }}>
                WRITER · LISBON · WRITING SINCE 2023
              </div>
              <h1 className="title-display" style={{ margin: 0, fontSize: 56, lineHeight: 1.0, marginBottom: 12 }}>
                Ines Marlowe
              </h1>
              <p
                className="italic-display"
                style={{
                  fontSize: 22,
                  color: "var(--fg-muted)",
                  margin: 0,
                  marginBottom: 16,
                  maxWidth: "44ch",
                  lineHeight: 1.35,
                }}
              >
                &quot;I write at night, mostly about leaving.&quot;
              </p>
              <div style={{ display: "flex", gap: 24 }}>
                <span className="body-sm">
                  <strong style={{ color: "var(--fg)" }}>34</strong> letters
                </span>
                <span className="body-sm">
                  <strong style={{ color: "var(--fg)" }}>3</strong> notebooks
                </span>
                <span className="body-sm">
                  <strong style={{ color: "var(--fg)" }}>1,204</strong> kept lines
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Btn variant="primary" size="md" icon={<Icon.candle />}>
                Become a patron · $4/mo
              </Btn>
              <Btn variant="outline" size="md">
                Follow for free
              </Btn>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div style={{ borderBottom: "1px solid var(--border-soft)", padding: "0 40px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", gap: 32 }}>
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
                  gap: 6,
                }}
              >
                {tab.lock && <Icon.lock />}
                {tab.l}
              </button>
            ))}
          </div>
        </div>

        {/* Notebooks row */}
        <section style={{ padding: "40px", maxWidth: 1080, margin: "0 auto" }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            NOTEBOOKS — READ AS A SERIES
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
            {NOTEBOOKS.map((nb) => (
              <div
                key={nb.t}
                style={{
                  padding: 22,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-soft)",
                  borderLeft: `3px solid ${nb.c}`,
                  borderRadius: 14,
                  cursor: "pointer",
                }}
              >
                <div className="mono" style={{ fontSize: 9, color: nb.c, marginBottom: 12 }}>
                  NOTEBOOK · {nb.n} LETTERS
                </div>
                <h3 className="title-sm" style={{ margin: 0, marginBottom: 8 }}>
                  {nb.t}
                </h3>
                <p className="body-sm" style={{ margin: 0 }}>
                  {nb.d}
                </p>
              </div>
            ))}
          </div>

          {/* Letters list */}
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            ALL LETTERS · NEWEST FIRST
          </div>
          <div>
            {LETTERS.map((l) => (
              <article
                key={l.t}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto auto",
                  gap: 24,
                  alignItems: "center",
                  padding: "20px 0",
                  borderTop: "1px solid var(--border-soft)",
                  cursor: "pointer",
                }}
              >
                <div>
                  <h3
                    className="title-sm"
                    style={{
                      margin: 0,
                      fontSize: 18,
                      marginBottom: 4,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {l.prem && <Icon.lock style={{ color: "var(--wine-300)" }} />}
                    {l.t}
                  </h3>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span className="mono" style={{ fontSize: 9, color: "var(--fg-faint)" }}>
                      {l.min} MIN
                    </span>
                    <span className="mono" style={{ fontSize: 9, color: "var(--fg-faint)" }}>
                      {l.m}
                    </span>
                  </div>
                </div>
                <span className="mono-num" style={{ fontSize: 13 }}>
                  <span className="title-display" style={{ color: "var(--accent)", marginRight: 4 }}>
                    ❦
                  </span>
                  {l.k}
                </span>
                <span className="caption" style={{ minWidth: 60 }}>
                  {l.d}
                </span>
                <Icon.arrowRight style={{ color: "var(--fg-faint)" }} />
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
