import type { Metadata } from "next";
import { BROWSER_SIZE, BrowserShell, MockupFrame, MockupGallery } from "@/components/frames";
import { PlaybookPage, Section } from "@/components/playbook/Page";
import { WebMoods, WebReader, WebShelf, WebTonight, WebWriter } from "@/components/screens/webIndex";

export const metadata: Metadata = {
  title: "Web reader",
  description:
    "The reading experience on desktop. Distinct from the writer's studio. Tonight → Moods → Reader → Writer → Shelf.",
};

const SCREENS = [
  { id: "web-tonight", label: "Tonight — daily ration of 5", url: "harystyles.com/tonight", screen: <WebTonight /> },
  { id: "web-moods", label: "Moods — read by feeling", url: "harystyles.com/moods", screen: <WebMoods /> },
  {
    id: "web-reader-view",
    label: "Reading — soft fade paywall",
    url: "harystyles.com/ines/on-the-small-grief",
    screen: <WebReader />,
  },
  { id: "web-writer", label: "Writer page — Ines Marlowe", url: "harystyles.com/ines", screen: <WebWriter /> },
  { id: "web-shelf", label: "Your shelf — kept lines", url: "harystyles.com/shelf", screen: <WebShelf /> },
];

export default function WebScreensPage() {
  return (
    <PlaybookPage
      href="/playbook/screens/web"
      eyebrow="09 · WEB · READER APP"
      title={
        <>
          The reading experience,{" "}
          <span className="italic-display" style={{ color: "var(--accent)" }}>
            on desktop.
          </span>
        </>
      }
      lede="The reading experience on desktop. Distinct from the writer's studio. Tonight → Moods → Reader → Writer → Shelf."
    >
      <Section
        title="09 · WEB · READER APP"
        note="Five artboards at 1280×820. The reader app never shows a graph, a follower count, or a share tally — the only number on the page is how many lines a letter kept."
      >
        <MockupGallery>
          {SCREENS.map((s) => (
            <MockupFrame
              key={s.id}
              width={BROWSER_SIZE.w}
              height={BROWSER_SIZE.h}
              label={s.label}
              note={s.url}
            >
              <BrowserShell url={s.url}>{s.screen}</BrowserShell>
            </MockupFrame>
          ))}
        </MockupGallery>
      </Section>
    </PlaybookPage>
  );
}
