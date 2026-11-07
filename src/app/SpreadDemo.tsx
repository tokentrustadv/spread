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

export const DEMO_DRAFT_KEY = "spread_demo_draft";

type Phase = "building" | "combining" | "result";

function Checkmark() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="8" cy="8" r="8" className="fill-hot" />
      <path
        d="M4.5 8.2 6.8 10.5 11.5 5.5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SpreadDemo() {
  const [selectedA, setSelectedA] = useState<number | null>(null);
  const [selectedB, setSelectedB] = useState<number | null>(null);
  const [mealName, setMealName] = useState("");
  const [phase, setPhase] = useState<Phase>("building");

  const itemA = selectedA !== null ? SIDE_A[selectedA] : null;
  const itemB = selectedB !== null ? SIDE_B[selectedB] : null;
  const selectedCount = (itemA ? 1 : 0) + (itemB ? 1 : 0);
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

  function handleContinue() {
    if (!itemA || !itemB || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        DEMO_DRAFT_KEY,
        JSON.stringify({
          title: mealName,
          restaurantA: itemA.restaurant,
          itemA: itemA.item,
          restaurantB: itemB.restaurant,
          itemB: itemB.item,
        })
      );
    } catch {
      // Private browsing / storage disabled — the signup flow still works,
      // it just won't carry the demo's picks over.
    }
  }

  if (phase === "result" && itemA && itemB) {
    return (
      <div className="card mt-10 p-6">
        <div className="flex flex-col items-center text-center" role="status">
          <Tile letter={mealName} color="tomato" size="lg" />
          <h3 className="mt-4 font-display text-xl font-extrabold">
            {mealName}
          </h3>
          <p className="text-xs text-soft">your demo Spread</p>
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

        <Link
          href="#signup"
          onClick={handleContinue}
          className="btn-primary mt-6 w-full"
        >
          Make this your first Spread
        </Link>
        <button
          type="button"
          onClick={reset}
          className="mt-3 w-full text-center text-sm font-semibold text-soft hover:text-ink"
        >
          Try another Spread
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
        Try it — build your Spread
      </p>
      <p className="mt-1 text-center text-sm text-soft">
        Choose two items from different restaurants.
      </p>
      <p className="mt-2 text-center text-xs font-semibold text-soft" aria-live="polite">
        {selectedCount} of 2 selected
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {SIDE_A.map((option, i) => {
            const selected = selectedA === i;
            return (
              <button
                key={option.item}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedA(i)}
                className={`flex items-start justify-between gap-2 rounded-input border p-2 text-left text-xs transition-colors ${
                  selected
                    ? "border-hot bg-tomato-tint"
                    : "border-line2 bg-surface hover:bg-bg"
                }`}
              >
                <span>
                  <span className="block font-display font-bold">
                    {option.restaurant}
                  </span>
                  <span className="block text-soft">{option.item}</span>
                </span>
                {selected && <Checkmark />}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {SIDE_B.map((option, i) => {
            const selected = selectedB === i;
            return (
              <button
                key={option.item}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedB(i)}
                className={`flex items-start justify-between gap-2 rounded-input border p-2 text-left text-xs transition-colors ${
                  selected
                    ? "border-hot bg-tomato-tint"
                    : "border-line2 bg-surface hover:bg-bg"
                }`}
              >
                <span>
                  <span className="block font-display font-bold">
                    {option.restaurant}
                  </span>
                  <span className="block text-soft">{option.item}</span>
                </span>
                {selected && <Checkmark />}
              </button>
            );
          })}
        </div>
      </div>

      <label
        htmlFor="demo-meal-name"
        className="mb-1.5 mt-4 block text-xs font-semibold text-soft"
      >
        Name your Spread
      </label>
      <input
        id="demo-meal-name"
        className="input-field font-display font-bold"
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
        Build it
      </button>
      {!canCombine && (
        <p className="mt-2 text-center text-xs text-soft">
          Pick one item from each side and give it a name to continue.
        </p>
      )}
    </div>
  );
}
