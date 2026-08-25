import type { Metadata } from "next";
import { DeviceShell, DEVICE_SIZE, MockupFrame, MockupGallery } from "@/components/frames";
import { PlaybookPage, Section } from "@/components/playbook/Page";
import {
  ReaderFlow,
  ScreenMoods,
  ScreenPatron,
  ScreenProfile,
  ScreenReader,
  ScreenShelf,
  ScreenTonight,
} from "@/components/screens";
import { PIECES } from "@/lib/fixtures";

export const metadata: Metadata = {
  title: "iOS screens",
  description: "Tonight → Moods → Read → Patron, and the writer's own identity.",
};

const { w, h } = DEVICE_SIZE.ios;

export default function IOSScreensPage() {
  return (
    <PlaybookPage
      eyebrow="07 · Screens"
      title={
        <>
          The whole loop,
          <br />
          <span className="italic-display">in five frames.</span>
        </>
      }
      lede="Mobile-first. Tonight → Moods → Read → Patron. Each screen is the real component at its real size, not a picture of one."
      href="/playbook/screens/ios"
    >
      <Section
        title="06 · iOS · Reader flow"
        note="Mobile-first. Tonight → Moods → Read → Patron. The whole loop, in five frames."
      >
        <MockupGallery>
          <MockupFrame width={w} height={h} label="Tonight — daily ration of 5" note={`${w}×${h}`}>
            <DeviceShell>
              <ScreenTonight />
            </DeviceShell>
          </MockupFrame>
          <MockupFrame width={w} height={h} label="Moods — read by feeling" note={`${w}×${h}`}>
            <DeviceShell>
              <ScreenMoods />
            </DeviceShell>
          </MockupFrame>
          <MockupFrame width={w} height={h} label="Reading — soft fade paywall" note={`${w}×${h}`}>
            <DeviceShell>
              <ScreenReader piece={PIECES[0]} />
            </DeviceShell>
          </MockupFrame>
          <MockupFrame width={w} height={h} label="Patron — not a paywall" note={`${w}×${h}`}>
            <DeviceShell>
              <ScreenPatron />
            </DeviceShell>
          </MockupFrame>
          <MockupFrame width={w} height={h} label="Live prototype — tap to advance" note="interactive">
            <DeviceShell>
              <ReaderFlow />
            </DeviceShell>
          </MockupFrame>
        </MockupGallery>
      </Section>

      <Section
        title="07 · Writer identity"
        note="Pen-name forward. A personal notebook, not a brand page. No follower counts."
      >
        <MockupGallery>
          <MockupFrame width={w} height={h} label="Ines Marlowe — profile" note={`${w}×${h}`}>
            <DeviceShell>
              <ScreenProfile />
            </DeviceShell>
          </MockupFrame>
          <MockupFrame width={w} height={h} label="Your Shelf — kept lines" note={`${w}×${h}`}>
            <DeviceShell>
              <ScreenShelf />
            </DeviceShell>
          </MockupFrame>
        </MockupGallery>
      </Section>
    </PlaybookPage>
  );
}
