import type { ReactElement } from "react";
import { Btn, HSLogomark, HSWordmark, Icon } from "@/components/ui";

const NAV = ["Read", "Write", "Patrons", "About"];

const FEATURES: { i: ReactElement; t: string; d: string }[] = [
  {
    i: <Icon.candle />,
    t: "A daily ration of five",
    d: "When the lamp is lit, five hand-picked letters appear. When you finish them, the app puts itself away. Sunset to sunset, that's it.",
  },
  {
    i: <Icon.heart />,
    t: "Read by feeling",
    d: "Tender. Restless. Melancholy. Burning. Pick the mood you arrived in, and we'll meet you there. No topic tags, no trending. ",
  },
  {
    i: <Icon.lock />,
    t: "Patronage, not paywall",
    d: "If a writer's voice moves you, become a patron for $4/mo. 90% goes to them. No tiers, no ‘premium’ unlocks. Just gratitude with a balance attached.",
  },
  {
    i: <Icon.bookmark />,
    t: "Keep the lines that stay",
    d: "Highlight a sentence. Save it as a card. Build a private shelf of the lines that hold you. Reactions are between you and the writing.",
  },
  {
    i: <Icon.feather />,
    t: "Write in vellum",
    d: "A reading-quality editor with no formatting menus to fight. Just title, subtitle, body. Drop caps and pull quotes appear when they're earned.",
  },
  {
    i: <Icon.moon />,
    t: "Dark by default",
    d: "Most reading happens at night. Most platforms refuse to admit this. We don't. Toggle to paper if you read by morning light.",
  },
];

const FOOTER: { h: string; items: string[] }[] = [
  { h: "Read", items: ["Tonight", "Moods", "Writers"] },
  { h: "Write", items: ["Begin a letter", "Patrons", "Earnings"] },
  { h: "About", items: ["Manifesto", "Press", "Contact"] },
];

/** The landing page — quiet, literary, never shouting. */
export function WebMarketing() {
  return (
    <div style={{ background: "var(--bg)", height: "100%", overflow: "auto" }}>
      {/* Nav */}
      <header
        style={{ padding: "20px 60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <HSLogomark size={28} />
          <HSWordmark size={22} />
        </div>
        <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {NAV.map((l) => (
            <a key={l} className="body-sm" style={{ color: "var(--fg)", textDecoration: "none" }}>
              {l}
            </a>
          ))}
          <Btn size="sm" variant="outline">
            Sign in
          </Btn>
          <Btn size="sm" variant="primary">
            Begin
          </Btn>
        </nav>
      </header>

      {/* Hero */}
      <section style={{ padding: "100px 60px 80px", textAlign: "center" }}>
        <div
          className="mono"
          style={{
            color: "var(--accent)",
            marginBottom: 18,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)", boxShadow: "var(--shadow-glow)" }}
          />
          A QUIETER PLACE TO READ AND WRITE
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: 120,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            fontVariationSettings: '"opsz" 144, "SOFT" 30',
            color: "var(--fg-strong)",
            fontWeight: 400,
          }}
        >
          Letters,
          <br />
          <span
            style={{ fontStyle: "italic", color: "var(--accent)", fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
          >
            not posts.
          </span>
        </h1>
        <p
          className="body-reading"
          style={{ margin: "32px auto 0", maxWidth: "52ch", fontSize: 19, color: "var(--fg-muted)" }}
        >
          Five letters every evening, hand-picked for the kind of mood you brought home. No infinite feed. No algorithm.
          No likes. Read by lamplight, support the writer if a piece moves you, and let the lamp go out at midnight.
        </p>
        <div style={{ marginTop: 40, display: "flex", gap: 14, justifyContent: "center" }}>
          <Btn size="lg" variant="primary" icon={<Icon.candle />}>
            Begin reading tonight
          </Btn>
          <Btn size="lg" variant="outline" icon={<Icon.feather />}>
            Write a letter
          </Btn>
        </div>
        <p className="caption" style={{ marginTop: 18, fontSize: 12 }}>
          Free to read. $4/mo to support a writer. Cancel any time.
        </p>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 60px", borderTop: "1px solid var(--border-soft)" }}>
        <div className="eyebrow" style={{ textAlign: "center", marginBottom: 14 }}>
          HOW IT FEELS
        </div>
        <h2
          className="title-display"
          style={{ textAlign: "center", margin: "0 auto 60px", fontSize: 48, lineHeight: 1.05, maxWidth: "20ch" }}
        >
          Built for the way you actually{" "}
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            want to read.
          </span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {FEATURES.map((c) => (
            <div
              key={c.t}
              style={{
                padding: 28,
                background: "var(--bg-card)",
                border: "1px solid var(--border-soft)",
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 16,
                }}
              >
                {c.i}
              </div>
              <h3 className="title-md" style={{ margin: 0, marginBottom: 8 }}>
                {c.t}
              </h3>
              <p className="body-sm" style={{ margin: 0 }}>
                {c.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote / social proof — but quiet */}
      <section style={{ padding: "100px 60px", textAlign: "center", borderTop: "1px solid var(--border-soft)" }}>
        <div className="title-display" style={{ fontSize: 36, color: "var(--accent)", marginBottom: 24 }}>
          ❦
        </div>
        <p className="pullquote" style={{ margin: "0 auto", fontSize: 36, lineHeight: 1.25, maxWidth: "26ch" }}>
          &quot;It&apos;s the only place online I read slowly anymore.&quot;
        </p>
        <p className="caption" style={{ marginTop: 24, fontSize: 12 }}>
          — Saoirse L., reader · 2 years
        </p>
      </section>

      {/* Pricing */}
      <section style={{ padding: "100px 60px", borderTop: "1px solid var(--border-soft)" }}>
        <div className="eyebrow" style={{ textAlign: "center", marginBottom: 14 }}>
          NO PLANS, JUST PEOPLE
        </div>
        <h2
          className="title-display"
          style={{ textAlign: "center", margin: "0 auto 60px", fontSize: 48, maxWidth: "26ch", lineHeight: 1.05 }}
        >
          You read for free.{" "}
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            You support writers, one at a time.
          </span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 880, margin: "0 auto" }}>
          <div
            style={{
              padding: 36,
              background: "var(--bg-card)",
              border: "1px solid var(--border-soft)",
              borderRadius: 18,
            }}
          >
            <div className="title-md" style={{ marginBottom: 6 }}>
              Reading
            </div>
            <div className="title-display" style={{ fontSize: 56, lineHeight: 1, color: "var(--fg-strong)" }}>
              Free
            </div>
            <p className="body-sm" style={{ marginTop: 14 }}>
              Five letters every evening. Mood-based discovery. Your shelf, your kept lines, your reactions. Always.
            </p>
            <Btn size="md" variant="outline" full style={{ marginTop: 24 }}>
              Begin reading
            </Btn>
          </div>
          <div
            style={{
              padding: 36,
              background: "var(--bg-card)",
              border: "1px solid var(--accent)",
              borderRadius: 18,
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <div className="title-md" style={{ marginBottom: 6 }}>
              Patron <span style={{ color: "var(--accent)" }}>·</span> per writer
            </div>
            <div className="title-display" style={{ fontSize: 56, lineHeight: 1, color: "var(--fg-strong)" }}>
              $4<span style={{ fontSize: 22, color: "var(--fg-faint)" }}>/mo</span>
            </div>
            <p className="body-sm" style={{ marginTop: 14 }}>
              Become a patron of one writer at a time. Read every letter, including patron-only pieces. 90% goes directly
              to them.
            </p>
            <Btn size="md" variant="primary" full style={{ marginTop: 24 }}>
              Find a writer
            </Btn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "60px",
          borderTop: "1px solid var(--border-soft)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <HSLogomark size={24} />
            <HSWordmark size={18} />
          </div>
          <p className="caption" style={{ maxWidth: "32ch" }}>
            A quieter place to read and write. The lamp will be lit again at sunset.
          </p>
        </div>
        <div style={{ display: "flex", gap: 40 }}>
          {FOOTER.map((col) => (
            <div key={col.h}>
              <div className="mono" style={{ fontSize: 9, marginBottom: 12 }}>
                {col.h.toUpperCase()}
              </div>
              {col.items.map((i) => (
                <div key={i} className="body-sm" style={{ marginBottom: 6 }}>
                  {i}
                </div>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
