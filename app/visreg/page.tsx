import type { Metadata } from "next";
import { VisregClient } from "./VisregClient";

export const metadata: Metadata = {
  title: "Visual regression capture",
  description: "One artboard, at true pixel size, for scripts/visreg.mjs to screenshot.",
  robots: { index: false, follow: false },
};

export default function VisregPage() {
  return <VisregClient />;
}
