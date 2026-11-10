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
  price: number;
};

const OPTIONS: SampleItem[] = [
  { restaurant: "Raising Cane's", item: "Chicken Strips", letter: "R", color: "amber", price: 14 },
  { restaurant: "Five Guys", item: "Cajun Fries", letter: "F", color: "tomato", price: 9 },
  { restaurant: "In-N-Out", item: "Double-Double", letter: "I", color: "herb", price: 12 },
  { restaurant: "Panda Express", item: "Orange Chicken", letter: "P", color: "teal", price: 13 },
  { restaurant: "Chipotle", item: "Chicken Bowl", letter: "C", color: "plum", price: 14 },
  { restaurant: "Taco Bell", item: "Crunchwrap Supreme", letter: "T", color: "amber", price: 10 },
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

// A single winding line standing in for the whole route — it runs behind
// the builder card on desktop (the card's opaque background covers the
// middle of it), so pickup and drop-off read as one continuous path
// rather than two disconnected segments.
function RoutePath() {
  return (
    <svg
      className="pointer-events-none absolute left-1/2 top-0 z-0 hidden h-full w-6 -translate-x-1/2 lg:block"
      viewBox="0 0 24 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M12 0 C 4 36, 20 64, 12 100 C 6 128, 18 156, 12 200"
        stroke="#C4472D"
        strokeWidth="2"
        strokeDasharray="1 9"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
    </svg>
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

        <div className="mt-5 flex items-center justify-center text-sm">
          <div className="min-w-0 text-center">
            <p className="truncate font-display font-bold">{item.restaurant}</p>
            <p className="truncate text-soft">{item.item}</p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="font-display text-2xl font-extrabold text-hot">
            ${item.price.toFixed(2)}
          </p>
          <p className="mt-0.5 text-xs text-soft">Sample delivered price</p>
        </div>

        <div className="mt-4 rounded-input bg-bg p-3 text-center text-xs text-soft">
          <p>Sample area: within 5 miles of your neighborhood</p>
          <p className="mt-0.5">Sample hours: Fri&ndash;Sun, 5&ndash;8pm</p>
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

      {/* One continuous route line runs behind the whole stack on desktop
          — the card's opaque background covers the middle of it, so
          pickup and drop-off read as a single path rather than two
          fragments. The card itself renders exactly once; only the
          decorative stop rows toggle between desktop and mobile layout. */}
      <div className="relative mt-3">
        <RoutePath />

        <div className="relative z-10 hidden flex-col items-center gap-2 lg:flex">
          <StopPill icon={<StorefrontIcon size={16} />} label={label} />
          <RouteMarker active={!atDropoff} size={20} />
        </div>

        <div className="relative z-10">{card}</div>

        <div className="relative z-10 mt-2 hidden flex-col items-center gap-2 lg:flex">
          <RouteMarker active={atDropoff} size={20} />
          <StopPill icon={<HomeIcon size={16} />} label="Customer drop-off" />
          <VehicleGlyphs size={14} className="mt-1 text-soft" />
        </div>

        {/* Mobile: a compact pickup → drop-off sequence below the card —
            the marker slides along a short connecting line to echo the
            same "one route" idea. */}
        <div className="relative z-10 mt-3 flex items-center justify-center gap-2 lg:hidden">
          <StopPill icon={<StorefrontIcon size={14} />} label={label} />
          <div className="relative h-px w-10 shrink-0 bg-line2">
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ left: atDropoff ? "calc(100% - 7px)" : "0px" }}
            >
              <RouteMarker active size={14} />
            </div>
          </div>
          <StopPill icon={<HomeIcon size={14} />} label="Customer drop-off" />
        </div>
      </div>
    </div>
  );
}
