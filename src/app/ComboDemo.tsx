"use client";

import { useState } from "react";
import Link from "next/link";
import { Tile } from "@/components/Tile";
import { Node } from "@/components/Node";
import type { SpreadColor } from "@/lib/colors";

type SampleItem = {
  restaurant: string;
  item: string;
  letter: string;
  color: SpreadColor;
};

const SIDE_A: SampleItem[] = [
  { restaurant: "Raising Cane's", item: "Chicken Strips", letter: "R", color: "amber" },
  { restaurant: "Five Guys", item: "Cajun Fries", letter: "F", color: "tomato" },
  { restaurant: "In-N-Out", item: "Double-Double", letter: "I", color: "herb" },
];

const SIDE_B: SampleItem[] = [
  { restaurant: "Panda Express", item: "Orange Chicken", letter: "P", color: "teal" },
  { restaurant: "Chipotle", item: "Chicken Bowl", letter: "C", color: "plum" },
  { restaurant: "Taco Bell", item: "Crunchwrap Supreme", letter: "T", color: "amber" },
];

type Phase = "building" | "combining" | "result";

export function ComboDemo() {
  const [selectedA, setSelectedA] = useState<number | null>(null);
  const [selectedB, setSelectedB] = useState<number | null>(null);
  const [mealName, setMealName] = useState("");
  const [phase, setPhase] = useState<Phase>("building");

  const itemA = selectedA !== null ? SIDE_A[selectedA] : null;
  const itemB = selectedB !== null ? SIDE_B[selectedB] : null;
  const canCombine = itemA !== null && itemB !== null && mealName.trim().length > 0;

  function handleCombine() {
    if (!canCombine) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setPhase("result");
      return;
    }
    setPhase("combining");
    setTimeout(() => setPhase("result"), 500);
  }

  function reset() {
    setSelectedA(null);
    setSelectedB(null);
    setMealName("");
    setPhase("building");
  }

  if (phase === "result" && itemA && itemB) {
    return (
      <div className="card mt-10 p-6">
        <div className="flex flex-col items-center text-center">
          <Tile letter={mealName} color="tomato" size="lg" />
          <h3 className="mt-4 font-display text-xl font-extrabold">
            {mealName}
          </h3>
          <p className="text-xs text-soft">your demo meal</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 text-sm">
          <div className="min-w-0 text-right">
            <p className="truncate font-display font-bold">{itemA.restaurant}</p>
            <p className="truncate text-soft">{itemA.item}</p>
          </div>
          <Node />
          <div className="min-w-0">
            <p className="truncate font-display font-bold">{itemB.restaurant}</p>
            <p className="truncate text-soft">{itemB.item}</p>
          </div>
        </div>

        <Link href="#signup" className="btn-primary mt-6 w-full">
          This could be live in 2 minutes — create your free menu
        </Link>
        <button
          type="button"
          onClick={reset}
          className="mt-3 w-full text-center text-sm font-semibold text-soft hover:text-ink"
        >
          Try another combo
        </button>
      </div>
    );
  }

  if (phase === "combining" && itemA && itemB) {
    return (
      <div className="card mt-10 flex items-center justify-center gap-3 p-6 py-12">
        <div className="flex items-center gap-3 animate-collapse">
          <Tile letter={itemA.letter} color={itemA.color} size="lg" />
          <Node size="lg" />
          <Tile letter={itemB.letter} color={itemB.color} size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="card mt-10 p-6">
      <p className="text-center font-display text-sm font-bold text-hot">
        Try it — pick two, name it
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {SIDE_A.map((option, i) => (
            <button
              key={option.item}
              type="button"
              onClick={() => setSelectedA(i)}
              className={`rounded-input border p-2 text-left text-xs transition-colors ${
                selectedA === i
                  ? "border-hot bg-tomato-tint"
                  : "border-line2 bg-surface hover:bg-bg"
              }`}
            >
              <p className="font-display font-bold">{option.restaurant}</p>
              <p className="text-soft">{option.item}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {SIDE_B.map((option, i) => (
            <button
              key={option.item}
              type="button"
              onClick={() => setSelectedB(i)}
              className={`rounded-input border p-2 text-left text-xs transition-colors ${
                selectedB === i
                  ? "border-hot bg-tomato-tint"
                  : "border-line2 bg-surface hover:bg-bg"
              }`}
            >
              <p className="font-display font-bold">{option.restaurant}</p>
              <p className="text-soft">{option.item}</p>
            </button>
          ))}
        </div>
      </div>

      <input
        className="input-field mt-4 font-display font-bold"
        value={mealName}
        maxLength={60}
        placeholder="What would you call it?"
        onChange={(e) => setMealName(e.target.value)}
      />

      <button
        type="button"
        onClick={handleCombine}
        disabled={!canCombine}
        className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        Combine
      </button>
    </div>
  );
}
