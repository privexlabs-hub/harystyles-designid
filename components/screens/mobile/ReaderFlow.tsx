"use client";

import { useState } from "react";
import { PIECES, type Piece } from "@/lib/fixtures";
import { ScreenPatron } from "./ScreenPatron";
import { ScreenReader } from "./ScreenReader";
import { ScreenTonight } from "./ScreenTonight";

/**
 * The loop, running. Tap a letter to read it, tap the patron button to see the
 * ask, close it to come back to the letter. Three stages, no router.
 */
export function ReaderFlow() {
  const [stage, setStage] = useState<"tonight" | "read" | "patron">("tonight");
  const [piece, setPiece] = useState<Piece>(PIECES[0]);

  if (stage === "tonight")
    return (
      <ScreenTonight
        onOpen={(p) => {
          setPiece(p);
          setStage("read");
        }}
      />
    );
  if (stage === "read")
    return (
      <ScreenReader
        piece={piece}
        onBack={() => setStage("tonight")}
        onPaywall={() => setStage("patron")}
      />
    );
  return <ScreenPatron onClose={() => setStage("read")} />;
}
