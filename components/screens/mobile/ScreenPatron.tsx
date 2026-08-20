import { Btn, Icon } from "@/components/ui";

import { StatusFiller } from "./StatusFiller";

const TIER_LINES = [
  "Every letter Ines writes — including the ones for patrons",
  "One private piece per month, posted to your Letters",
  "A handwritten note on your first month",
  "Annual reply from Ines, if you write one",
];

const GIFTS = ["$3", "$7", "$15", "Other"];

/** Patronage, which is deliberately not a paywall and never called a plan. */
export function ScreenPatron({ onClose }: { onClose?: () => void }) {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100%", paddingBottom: 40, position: "relative" }}>
      <StatusFiller />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: 56,
          right: 18,
          zIndex: 2,
          width: 36,
          height: 36,
          borderRadius: 999,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--fg)",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Icon.close />
      </button>

      <div style={{ padding: "20px 28px 0", textAlign: "center" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 999,
            margin: "20px auto 24px",
            background: "radial-gradient(circle, var(--amber-500) 0%, var(--amber-700) 70%)",
            display: "grid",
            placeItems: "center",
            color: "var(--ink-50)",
            boxShadow: "var(--shadow-glow), 0 0 60px oklch(0.66 0.15 45 / 0.3)",
          }}
        >
          <Icon.candle style={{ width: 28, height: 28 }} />
        </div>
        <div className="eyebrow" style={{ marginBottom: 10, color: "var(--accent)" }}>
          BECOME A PATRON
        </div>
        <h1 className="title-display" style={{ margin: 0, fontSize: 32, lineHeight: 1.1 }}>
          Keep the lamp <span className="italic-display">lit</span>
          <br />
          for Ines Marlowe.
        </h1>
        <p
          className="body-ui"
          style={{ marginTop: 14, color: "var(--fg-muted)", maxWidth: "30ch", marginInline: "auto" }}
        >
          {"Patronage is not a subscription. It is a quiet vote of confidence in someone's voice."}
        </p>
      </div>

      <div style={{ padding: "32px 24px 0" }}>
        {/* Tier card */}
        <div
          style={{
            padding: 24,
            borderRadius: "var(--r-lg)",
            background: "var(--bg-card)",
            border: "1px solid var(--accent)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div className="title-sm">Reader</div>
            <div className="title-md" style={{ color: "var(--accent)" }}>
              $4
              <span className="caption" style={{ color: "var(--fg-faint)" }}>
                {" "}
                /month
              </span>
            </div>
          </div>
          <div className="divider" style={{ margin: "16px 0" }} />
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {TIER_LINES.map((t) => (
              <li key={t} className="body-sm" style={{ display: "flex", gap: 10, color: "var(--fg)" }}>
                <span className="quill" style={{ width: 0 }} />
                <span style={{ flex: 1 }}>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            marginTop: 18,
            padding: 18,
            borderRadius: "var(--r-lg)",
            border: "1px dashed var(--border)",
          }}
        >
          <div className="caption" style={{ color: "var(--fg)" }}>
            One-time gift
          </div>
          <p className="body-sm" style={{ margin: "4px 0 12px" }}>
            Not ready for monthly? Send Ines a one-time tip.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {GIFTS.map((v) => (
              <button
                key={v}
                type="button"
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 999,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--fg)",
                  cursor: "pointer",
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <Btn variant="primary" size="lg" full iconRight={<Icon.arrowRight />}>
            Become a patron · $4/mo
          </Btn>
          <p className="caption" style={{ textAlign: "center", marginTop: 14, fontSize: 11 }}>
            90% goes directly to Ines · cancel any time · no algorithms ever
          </p>
        </div>
      </div>
    </div>
  );
}
