import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Node } from "@/components/Node";
import { SignInForm } from "./SignInForm";
import { SpreadDemo } from "./SpreadDemo";
import { FoodOnlyBadge } from "@/components/FoodOnlyBadge";
import { Logo } from "@/components/Logo";

const steps = [
  {
    n: 1,
    title: "Make it yours",
    body: "Your favorite item from two local spots — add a third if you want more. Name your Spread.",
  },
  {
    n: 2,
    title: "Set your terms",
    body: "Choose your price, delivery area, and availability.",
  },
  {
    n: 3,
    title: "Share and deliver",
    body: "Share your menu with your audience, confirm requests directly, and deliver the meals yourself.",
  },
];

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string }>;
}) {
  const params = await searchParams;

  if (params.code) {
    redirect(`/auth/callback?code=${encodeURIComponent(params.code)}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto w-full max-w-[1120px] px-5 py-16">
      <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="mx-auto w-full max-w-[480px] lg:mx-0">
          <Logo size={20} />

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1]">
            Create your meal.
            <br />
            Share your menu.
            <br />
            Deliver on <span className="text-hot">your terms</span>.
          </h1>

          <p className="mt-4 text-[17px] text-soft">
            Combine your favorite food from two local restaurants into a meal
            you name and price. Share it with your social audience, take
            requests, and deliver in your area.
          </p>

          <p className="mt-3 text-sm italic text-soft">
            Some of the best meals don&rsquo;t exist on any menu.
          </p>

          <div id="signup" className="mt-8">
            {user ? (
              <Link href="/board" className="btn-primary w-full">
                Go to your board
              </Link>
            ) : (
              <>
                <SignInForm />
                <p className="mt-2 text-xs text-soft">
                  We&rsquo;ll email you a sign-in link. No password needed.
                </p>
                <p className="mt-4 rounded-input border border-line2 bg-surface p-3 text-xs text-soft">
                  Build and share free. Activate requests for $12 for your
                  first three months, then $12/month. No commission on your
                  sales.
                </p>
                <Link
                  href="/example"
                  className="mt-3 block text-center text-sm font-semibold text-hot hover:underline"
                >
                  See an example →
                </Link>
              </>
            )}
            {params.error && (
              <p className="mt-3 rounded-input bg-tomato-tint p-3 text-sm text-hot">
                {params.error}
              </p>
            )}
          </div>
        </div>

        <div>
          <SpreadDemo />
        </div>
      </div>

      <section className="mt-14 lg:mt-20">
        <h2 className="font-display text-2xl font-extrabold">How it works</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {steps.map((step) => (
            <div key={step.n} className="flex gap-4 lg:flex-col">
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

      <div className="mx-auto w-full max-w-[560px]">
      <section className="mt-14">
        <h2 className="font-display text-2xl font-extrabold leading-tight">
          You control the whole thing.
        </h2>
        <p className="mt-3 text-[15px] text-soft">
          You set the price, the area, and when you&rsquo;re available. When
          someone requests a meal, you get paid directly — Cash App, Venmo,
          however you already get paid for anything — the same way a friend
          pays you back. No middleman holding your money. You know who&rsquo;s
          asking, and you&rsquo;re the one who delivers it.
        </p>
        <p className="mt-3 text-[15px] text-soft">
          Need to make something right? Refunds go straight back through Cash
          App or Venmo, worked out directly between you and your customer —
          the same way payment did.
        </p>
        <div className="mt-4">
          <FoodOnlyBadge />
        </div>
        <p className="mt-4 rounded-input border border-line2 bg-surface p-4 text-[15px] text-soft">
          Spread is a membership, not a marketplace: we give you the menu and
          sharing tools. You handle requests, payment, and delivery yourself,
          directly with your customers.
        </p>
        <Link
          href="/why"
          className="mt-3 inline-block text-sm font-semibold text-hot hover:underline"
        >
          Curious why delivery needed this? →
        </Link>
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
          <Link
            href="/example"
            className="btn-secondary mt-5 block w-full text-center"
          >
            See how this works →
          </Link>
        </div>
      </section>

      <footer className="mt-16 pb-8 text-center text-xs text-soft">
        Spread — some of the best meals don&rsquo;t exist on any menu.
      </footer>
      </div>
    </main>
  );
}
