import type { Metadata } from "next";
import { CheckClient } from "./CheckClient";

export const metadata: Metadata = {
  title: "Render check",
  description: "Every template rendered through both engines, side by side.",
  robots: { index: false, follow: false },
};

export default function CheckPage() {
  return <CheckClient />;
}
