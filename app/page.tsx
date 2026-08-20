import Link from "next/link";
import { Btn, Icon } from "@/components/ui";
import { PLAYBOOK, SCREENS } from "@/lib/nav";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={`mono ${styles.lamp}`}>
          <span className={styles.dot} />
          THE HARYSTYLES DESIGN SYSTEM
        </span>
        <h1 className={`title-hero ${styles.title}`}>
          Letters,
          <br />
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            not posts.
          </span>
        </h1>
        <p className={`body-reading ${styles.lede}`}>
          The brand identity playbook for a patron-supported literary platform — and an editor
          for producing every asset it needs, in the system&rsquo;s own voice.
        </p>
        <div className={styles.actions}>
          <Link href="/playbook/brand">
            <Btn size="lg" variant="primary" icon={<Icon.candle />}>
              Read the playbook
            </Btn>
          </Link>
          <Link href="/editor">
            <Btn size="lg" variant="outline" icon={<Icon.feather />}>
              Open the editor
            </Btn>
          </Link>
        </div>
      </section>

      <h2 className={`eyebrow ${styles.sectionLabel}`}>FOUNDATIONS</h2>
      <div className={styles.grid}>
        {PLAYBOOK.map((s) => (
          <Link key={s.href} href={s.href} className={styles.card}>
            <span className={`mono ${styles.cardNum}`}>{s.num}</span>
            <span className="title-md">{s.label}</span>
            <p className={`body-sm ${styles.cardBlurb}`}>{s.blurb}</p>
          </Link>
        ))}
      </div>

      <h2 className={`eyebrow ${styles.sectionLabel}`}>THE PRODUCT, IN SCREENS</h2>
      <div className={styles.grid}>
        {SCREENS.map((s) => (
          <Link key={s.href} href={s.href} className={styles.card}>
            <span className={`mono ${styles.cardNum}`}>{s.num}</span>
            <span className="title-md">{s.label}</span>
            <p className={`body-sm ${styles.cardBlurb}`}>{s.blurb}</p>
          </Link>
        ))}
      </div>

      <h2 className={`eyebrow ${styles.sectionLabel}`}>MAKE SOMETHING</h2>
      <div className={styles.grid}>
        <Link href="/editor" className={styles.editorCard}>
          <span className={`mono ${styles.cardNum}`}>EDITOR</span>
          <span className="title-md">Brand asset editor</span>
          <p className={`body-sm ${styles.cardBlurb}`}>
            Around a hundred and fifty templates across eleven formats — square posts,
            carousels, stories, thumbnails, covers, avatars, ads, email and web. Edit the copy,
            pick a theme and accent, and export as PNG, JPEG, WebP, SVG or PDF. Or take the
            whole set as a zip.
          </p>
        </Link>
      </div>
    </div>
  );
}
