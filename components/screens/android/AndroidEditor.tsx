import { Btn, Icon } from "@/components/ui";
import { AndroidNavBar } from "./AndroidNavBar";
import { AndroidStatusBar } from "./AndroidStatusBar";

/**
 * The writing surface.
 *
 * Both fields are uncontrolled `defaultValue` inputs, exactly as the source had
 * them — putting React state behind the caret makes it jump on every keystroke,
 * and the point of this screen is that typing feels like paper.
 */
export function AndroidEditor() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100%", paddingBottom: 28 }}>
      <AndroidStatusBar />
      <header
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <button
          type="button"
          aria-label="Close"
          style={{ background: "none", border: 0, color: "var(--fg)" }}
        >
          <Icon.close />
        </button>
        <span className="mono" style={{ fontSize: 9 }}>
          DRAFT · SAVED 2 MIN AGO
        </span>
        <Btn size="sm" variant="primary">
          Publish
        </Btn>
      </header>
      <div style={{ padding: 20 }}>
        <input
          placeholder="Title"
          defaultValue="On the small grief of leaving a city"
          style={{
            width: "100%",
            border: 0,
            background: "transparent",
            color: "var(--fg-strong)",
            fontFamily: "var(--font-display)",
            fontSize: 28,
            lineHeight: 1.1,
            fontVariationSettings: '"opsz" 144, "SOFT" 50',
            outline: "none",
            padding: 0,
            marginBottom: 12,
          }}
        />
        <input
          placeholder="Subtitle, optional"
          defaultValue="A small inventory of what was left behind."
          style={{
            width: "100%",
            border: 0,
            background: "transparent",
            color: "var(--fg-muted)",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 17,
            lineHeight: 1.4,
            outline: "none",
            padding: 0,
            marginBottom: 24,
          }}
        />
        <div className="body-reading" style={{ fontSize: 17 }}>
          I packed the kettle last. It seemed important — the last warm thing in the apartment that
          had ever held me.
          {/* The caret. `blink` lives in app/globals.css. */}
          <span
            style={{
              display: "inline-block",
              width: 1,
              height: 18,
              background: "var(--accent)",
              verticalAlign: "middle",
              marginLeft: 2,
              animation: "blink 1s infinite",
            }}
          />
        </div>
      </div>
      {/* Toolbar */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: 0,
          right: 0,
          padding: "12px 16px",
          background: "var(--bg-raised)",
          borderTop: "1px solid var(--border-soft)",
          display: "flex",
          gap: 14,
          alignItems: "center",
          color: "var(--fg-muted)",
        }}
      >
        {["B", "I", "“"].map((s) => (
          <button
            key={s}
            type="button"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "transparent",
              border: 0,
              color: "var(--fg)",
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            {s}
          </button>
        ))}
        <span style={{ width: 1, height: 24, background: "var(--border)" }} />
        <button
          type="button"
          aria-label="Highlight"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "transparent",
            border: 0,
            color: "var(--fg)",
          }}
        >
          <Icon.highlight />
        </button>
        <button
          type="button"
          aria-label="Insert"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "transparent",
            border: 0,
            color: "var(--fg)",
          }}
        >
          <Icon.plus />
        </button>
        <span className="mono" style={{ marginLeft: "auto" }}>
          412 / ∞
        </span>
      </div>
      <AndroidNavBar />
    </div>
  );
}
