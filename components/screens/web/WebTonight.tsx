import { Avatar, Icon } from "@/components/ui";
import { ReaderTopNav } from "./ReaderTopNav";

/**
 * Tonight, on desktop — the same daily ration of five as on mobile, laid out as
 * one featured letter and a stack of four.
 *
 * Two authors are spelled from PIECES rather than from the web source: it said
 * "Daniyar Ahn" and "Marisol Ortiz" where the shared fixture says "Daniyar Khan"
 * and "Marisol Cruz". The fixture wins — the web copy was the drift.
 */
const SIDE = [
  { t: "A letter to the version of me who stayed", a: "Tomás Vega", m: "TENDER", min: 12, h: 280, prem: true },
  { t: "Notes from a sleepless April", a: "Saoirse Linn", m: "RESTLESS", min: 5, h: 200, prem: false },
  { t: "What the river kept", a: "Daniyar Khan", m: "STILL", min: 9, h: 160, prem: true },
  { t: "A morning, a kettle, the cold", a: "Marisol Cruz", m: "TENDER", min: 6, h: 10, prem: false },
];

const OTHER_MOODS = ["restless", "melancholy", "still", "burning"];

export function WebTonight() {
  return (
    <div style={{ background: "var(--bg)", height: "100%", display: "flex", flexDirection: "column" }}>
      <ReaderTopNav active="tonight" />
      <div style={{ flex: 1, overflow: "auto" }}>
        <section
          style={{
            padding: "60px 40px 40px",
            borderBottom: "1px solid var(--border-soft)",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <div className="mono" style={{ marginBottom: 14, color: "var(--accent)" }}>
            ● TONIGHT, MARCH 14 · FIVE LETTERS
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: 88,
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
              fontVariationSettings: '"opsz" 144, "SOFT" 30',
              color: "var(--fg-strong)",
              fontWeight: 400,
              maxWidth: "16ch",
            }}
          >
            You came home{" "}
            <span
              style={{ fontStyle: "italic", color: "var(--accent)", fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
            >
              a little tender.
            </span>
          </h1>
          <p
            className="body-reading"
            style={{ marginTop: 20, maxWidth: "52ch", color: "var(--fg-muted)", fontSize: 18 }}
          >
            Five letters, picked for the mood you arrived in. Read them in any order. The lamp goes out at midnight.
          </p>
          <div style={{ marginTop: 22, display: "flex", gap: 10, alignItems: "center" }}>
            <span className="mono" style={{ fontSize: 10, color: "var(--fg-faint)" }}>
              NOT TENDER TONIGHT?
            </span>
            {OTHER_MOODS.map((m) => (
              <button
                key={m}
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--fg-muted)",
                  fontFamily: "var(--font-ui)",
                  fontSize: 12,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </section>

        {/* Featured + 4 */}
        <section style={{ padding: "48px 40px 80px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, marginBottom: 48 }}>
            {/* Featured */}
            <article style={{ cursor: "pointer" }}>
              <div
                style={{
                  aspectRatio: "16 / 10",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, var(--mood-tender), var(--wine-700))",
                  position: "relative",
                  overflow: "hidden",
                  marginBottom: 20,
                  border: "1px solid var(--border-soft)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at 30% 70%, transparent, rgba(0,0,0,0.5))",
                  }}
                />
                <span
                  className="mono"
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    background: "rgba(0,0,0,0.4)",
                    padding: "4px 10px",
                    borderRadius: 999,
                    color: "var(--ink-100)",
                    fontSize: 10,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  ● FEATURED · TONIGHT
                </span>
              </div>
              <div className="mono" style={{ fontSize: 9, marginBottom: 10 }}>
                ESSAY · 7 MIN · TENDER
              </div>
              <h2
                className="title-display"
                style={{ margin: 0, marginBottom: 14, fontSize: 44, lineHeight: 1.05, maxWidth: "20ch" }}
              >
                On the small grief of leaving a city
              </h2>
              <p
                className="body-reading"
                style={{ margin: 0, marginBottom: 16, color: "var(--fg-muted)", maxWidth: "50ch", fontSize: 17 }}
              >
                I packed the kettle last. It seemed important — the last warm thing in the apartment that had ever held
                me.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name="Ines" size={28} hue={25} />
                <span className="body-sm" style={{ color: "var(--fg)" }}>
                  Ines Marlowe
                </span>
                <span style={{ color: "var(--fg-faint)" }}>·</span>
                <span className="caption">412 patrons · 1.2k kept lines</span>
              </div>
            </article>

            {/* Side stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {SIDE.map((p) => (
                <article
                  key={p.t}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr",
                    gap: 18,
                    paddingBottom: 22,
                    borderBottom: "1px solid var(--border-soft)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      aspectRatio: "1",
                      borderRadius: 10,
                      background: `linear-gradient(135deg, oklch(0.40 0.08 ${p.h}), oklch(0.20 0.04 ${p.h}))`,
                      border: "1px solid var(--border-soft)",
                      position: "relative",
                    }}
                  >
                    {p.prem && (
                      <span style={{ position: "absolute", top: 6, right: 6, color: "var(--wine-300)" }}>
                        <Icon.lock />
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="title-sm" style={{ margin: 0, marginBottom: 8, fontSize: 19, lineHeight: 1.25 }}>
                      {p.t}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Avatar name={p.a} size={18} hue={p.h} />
                      <span className="caption" style={{ color: "var(--fg)" }}>
                        {p.a}
                      </span>
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
                </article>
              ))}
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              borderTop: "1px solid var(--border-soft)",
              color: "var(--fg-faint)",
            }}
          >
            <div className="title-display" style={{ fontSize: 32, color: "var(--accent)", marginBottom: 10 }}>
              ❦
            </div>
            <p className="body-sm">That&apos;s tonight&apos;s five. The lamp will be lit again at sunset.</p>
            <p className="caption" style={{ marginTop: 10 }}>
              Or browse <a style={{ color: "var(--accent)" }}>everything ever written</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
