import Link from "next/link";
import { Tile } from "@/components/Tile";
import { Node } from "@/components/Node";
import { FoodOnlyBadge } from "@/components/FoodOnlyBadge";

export const metadata = {
  title: "Example menu — Spread",
  description: "See how a Spread menu and request work, with sample data.",
};

export default function ExamplePage() {
  return (
    <main className="frame py-10">
      <div className="rounded-input bg-tomato-tint p-3 text-center text-xs font-semibold text-hot">
        This is an example page. All names, prices, and details below are
        samples — nothing here is real, and no requests or payments can be
        sent from this page.
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        <Tile letter="J" color="tomato" size="lg" />
        <h1 className="mt-4 font-display text-2xl font-extrabold">
          Jordan (example)
        </h1>
        <p className="text-sm text-soft">@jordan_example</p>
        <p className="mt-3 max-w-[360px] text-sm text-soft">
          Weeknight combos I actually crave, delivered around Eastside.
          (example intro)
        </p>
      </div>

      <div className="mt-6 text-center">
        <p className="font-display text-sm font-bold text-herb">
          Accepting requests (example status)
        </p>
        <p className="mt-1 text-sm text-soft">Delivering around Eastside (example area)</p>
        <p className="text-sm text-soft">Fri–Sun, 5–8pm (example availability)</p>
      </div>

      <div className="mt-10 flex flex-col items-center text-center">
        <Tile letter="T" color="amber" size="lg" />
        <h2 className="mt-4 font-display text-3xl font-extrabold">
          The Orange Chicken Drop
        </h2>
        <p className="text-sm text-soft">by @jordan_example</p>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-soft">
            From
          </p>
          <h3 className="mt-1 font-display text-xl font-bold">Panda Express</h3>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <p className="font-medium">Orange Chicken</p>
              <p className="text-sm text-soft">Extra sauce on the side</p>
            </li>
          </ul>
        </div>
        <div className="flex justify-center">
          <Node size="lg" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-soft">
            From
          </p>
          <h3 className="mt-1 font-display text-xl font-bold">McDonald&rsquo;s</h3>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <p className="font-medium">Fries</p>
              <p className="text-sm text-soft">Extra crispy</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <FoodOnlyBadge compact />
      </div>

      <div className="mt-10 card p-5 text-center">
        <p className="font-display text-sm font-bold text-herb">
          Accepting requests (example)
        </p>
        <p className="mt-2 font-display text-2xl font-extrabold">
          $18.00 <span className="text-sm font-normal text-soft">(example price)</span>
        </p>
        <p className="mt-2 text-sm text-soft">Delivering around Eastside</p>
        <p className="text-sm text-soft">Fri–Sun, 5–8pm</p>
        <p className="text-sm text-soft">Takes Venmo or Cash App (example)</p>

        <div
          aria-disabled="true"
          className="mt-4 w-full cursor-not-allowed rounded-input bg-node px-5 py-3 text-center font-display text-[15px] font-semibold text-white opacity-60"
        >
          Request this meal (preview only)
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">
          What requesting looks like
        </h2>
        <p className="mt-2 text-sm text-soft">
          A real request page asks for a delivery address and any
          instructions, lets you copy a clean summary, and sends you to the
          creator&rsquo;s own DM to confirm. Nothing is charged, and the
          request isn&rsquo;t confirmed, until the creator replies.
        </p>

        <div className="card mt-4 p-4 opacity-70">
          <label className="mb-1.5 block text-sm font-semibold text-soft">
            Delivery address (example — disabled)
          </label>
          <div className="input-field cursor-not-allowed select-none text-soft">
            123 Example St, Apt 4
          </div>
          <label className="mb-1.5 mt-3 block text-sm font-semibold text-soft">
            Delivery instructions (example — disabled)
          </label>
          <div className="input-field cursor-not-allowed select-none text-soft">
            Leave at the door
          </div>
        </div>
      </section>

      <div className="mt-10 text-center">
        <Link href="/" className="btn-primary w-full">
          Create your free menu
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
