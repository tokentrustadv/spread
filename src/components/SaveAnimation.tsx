"use client";

import { useEffect, useState } from "react";
import { Tile } from "./Tile";
import { Node } from "./Node";
import type { SpreadStyle } from "@/lib/spreadStyle";

export function SaveAnimation({
  title,
  style,
  restaurantA,
  restaurantB,
  onDone,
}: {
  title: string;
  style: SpreadStyle;
  restaurantA: string;
  restaurantB?: string | null;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<"collapse" | "reveal">("collapse");

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      onDone();
      return;
    }

    const toReveal = setTimeout(() => setPhase("reveal"), 450);
    const toDone = setTimeout(() => onDone(), 1000);
    return () => {
      clearTimeout(toReveal);
      clearTimeout(toDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        {phase === "collapse" ? (
          <div
            className="flex items-center gap-3 animate-collapse"
            aria-label={restaurantB ? `${restaurantA} and ${restaurantB}` : restaurantA}
          >
            <Tile style={style} size="lg" />
            {restaurantB && (
              <>
                <Node size="lg" />
                <Tile style={style} size="lg" />
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 animate-pop-in">
            <Tile style={style} size="lg" />
            <h3 className="max-w-[280px] text-center font-display text-xl font-bold">
              {title}
            </h3>
            <p className="text-sm font-semibold text-herb">
              ✓ Added to your board
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
