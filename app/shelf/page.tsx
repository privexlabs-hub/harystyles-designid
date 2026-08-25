import type { Metadata } from "next";
import { ShelfClient } from "./ShelfClient";

export const metadata: Metadata = {
  title: "Your shelf",
  description: "Saved work, kept in this browser and nowhere else.",
};

export default function ShelfPage() {
  return <ShelfClient />;
}
