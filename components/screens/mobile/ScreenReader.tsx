"use client";

import { useState } from "react";
import { Avatar, Btn, Icon } from "@/components/ui";
import { PIECES, REACTIONS, type Piece } from "@/lib/fixtures";
import { StatusFiller } from "./StatusFiller";

/**
 * Reading a letter.
 *
 * Two things carry the product's argument here: tapping a sentence opens the
 * private reaction bar, and the paywall is a blur that fades into the page
 * rather than a wall that stops it.
 */
export function ScreenReader({
  piece = PIECES[0],
  onBack,
  onPaywall,
}: {
  piece?: Piece;
  onBack?: () => void;
  onPaywall?: () => void;
}) {
  const [highlight, setHighlight] = useState(false);
  return (
    <div style={{ background: "var(--bg)", minHeight: "100%", paddingBottom: 80 }}>
      <StatusFiller />
      {/* Top chrome */}
      <div
        style={{
          padding: "8px 18px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          style={{ background: "none", border: 0, color: "var(--fg)", cursor: "pointer", padding: 6 }}
        >
          <Icon.back />
        </button>
        <div className="mono" style={{ fontSize: 9, color: "var(--fg-faint)" }}>
          {piece.readTime} MIN · MELANCHOLY
        </div>
        <button
          type="button"
          aria-label="More"
          style={{ background: "none", border: 0, color: "var(--fg)", cursor: "pointer", padding: 6 }}
        >
          <Icon.more />
        </button>
      </div>

      {/* Article body */}
      <article style={{ padding: "28px 28px 0" }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>
          ESSAY
        </div>
        <h1
          className="title-display"
          style={{
            margin: 0,
            fontSize: 36,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            fontWeight: 400,
          }}
        >
          {piece.title}
        </h1>
        <p
          className="italic-display"
          style={{ marginTop: 14, fontSize: 18, color: "var(--fg-muted)", fontStyle: "italic" }}
        >
          A small inventory of what was left behind, and what came along by mistake.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 22,
            paddingBottom: 22,
            borderBottom: "1px solid var(--border-soft)",
          }}
        >
          <Avatar name={piece.author} hue={piece.hue} size={36} />
          <div style={{ flex: 1 }}>
            <div className="body-sm" style={{ color: "var(--fg)", fontWeight: 500 }}>
              {piece.author}
            </div>
            <div className="caption">3 letters this month · 412 patrons</div>
          </div>
          <Btn size="sm" variant="outline">
            Follow
          </Btn>
        </div>

        <p className="body-reading dropcap" style={{ marginTop: 28 }}>
          I packed the kettle last. It seemed important — the last warm thing in the apartment that
          had ever held me. The radiator had been broken since November, and for four months I had
          boiled water just to feel something hot in the kitchen, just to make the windows fog.
        </p>
        <p className="body-reading">
          The boxes had agreed-upon names: <em>books</em>, <em>winter</em>, <em>kitchen</em>,{" "}
          <em>misc</em>. The last one swelled with the things that did not deserve a category. A
          single earring whose pair I had been mourning for two years. The receipt from a restaurant
          where I had been told something I would not let myself forget. A magnet shaped like a
          fish.
        </p>

        {/* Pull quote */}
        <blockquote style={{ margin: "32px -8px", padding: "0 24px", borderLeft: "2px solid var(--accent)" }}>
          <p className="pullquote" style={{ margin: 0 }}>
            We do not leave cities, I think. They unfasten from us, slowly, the way a coat slips off
            a chair.
          </p>
        </blockquote>

        <p className="body-reading" style={{ position: "relative" }}>
          <span
            style={{
              background: highlight
                ? "color-mix(in oklch, var(--accent) 28%, transparent)"
                : "transparent",
              transition: "background var(--dur-2)",
              cursor: "pointer",
              padding: "1px 0",
            }}
            onClick={() => setHighlight(!highlight)}
          >
            The grief of leaving a place is not the grief of a person. It does not require
            permission, or warning, or the dignity of being said aloud.
          </span>{" "}
          You can pack it into a box marked <em>misc</em> and discover it three years later, in
          another city, when you reach for a kettle that is not yours.
        </p>

        {/* Sentence reaction toolbar (appears on highlight) */}
        {highlight && (
          <div
            style={{
              margin: "12px 0 24px",
              padding: 10,
              background: "var(--bg-elevated)",
              borderRadius: "var(--r-pill)",
              border: "1px solid var(--border)",
              display: "flex",
              gap: 6,
              alignItems: "center",
              width: "fit-content",
            }}
          >
            {REACTIONS.slice(0, 4).map((r) => (
              <button
                key={r.label}
                type="button"
                aria-label={r.label}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  border: 0,
                  background: "transparent",
                  color: "var(--fg)",
                  fontSize: 16,
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                }}
              >
                {r.glyph}
              </button>
            ))}
            <div style={{ width: 1, height: 20, background: "var(--border)" }} />
            <button
              type="button"
              aria-label="Reply"
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                border: 0,
                background: "transparent",
                color: "var(--fg-muted)",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon.reply />
            </button>
          </div>
        )}

        {/* Soft paywall fade */}
        <div style={{ position: "relative", marginTop: 12 }}>
          <p className="body-reading" style={{ filter: "blur(3px)", opacity: 0.4, userSelect: "none" }}>
            For the rest of this letter, I want to tell you about the morning I came back to find the
            apartment empty — and what it taught me about the shape of belonging.
          </p>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 0%, var(--bg) 80%)",
              pointerEvents: "none",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 32,
            padding: 24,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            textAlign: "center",
          }}
        >
          <Icon.candle style={{ color: "var(--accent)", margin: "0 auto" }} />
          <h3 className="title-sm" style={{ margin: "10px 0 6px" }}>
            Become a patron of Ines.
          </h3>
          <p
            className="body-sm"
            style={{ margin: 0, marginBottom: 16, maxWidth: "32ch", marginInline: "auto" }}
          >
            Read every letter. Receive one private piece each month, written for patrons.
          </p>
          <Btn variant="premium" size="md" onClick={onPaywall} full>
            $4 / month · support Ines
          </Btn>
          <p className="caption" style={{ marginTop: 12, fontSize: 11 }}>
            Cancel any time. 90% goes to the writer.
          </p>
        </div>
      </article>
    </div>
  );
}
