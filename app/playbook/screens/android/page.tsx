import type { Metadata } from "next";
import { DeviceShell, DEVICE_SIZE, MockupFrame, MockupGallery } from "@/components/frames";
import { PlaybookPage, Section } from "@/components/playbook/Page";
import { AndroidEditor, AndroidHome } from "@/components/screens";

export const metadata: Metadata = {
  title: "Android screens",
  description: "Material 3 in harystyles tokens. Same tone, different motion.",
};

const { w, h } = DEVICE_SIZE.android;

export default function AndroidScreensPage() {
  return (
    <PlaybookPage
      eyebrow="08 · Screens"
      title={
        <>
          Material 3,
          <br />
          <span className="italic-display">in our tokens.</span>
        </>
      }
      lede="The platform gets its own shapes — elevated cards, a squared FAB, a pill nav — while the voice, the ration and the amber stay exactly where they were."
      href="/playbook/screens/android"
    >
      <Section
        title="08 · Android"
        note="Material 3 in harystyles tokens. Same tone, different motion."
      >
        <MockupGallery>
          <MockupFrame width={w} height={h} label="Tonight — Android" note={`${w}×${h}`}>
            <DeviceShell kind="android">
              <AndroidHome />
            </DeviceShell>
          </MockupFrame>
          <MockupFrame width={w} height={h} label="Editor — Android" note={`${w}×${h}`}>
            <DeviceShell kind="android">
              <AndroidEditor />
            </DeviceShell>
          </MockupFrame>
        </MockupGallery>
      </Section>
    </PlaybookPage>
  );
}
