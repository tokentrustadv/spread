import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Node } from "@/components/Node";
import { Tile } from "@/components/Tile";
import { SignInForm } from "./SignInForm";

const steps = [
  {
    n: 1,
    title: "Pair two spots",
    body: "Pick two local restaurants and the exact items you love from each.",
  },
  {
    n: 2,
    title: "Build up to three items",
    body: "Add your custom items — food only — and say exactly how each one comes.",
  },
  {
    n: 3,
    title: "Keep & share",
    body: "Save it to your board and share it with the people who'll love it too.",
  },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="frame py-16">
      <p className="font-display text-sm font-bold tracking-tight text-hot">
        Spread <span className="text-warm">+</span>
      </p>

      <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05]">
        Some of the best meals don&rsquo;t exist on any menu.{" "}
        <span className="bg-node bg-clip-text text-transparent">Build yours.</span>
      </h1>

      <p className="mt-4 text-[17px] text-soft">
        Two local restaurants, the exact items you love, combined into one meal
        you name yourself — saved to your board, ready to share.
      </p>

      <div className="mt-8">
        {user ? (
          <Link href="/board" className="btn-primary w-full">
            Go to your board
          </Link>
        ) : (
          <SignInForm />
        )}
      </div>

      <div className="card mt-10 p-6">
        <div className="flex items-center justify-center gap-3">
          <Tile letter="R" color="amber" size="lg" />
          <Node size="lg" />
          <Tile letter="P" color="teal" size="lg" />
        </div>
        <p className="mt-4 text-center font-display text-lg font-bold">
          One meal that&rsquo;s only yours
        </p>
        <p className="text-center text-sm text-soft">
          The combo no single menu offers.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-extrabold">How it works</h2>
        <div className="mt-6 flex flex-col gap-6">
          {steps.map((step) => (
            <div key={step.n} className="flex gap-4">
              <div className="plus-node h-9 w-9 shrink-0 font-display text-base font-bold">
                {step.n}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">{step.title}</h3>
                <p className="text-sm text-soft">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-extrabold leading-tight">
          Ever want the fries from one place and the sandwich from another?
        </h2>
        <p className="mt-3 text-[15px] text-soft">
          Or the chicken strips from your favorite fast-food spot — with the egg
          rolls and potstickers from the place down the road? On Spread,
          that&rsquo;s one meal. You just have to name it.
        </p>

        <div className="card mt-6 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-display font-bold">Raising Cane&rsquo;s</p>
              <p className="truncate text-sm text-soft">Chicken Strips</p>
            </div>
            <Node />
            <div className="min-w-0 text-right">
              <p className="truncate font-display font-bold">Panda Express</p>
              <p className="truncate text-sm text-soft">
                Egg Rolls · Potstickers
              </p>
            </div>
          </div>
          <input
            disabled
            placeholder="What would you call it?"
            className="input-field mt-5 font-display font-bold"
          />
        </div>
      </section>

      <footer className="mt-16 pb-8 text-center text-xs text-soft">
        Spread — some of the best meals don&rsquo;t exist on any menu.
      </footer>
    </main>
  );
}
