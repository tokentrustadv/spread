import Link from "next/link";
import { Tile } from "@/components/Tile";
import { FoodOnlyBadge } from "@/components/FoodOnlyBadge";
import { RequestPreview } from "./RequestPreview";

export const metadata = {
  title: "Example menu — Spread",
  description: "See how a Spread menu and request work, with sample data.",
};

export default function ExamplePage() {
  return (
    <main className="frame py-10">
      <div className="rounded-input bg-tomato-tint p-3 text-center text-xs font-semibold text-hot">
        Sample menu — requests and payments disabled. Nothing on this page
        is real.
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <Tile letter="J" color="tomato" />
        <h1 className="mt-3 font-display text-xl font-extrabold">Jordan</h1>
        <p className="text-sm text-soft">@jordan_example</p>
        <p className="mt-2 max-w-[360px] text-sm text-soft">
          Weeknight spreads I actually crave, delivered around Eastside.
        </p>
      </div>

      <div className="mt-6 card p-5">
        <div className="flex flex-col items-center text-center">
          <Tile letter="O" color="amber" size="lg" />
          <h2 className="mt-3 font-display text-2xl font-extrabold">
            The Orange Chicken Favorite
          </h2>
          <p className="font-display text-xl font-bold text-hot">$12.00</p>
        </div>

        <div className="mt-3 text-center text-sm text-soft">
          <p className="font-display font-bold text-herb">Accepting requests</p>
          <p>Delivering around Eastside · Fri–Sun, 5–8pm</p>
          <p>Takes Venmo or Cash App</p>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-soft">
              From
            </p>
            <h3 className="mt-1 font-display text-lg font-bold">Panda Express</h3>
            <p className="font-medium">Orange Chicken</p>
            <p className="text-sm text-soft">Extra sauce on the side</p>
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <FoodOnlyBadge compact />
        </div>

        <div className="mt-6">
          <RequestPreview />
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link href="/" className="btn-primary w-full">
          Create your free board
        </Link>
        <Link
          href="/"
          className="mt-3 block text-center text-xs text-soft hover:text-ink"
        >
          ← Back to Spread
        </Link>
      </div>
    </main>
  );
}
