import { Btn, Icon } from "@/components/ui";

/**
 * The long-form editor.
 *
 * The three editable blocks stay uncontrolled — no value, no onChange, just
 * `contentEditable` with `suppressContentEditableWarning`, exactly as the design
 * source had them. Controlling them would make React re-render on every
 * keystroke and fight the caret.
 */
export function WebEditor() {
  return (
    <div style={{ background: "var(--bg)", height: "100%", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button style={{ background: "none", border: 0, color: "var(--fg)" }}>
            <Icon.back />
          </button>
          <span className="mono" style={{ fontSize: 9 }}>
            DRAFT · SAVED 12 SECONDS AGO
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn size="sm" variant="ghost">
            Preview
          </Btn>
          <Btn size="sm" variant="outline">
            Save as patron-only
          </Btn>
          <Btn size="sm" variant="primary">
            Publish letter
          </Btn>
        </div>
      </header>
      <div style={{ flex: 1, overflow: "auto", padding: "60px 24px 100px" }}>
        <div style={{ maxWidth: "62ch", margin: "0 auto" }}>
          <div className="mono" style={{ marginBottom: 20 }}>
            ESSAY · UNDER NOTEBOOK: LETTERS FROM A LEAVING CITY
          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 56,
              lineHeight: 1.05,
              color: "var(--fg-strong)",
              outline: "none",
              marginBottom: 16,
              fontVariationSettings: '"opsz" 144, "SOFT" 50',
              letterSpacing: "-0.025em",
            }}
          >
            On the small grief of leaving a city
          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 22,
              lineHeight: 1.4,
              color: "var(--fg-muted)",
              outline: "none",
              marginBottom: 40,
            }}
          >
            A small inventory of what was left behind, and what came along by mistake.
          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            className="body-reading"
            style={{ fontSize: 19, lineHeight: 1.8, outline: "none" }}
          >
            <p>
              I packed the kettle last. It seemed important — the last warm thing in the apartment that had ever held me.
              The radiator had been broken since November, and for four months I had boiled water just to feel something
              hot in the kitchen.
            </p>
            <p>
              The boxes had agreed-upon names: <em>books</em>, <em>winter</em>, <em>kitchen</em>, <em>misc</em>. The last
              one swelled with the things that did not deserve a category.
            </p>
            <blockquote style={{ margin: "32px 0", padding: "0 24px", borderLeft: "2px solid var(--accent)" }}>
              <p className="pullquote" style={{ margin: 0 }}>
                We do not leave cities, I think. They unfasten from us, slowly, the way a coat slips off a chair.
              </p>
            </blockquote>
            <p style={{ color: "var(--fg-faint)" }}>Continue…</p>
          </div>
        </div>
      </div>
      {/* Floating selection toolbar */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          padding: 8,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 999,
          boxShadow: "var(--shadow-md)",
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        {["B", "I", "“", "—"].map((s) => (
          <button
            key={s}
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              background: "transparent",
              border: 0,
              color: "var(--fg)",
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            {s}
          </button>
        ))}
        <span style={{ width: 1, height: 20, background: "var(--border)" }} />
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "transparent",
            border: 0,
            color: "var(--fg)",
          }}
        >
          <Icon.highlight />
        </button>
        <span style={{ width: 1, height: 20, background: "var(--border)" }} />
        <button
          style={{
            height: 36,
            padding: "0 14px",
            borderRadius: 999,
            background: "var(--accent)",
            color: "var(--ink-1000)",
            border: 0,
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          Add to notebook
        </button>
      </div>
    </div>
  );
}
