import type { ReactNode } from "react";
import styles from "./ClearSpace.module.css";

/**
 * The clear-space diagram. One rule, drawn rather than described: the exclusion
 * zone on every side equals `unit` — the height of the mark's stem.
 *
 * Parameterised so the same drawing serves the mark alone and the horizontal
 * lockup; only `unit` and the artwork change.
 */
export function ClearSpace({
  unit,
  label,
  caption,
  children,
}: {
  /** The exclusion measure in px — one stem height. */
  unit: number;
  /** Mono caption naming the artwork. */
  label: string;
  /** Sentence naming the measurement in words. */
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className={styles.figure}>
      <div className={styles.frame} style={{ padding: unit }}>
        <div className={styles.artwork}>{children}</div>

        {/* The measure, drawn once on the top edge and once on the left. */}
        <span className={styles.tickTop} style={{ height: unit }}>
          <span className={`mono ${styles.tickLabel}`}>x</span>
        </span>
        <span className={styles.tickLeft} style={{ width: unit }}>
          <span className={`mono ${styles.tickLabel}`}>x</span>
        </span>
      </div>

      <figcaption className={styles.caption}>
        <span className={`mono ${styles.captionLabel}`}>{label}</span>
        <span className={`body-sm ${styles.captionText}`}>{caption}</span>
        <span className={styles.key}>
          <span className={styles.keyBar} style={{ height: unit }} />
          <span className={`mono ${styles.keyText}`}>x = {unit}px · stem height</span>
        </span>
      </figcaption>
    </figure>
  );
}
