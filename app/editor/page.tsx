import type { Metadata } from "next";
import { EditorShell } from "@/components/editor/EditorShell";

export const metadata: Metadata = {
  title: "Editor",
  description:
    "Produce branded artwork from the harystyles design system — square posts, carousels, stories, thumbnails, covers, avatars, ads, email and web — and export as PNG, JPEG, WebP, SVG or PDF.",
};

export default function EditorPage() {
  return <EditorShell />;
}
