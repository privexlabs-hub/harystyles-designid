import { Avatar, Btn, Icon } from "@/components/ui";

/** The full-screen reading view, with the soft-fade patron paywall. */
export function WebReader() {
  return (
    <div style={{ background: "var(--bg)", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Minimal reading nav */}
      <header
        style={{
          height: 56,
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          borderBottom: "1px solid var(--border-soft)",
          background: "var(--bg)",
        }}
      >
        <button style={{ background: "none", border: 0, color: "var(--fg)", cursor: "pointer" }}>
          <Icon.back />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar name="Ines" size={24} hue={25} />
          <span className="body-sm" style={{ color: "var(--fg)", fontWeight: 500 }}>
            Ines Marlowe
          </span>
        </div>
        <div
          style={{
            flex: 1,
            height: 2,
            background: "var(--border-soft)",
            borderRadius: 999,
            position: "relative",
            maxWidth: 200,
            margin: "0 24px",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "42%",
              background: "var(--accent)",
              borderRadius: 999,
            }}
          />
        </div>
        <span className="mono" style={{ fontSize: 9 }}>
          3 MIN LEFT
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--fg)",
              cursor: "pointer",
            }}
          >
            <Icon.bookmark />
          </button>
          <Btn size="sm" variant="primary">
            Become a patron
          </Btn>
        </div>
      </header>

      {/* Article */}
      <div style={{ flex: 1, overflow: "auto", padding: "80px 40px" }}>
        <article style={{ maxWidth: "62ch", margin: "0 auto" }}>
          <div className="mono" style={{ marginBottom: 28 }}>
            ESSAY · MARCH 14, 2026 · TENDER · 7 MIN
          </div>
          <h1 className="title-display" style={{ margin: 0, fontSize: 64, lineHeight: 1.0, marginBottom: 24 }}>
            On the small grief
            <br />
            <span className="italic-display" style={{ color: "var(--accent)" }}>
              of leaving a city.
            </span>
          </h1>
          <p
            className="italic-display"
            style={{ fontSize: 22, color: "var(--fg-muted)", marginBottom: 40, lineHeight: 1.4 }}
          >
            A small inventory of what was left behind, and what came along by mistake.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingBottom: 36,
              marginBottom: 36,
              borderBottom: "1px solid var(--border-soft)",
            }}
          >
            <Avatar name="Ines" size={40} hue={25} />
            <div style={{ flex: 1 }}>
              <div className="body-sm" style={{ color: "var(--fg)", fontWeight: 500 }}>
                Ines Marlowe
              </div>
              <div className="caption">412 patrons · writes from Lisbon</div>
            </div>
            <Btn size="sm" variant="outline">
              Follow
            </Btn>
          </div>

          <p className="body-reading dropcap" style={{ fontSize: 19 }}>
            I packed the kettle last. It seemed important — the last warm thing in the apartment that had ever held me.
            The radiator had been broken since November, and for four months I had boiled water just to feel something
            hot in the kitchen.
          </p>
          <p className="body-reading" style={{ fontSize: 19 }}>
            The boxes had agreed-upon names: <em>books</em>, <em>winter</em>, <em>kitchen</em>, <em>misc</em>. The last
            one swelled with the things that did not deserve a category. A single earring whose pair I had been mourning
            for two years. Three matches from a bar that had closed.
          </p>
          <blockquote style={{ margin: "40px 0", padding: "0 28px", borderLeft: "2px solid var(--accent)" }}>
            <p className="pullquote" style={{ margin: 0 }}>
              We do not leave cities, I think. They unfasten from us, slowly, the way a coat slips off a chair.
            </p>
          </blockquote>
          <p className="body-reading" style={{ fontSize: 19 }}>
            The grief of leaving a place is not the grief of a person. It does not require permission, or warning. It
            arrives quietly while you are taping a box, and it asks nothing of you except your attention.
          </p>

          {/* Soft fade paywall */}
          <div style={{ position: "relative", marginTop: 48 }}>
            <p
              className="body-reading"
              style={{
                fontSize: 19,
                color: "var(--fg-muted)",
                maskImage: "linear-gradient(to bottom, black, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
              }}
            >
              On the third morning, I sat on the floor of the empty kitchen and ate a pear. The light came in slowly, the
              way it always had, and I tried to memorize the shape of it…
            </p>
            <div
              style={{
                marginTop: 32,
                padding: 36,
                background: "var(--bg-card)",
                border: "1px solid var(--accent)",
                borderRadius: 18,
                textAlign: "center",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  margin: "0 auto 16px",
                  background: "radial-gradient(circle, var(--amber-500), var(--amber-700))",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--ink-50)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                <Icon.candle />
              </div>
              <div className="title-md" style={{ marginBottom: 8 }}>
                The rest of this letter is for patrons.
              </div>
              <p className="body-sm" style={{ margin: "0 auto 22px", maxWidth: "44ch" }}>
                Become a patron of Ines for $4/mo. Read every letter she&apos;s written, including the ones too tender for
                the open feed. 90% goes to her.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <Btn size="md" variant="primary" icon={<Icon.candle />}>
                  Become Ines&apos;s patron · $4/mo
                </Btn>
                <Btn size="md" variant="ghost">
                  Maybe later
                </Btn>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
