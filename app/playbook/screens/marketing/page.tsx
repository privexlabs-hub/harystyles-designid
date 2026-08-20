import type { Metadata } from "next";
import { BrowserShell, MockupFrame, MockupGallery } from "@/components/frames";
import { PlaybookPage, Section } from "@/components/playbook/Page";
import { WebMarketing } from "@/components/screens/webIndex";
import styles from "./marketing.module.css";

export const metadata: Metadata = {
  title: "Marketing",
  description: "The home page — quiet, literary, never shouting.",
};

/**
 * 40px of chrome, a 1px border top and bottom, and the landing page's own
 * 2,909px. The canvas artboard was 1280×2400 and clipped its footer; this one
 * is as tall as the page it holds.
 */
const LANDING_HEIGHT = 2951;

export default function MarketingScreensPage() {
  return (
    <PlaybookPage
      href="/playbook/screens/marketing"
      eyebrow="11 · WEB · MARKETING"
      title={
        <>
          The home page — quiet, literary,{" "}
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            never shouting.
          </span>
        </>
      }
      lede="The home page — quiet, literary, never shouting."
    >
      <Section
        title="11 · WEB · MARKETING"
        note="One tall artboard: hero, six ways it feels, one quiet quote, two prices, and a footer that promises the lamp will be lit again."
      >
        <MockupGallery>
          <MockupFrame width={1280} height={LANDING_HEIGHT} label="harystyles.com — landing" note="harystyles.com">
            <div className={styles.tall}>
              <BrowserShell url="harystyles.com">
                <WebMarketing />
              </BrowserShell>
            </div>
          </MockupFrame>
        </MockupGallery>
      </Section>
    </PlaybookPage>
  );
}
