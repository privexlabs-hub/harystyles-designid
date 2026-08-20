"use client";

import { useState } from "react";
import styles from "@/app/playbook/components/components.module.css";

const TABS = ["letters", "patrons-only", "about"];

/** The tab strip is the only other stateful specimen on the catalogue page. */
export function TabsDemo() {
  const [tab, setTab] = useState("letters");

  return (
    <div className={styles.tabs}>
      {TABS.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTab(t)}
          className={styles.tab}
          style={{
            color: tab === t ? "var(--fg)" : "var(--fg-faint)",
            borderBottom: `2px solid ${tab === t ? "var(--accent)" : "transparent"}`,
          }}
        >
          {t.replace("-", " ")}
        </button>
      ))}
    </div>
  );
}
