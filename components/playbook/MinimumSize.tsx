import type { ReactNode } from "react";
import styles from "./MinimumSize.module.css";

/**
 * One rung of the minimum-size ladder: a lockup drawn at a stated size, with
 * the measurement labelled and a verdict on whether it holds together.
 *
 * `verdict` only colours the rule and the caption — the artwork is always drawn
 * at its true size, so the reader judges it with their own eyes first.
 */
export function MinimumSize({
  measure,
  verdict,
  note,
  zoom,
  children,
}: {
  /** The measurement, written the way a spec would write it. */
  measure: string;
  verdict: "floor" | "below";
  /** What happens at this size. */
  note: string;
  /** Repeat the artwork magnified, so the detail being lost can be seen. */
  zoom?: number;
  children: ReactNode;
}) {
  const below = verdict === "below";
  return (
    <figure className={styles.figure} data-verdict={verdict}>
      <div className={styles.stage}>
        <span className={styles.actual}>{children}</span>
        {zoom ? (
          <>
            <span className={styles.rule} />
            <span className={styles.zoomed}>
              <span style={{ zoom }}>{children}</span>
              <span className={`mono ${styles.zoomTag}`}>{zoom}×</span>
            </span>
          </>
        ) : null}
      </div>
      <figcaption className={styles.caption}>
        <span className={`mono ${styles.measure}`}>{measure}</span>
        <span className={`mono ${styles.verdict}`}>
          {below ? "below the floor" : "the floor"}
        </span>
        <span className={`body-sm ${styles.note}`}>{note}</span>
      </figcaption>
    </figure>
  );
}
