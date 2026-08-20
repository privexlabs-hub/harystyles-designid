import Link from "next/link";
import type { ReactNode } from "react";
import { ALL_SECTIONS } from "@/lib/nav";
import styles from "./Page.module.css";

/** The page frame: eyebrow, display title, lede, then sections. */
export function PlaybookPage({
  eyebrow,
  title,
  lede,
  href,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  /** Used to place the prev/next links at the foot of the page. */
  href: string;
  children: ReactNode;
}) {
  const index = ALL_SECTIONS.findIndex((s) => s.href === href);
  const prev = index > 0 ? ALL_SECTIONS[index - 1] : null;
  const next = index >= 0 && index < ALL_SECTIONS.length - 1 ? ALL_SECTIONS[index + 1] : null;

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className={`title-display ${styles.title}`}>{title}</h1>
        <p className={`body-reading ${styles.lede}`}>{lede}</p>
      </header>

      {children}

      {(prev || next) && (
        <nav className={styles.footerNav}>
          {prev && (
            <Link href={prev.href} className={styles.footerLink}>
              <span className="mono">← {prev.num}</span>
              <span className="title-sm">{prev.label}</span>
            </Link>
          )}
          {next && (
            <Link href={next.href} className={styles.footerLink}>
              <span className="mono">{next.num} →</span>
              <span className="title-sm">{next.label}</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}

/** A titled block within a page. */
export function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h2 className={`eyebrow ${styles.sectionTitle}`}>{title}</h2>
      {note && <p className={`body-sm ${styles.sectionNote}`}>{note}</p>}
      {children}
    </section>
  );
}

/** A specimen card with a mono caption. */
export function Sample({
  label,
  children,
  style,
}: {
  label?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className={styles.card} style={style}>
      {label && <div className={`mono ${styles.cardLabel}`}>{label}</div>}
      {children}
    </div>
  );
}

/**
 * An auto-fit grid. `min` is the narrowest a tile may get before the grid wraps —
 * set it from the content, not from a guess at screen size.
 */
export function Grid({
  min = 240,
  gap,
  children,
}: {
  min?: number;
  gap?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={styles.grid}
      style={{ "--min": `${min}px`, ...(gap ? { gap } : {}) } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/** Horizontal scroll container for content that must not shrink. */
export function Rail({ children }: { children: ReactNode }) {
  return <div className={styles.rail}>{children}</div>;
}

export { styles as playbookStyles };
