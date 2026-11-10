"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Tile } from "@/components/Tile";
import { StorefrontIcon, HomeIcon, VehicleGlyphs, RouteMarker } from "@/components/RouteIcons";
import type { SpreadColor } from "@/lib/colors";

type SampleItem = {
  restaurant: string;
  item: string;
  letter: string;
  color: SpreadColor;
};

const OPTIONS: SampleItem[] = [
  { restaurant: "Raising Cane's", item: "Chicken Strips", letter: "R", color: "amber" },
  { restaurant: "Five Guys", item: "Cajun Fries", letter: "F", color: "tomato" },
  { restaurant: "In-N-Out", item: "Double-Double", letter: "I", color: "herb" },
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

function StopPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 rounded-full border border-line2 bg-surface px-2.5 py-1.5 text-xs">
      <span className="shrink-0 text-soft">{icon}</span>
      <span className="truncate font-semibold text-ink">{label}</span>
    </div>
  );
}

export function SpreadDemo() {
  const [selected, setSelected] = useState<number | null>(null);
  const [mealName, setMealName] = useState("");
  const [phase, setPhase] = useState<Phase>("building");

  const item = selected !== null ? OPTIONS[selected] : null;
  const canCombine = item !== null && mealName.trim().length > 0;
  const atDropoff = phase === "result";

  const label = item?.restaurant ?? "Pick a spot";

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
    setSelected(null);
    setMealName("");
    setPhase("building");
  }

  function handleContinue() {
    if (!item || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        DEMO_DRAFT_KEY,
        JSON.stringify({
          title: mealName,
          restaurantA: item.restaurant,
          itemA: item.item,
        })
      );
    } catch {
      // Private browsing / storage disabled — the signup flow still works,
      // it just won't carry the demo's picks over.
    }
  }

  let card: ReactNode;

  if (phase === "result" && item) {
    card = (
      <div className="card p-6">
        <div className="flex flex-col items-center text-center" role="status">
          <Tile letter={mealName} color="tomato" size="lg" />
          <h3 className="mt-4 font-display text-xl font-extrabold">
            {mealName}
          </h3>
          <p className="text-xs text-soft">your demo Spread</p>
        </div>

        <div className="mt-6 flex items-center justify-center text-sm">
          <div className="min-w-0 text-center">
            <p className="truncate font-display font-bold">{item.restaurant}</p>
            <p className="truncate text-soft">{item.item}</p>
          </div>
        </div>

        <p className="mt-5 text-center text-sm text-soft">
          Created by you. Shared with your people. Delivered by you.
        </p>

        <Link
          href="#signup"
          onClick={handleContinue}
          className="btn-primary mt-6 w-full"
        >
          Make this my first Spread
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
  } else if (phase === "combining" && item) {
    card = (
      <div className="card flex items-center justify-center gap-3 p-6 py-12">
        <div className="animate-collapse">
          <Tile letter={item.letter} color={item.color} size="lg" />
        </div>
      </div>
    );
  } else {
    card = (
      <div className="card p-6">
        <p className="text-center font-display text-sm font-bold text-hot">
          Try it — build your Spread
        </p>
        <p className="mt-1 text-center text-sm text-soft">
          Pick one favorite item from a restaurant near you.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {OPTIONS.map((option, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={option.item}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(i)}
                className={`flex items-start justify-between gap-2 rounded-input border p-2 text-left text-xs transition-colors ${
                  isSelected
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
                {isSelected && <Checkmark />}
              </button>
            );
          })}
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
            Pick a favorite and give it a name to continue.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-10">
      <p className="text-center text-[11px] font-medium text-soft">
        Illustrative delivery example.
      </p>

      {/* Desktop: stops wrap around the card, never overlapping it — each
          row lives in its own stacked flex row, so there's no absolute
          positioning that could ever land on top of the controls. */}
      <div className="mt-3 hidden lg:block">
        <div className="flex items-center justify-center">
          <StopPill icon={<StorefrontIcon size={16} />} label={label} />
        </div>
        <div className="flex items-center justify-center gap-3 py-2">
          <span className="h-5 w-px bg-line2" />
          <RouteMarker active={!atDropoff} size={20} />
          <span className="h-5 w-px bg-line2" />
        </div>
      </div>

      {card}

      <div className="mt-2 hidden lg:block">
        <div className="flex items-center justify-center gap-3 py-2">
          <span className="h-5 w-px bg-line2" />
          <RouteMarker active={atDropoff} size={20} />
          <span className="h-5 w-px bg-line2" />
        </div>
        <div className="flex items-center justify-center gap-3">
          <StopPill icon={<HomeIcon size={16} />} label="Customer drop-off" />
          <VehicleGlyphs size={14} className="text-soft" />
        </div>
      </div>

      {/* Mobile: one compact sequence below the card, never beside or
          behind its controls. */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 lg:hidden">
        <StopPill icon={<StorefrontIcon size={14} />} label={label} />
        <span aria-hidden="true" className="text-soft">
          →
        </span>
        <StopPill icon={<HomeIcon size={14} />} label="Customer drop-off" />
      </div>
    </div>
  );
}
