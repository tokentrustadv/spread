import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Node } from "@/components/Node";
import { SignInForm } from "./SignInForm";
import { SpreadDemo } from "./SpreadDemo";
import { FoodOnlyBadge } from "@/components/FoodOnlyBadge";
import { ShareMockup } from "./ShareMockup";
import { DeliveryMockup } from "./DeliveryMockup";

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
    <main className="frame py-16">
      <p className="font-display text-sm font-bold tracking-tight text-hot">
        Spread <span className="text-warm">+</span>
      </p>

      <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05]">
        Create your meal.{" "}
        <span className="bg-node bg-clip-text text-transparent">
          Share your menu. Deliver on your terms.
        </span>
      </h1>

      <p className="mt-4 text-[17px] text-soft">
        Combine your favorite food from two local restaurants into a meal you
        name and price. Share it with your social audience, take requests,
        and deliver in your area.
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

      <SpreadDemo />

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

      <section className="mt-14 rounded-card border border-line2 bg-surface p-5">
        <h2 className="font-display text-xl font-extrabold leading-tight">
          Delivery apps charge too much, skim your tips, and tell you who to
          drive for. You know this already.
        </h2>
        <p className="mt-3 text-[15px] text-soft">
          Spread flips it: your menu, your price, your customers.
        </p>
        <Link
          href="/why"
          className="mt-4 inline-block text-sm font-semibold text-hot hover:underline"
        >
          Read why delivery needed this →
        </Link>
      </section>

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
          Need to make something right? You refund the same way — straight
          back through Cash App or Venmo, just like you would with a friend.
        </p>
        <div className="mt-4">
          <FoodOnlyBadge />
        </div>
        <p className="mt-4 rounded-input border border-line2 bg-surface p-4 text-[15px] text-soft">
          Spread is a membership, not a marketplace. We don&rsquo;t touch the
          money, we&rsquo;re not part of your deliveries, and we&rsquo;re not
          involved in your business in any way — just a tool creators use to
          run their own thing.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-extrabold leading-tight">
          Share it like you&rsquo;d share anything else.
        </h2>
        <p className="mt-3 text-[15px] text-soft">
          Post your meal to your story, your feed, or straight into a DM —
          wherever your audience already is. Every spread gets a link with a
          rich preview card, plus a ready-to-send caption, so sharing it is
          as easy as sharing anything else you post.
        </p>
        <ShareMockup />
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-extrabold leading-tight">
          Delivery, but personal.
        </h2>
        <p className="mt-3 text-[15px] text-soft">
          You know exactly who&rsquo;s asking, where they live, and what they
          want — because you made this meal for people like them in the
          first place. No stranger dispatched to a stranger&rsquo;s door.
          Just you, confirming details directly with someone who already
          trusts you.
        </p>
        <DeliveryMockup />
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
    </main>
  );
}
