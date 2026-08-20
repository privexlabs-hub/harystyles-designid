import type { Metadata } from "next";
import { BROWSER_SIZE, BrowserShell, MockupFrame, MockupGallery } from "@/components/frames";
import { PlaybookPage, Section } from "@/components/playbook/Page";
import { WebEditor, WebStudio } from "@/components/screens/webIndex";

export const metadata: Metadata = {
  title: "Writer studio",
  description:
    "The writer-side dashboard. Distinct from the reader app. No graphs — just the letters, the patrons, and the writing.",
};

export default function StudioScreensPage() {
  return (
    <PlaybookPage
      href="/playbook/screens/studio"
      eyebrow="10 · WEB · WRITER STUDIO"
      title={
        <>
          No graphs — just the letters, the patrons, and{" "}
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            the writing.
          </span>
        </>
      }
      lede="The writer-side dashboard. Distinct from the reader app. No graphs — just the letters, the patrons, and the writing."
    >
      <Section
        title="10 · WEB · WRITER STUDIO"
        note="A 240px sidebar and one column of work. Earnings are stated plainly, once, and never charted."
      >
        <MockupGallery>
          <MockupFrame
            width={BROWSER_SIZE.w}
            height={BROWSER_SIZE.h}
            label="Studio dashboard"
            note="harystyles.com/studio"
          >
            <BrowserShell url="harystyles.com/studio">
              <WebStudio />
            </BrowserShell>
          </MockupFrame>
          <MockupFrame
            width={BROWSER_SIZE.w}
            height={BROWSER_SIZE.h}
            label="Long-form editor"
            note="harystyles.com/studio/draft/on-the-small-grief"
          >
            <BrowserShell url="harystyles.com/studio/draft/on-the-small-grief">
              <WebEditor />
            </BrowserShell>
          </MockupFrame>
        </MockupGallery>
      </Section>
    </PlaybookPage>
  );
}
