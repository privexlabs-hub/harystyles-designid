import type { ReactNode } from "react";
import styles from "./Misuse.module.css";

export type Distortion =
  | "stretch"
  | "recolour"
  | "shadow"
  | "rotate"
  | "busy"
  | "typeface";

/**
 * A tile that renders the real artwork with a named distortion actually applied,
 * and marks it wrong. Nothing here is a description of a mistake — each tile is
 * the mistake, made once, so it can be recognised later.
 */
export function Misuse({
  distortion,
  title,
  reason,
  children,
}: {
  distortion: Distortion;
  title: string;
  reason: string;
  children: ReactNode;
}) {
  return (
    <figure className={styles.tile}>
      <div className={styles.stage} data-distortion={distortion}>
        <div className={styles.artwork} data-distortion={distortion}>
          {children}
        </div>
        <span className={`mono ${styles.flag}`} aria-label="wrong">
          ✕ wrong
        </span>
      </div>
      <figcaption className={styles.caption}>
        <span className={`mono ${styles.title}`}>{title}</span>
        <span className={`body-sm ${styles.reason}`}>{reason}</span>
      </figcaption>
    </figure>
  );
}
