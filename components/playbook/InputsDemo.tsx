"use client";

import { useState } from "react";
import styles from "@/app/playbook/components/components.module.css";

/**
 * Only the inputs and the toggle hold state, so the interactivity is isolated
 * here and the catalogue page itself stays a server component.
 */
export function InputsDemo() {
  const [input, setInput] = useState("");
  const [toggle, setToggle] = useState(true);

  return (
    <div className={styles.inputGrid}>
      <label style={{ display: "block" }}>
        <div className="caption" style={{ marginBottom: 8 }}>Email</div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="you@somewhere.coast"
          className={styles.input}
        />
      </label>

      <label style={{ display: "block" }}>
        <div className="caption" style={{ marginBottom: 8 }}>
          Pen name <span style={{ color: "var(--fg-faint)" }}>(optional)</span>
        </div>
        <input placeholder="Ines Marlowe" className={`${styles.input} ${styles.inputFocus}`} />
      </label>

      <label className={styles.inputFull} style={{ display: "block" }}>
        <div className="caption" style={{ marginBottom: 8 }}>About you</div>
        <textarea
          rows={3}
          placeholder="A line. A line break. A second line."
          className={styles.textarea}
        />
      </label>

      <label className={`${styles.inputFull} ${styles.toggleRow}`}>
        <button
          type="button"
          role="switch"
          aria-checked={toggle}
          aria-label="Open patron-only letters by default"
          onClick={() => setToggle(!toggle)}
          className={styles.toggle}
          style={{
            background: toggle ? "var(--accent)" : "var(--bg-elevated)",
            justifyContent: toggle ? "flex-end" : "flex-start",
          }}
        >
          <span
            className={styles.toggleKnob}
            style={{ background: toggle ? "var(--ink-1000)" : "var(--fg-muted)" }}
          />
        </button>
        <span className="body-sm" style={{ color: "var(--fg)" }}>
          Open patron-only letters by default
        </span>
      </label>
    </div>
  );
}
