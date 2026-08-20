import type { ReactNode } from "react";
import styles from "./Frames.module.css";

/** The desktop shell — 1280×820 including 40px of chrome. */
export function BrowserShell({
  children,
  url = "harystyles.com",
}: {
  children: ReactNode;
  url?: string;
}) {
  return (
    <div className={styles.browserShell}>
      <div className={styles.browserChrome}>
        <span className={styles.dots}>
          <span className={styles.dot} style={{ background: "#ff5f57" }} />
          <span className={styles.dot} style={{ background: "#febc2e" }} />
          <span className={styles.dot} style={{ background: "#28c840" }} />
        </span>
        <div className={styles.url}>
          <span style={{ opacity: 0.5 }}>◐&#xFE0E;</span>
          {url}
        </div>
      </div>
      <div className={styles.browserBody}>{children}</div>
    </div>
  );
}

export const BROWSER_SIZE = { w: 1280, h: 820 } as const;
