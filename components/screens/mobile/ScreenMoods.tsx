"use client";

import { useState } from "react";
import { Btn, Icon, TabBar } from "@/components/ui";
import { MOODS, type Mood } from "@/lib/fixtures";
import { StatusFiller } from "./StatusFiller";

/** Discovery by feeling. Six moods, one selected, no topic tags anywhere. */
export function ScreenMoods({ onSelect }: { onSelect?: () => void }) {
  const [selected, setSelected] = useState<Mood>("melancholy");
  return (
    <div style={{ background: "var(--bg)", minHeight: "100%", paddingBottom: 100 }}>
      <StatusFiller />
      <header style={{ padding: "20px 24px 28px" }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          READ BY FEELING
        </div>
        <h1 className="title-display" style={{ margin: 0, fontSize: 36, lineHeight: 1.05 }}>
          How are you,
          <br />
          <span className="italic-display">tonight?</span>
        </h1>
      </header>

      <div style={{ padding: "0 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MOODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelected(m.id)}
              style={{
                padding: "18px 20px",
                background:
                  selected === m.id
                    ? `color-mix(in oklch, ${m.color} 14%, var(--bg-card))`
                    : "var(--bg-card)",
                border: `1px solid ${selected === m.id ? m.color : "var(--border-soft)"}`,
                borderRadius: "var(--r-lg)",
                display: "flex",
                alignItems: "center",
                gap: 16,
                cursor: "pointer",
                textAlign: "left",
                transition: "all var(--dur-2) var(--ease-out)",
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  background: m.color,
                  opacity: selected === m.id ? 1 : 0.55,
                  boxShadow: selected === m.id ? `0 0 24px ${m.color}` : "none",
                  transition: "all var(--dur-2) var(--ease-out)",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div className="title-sm" style={{ color: selected === m.id ? m.color : "var(--fg)" }}>
                  {m.label}
                </div>
                <div className="caption" style={{ marginTop: 2 }}>
                  {m.descriptor}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 28 }}>
          <Btn variant="primary" size="lg" full iconRight={<Icon.arrowRight />} onClick={onSelect}>
            Read for {MOODS.find((m) => m.id === selected)?.label.toLowerCase()}
          </Btn>
          {/*
            Copy correction: the source caption said "Seven pieces, hand-picked."
            The ration is five everywhere else in the product, and the brand
            voice says "letters", not "pieces". Corrected on both counts.
          */}
          <p className="caption" style={{ textAlign: "center", marginTop: 14 }}>
            Five letters, hand-picked. No infinite list.
          </p>
        </div>
      </div>

      <TabBar active="discover" />
    </div>
  );
}
