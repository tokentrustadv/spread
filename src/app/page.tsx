import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tile } from "@/components/Tile";
import { SignInForm } from "./SignInForm";
import { SpreadDemo } from "./SpreadDemo";
import { DemoResultProvider } from "./DemoResultContext";
import { SampleRequestCard } from "./SampleRequestCard";
import { FoodOnlyBadge } from "@/components/FoodOnlyBadge";
import { Logo } from "@/components/Logo";
import { CarMark } from "@/components/CarMark";
import { DeliveryScene } from "@/components/DeliveryScene";
import {
  MenuIcon,
  PriceIcon,
  HoursIcon,
  AreaIcon,
  RequestsIcon,
} from "@/components/ControlIcons";

const steps = [
  {
    n: 1,
    title: "Make it yours",
    body: "Pick one favorite item from a restaurant near you. Name your Spread.",
  },
  {
    n: 2,
    title: "Set your terms",
    body: "Choose your price, delivery area, and availability.",
  },
  {
    n: 3,
    title: "Share and deliver",
    body: "Share your board with your audience, confirm requests directly, and deliver the meals yourself.",
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
    <DemoResultProvider>
      <main className="mx-auto w-full max-w-[1120px] px-5 py-16">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="mx-auto w-full max-w-[480px] lg:mx-0">
            <Logo size={20} />

            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-herb">
              A membership for independent delivery creators
            </p>

            <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.1] lg:text-5xl">
              One favorite.
              <br />
              Your price.
              <br />
              <span className="text-hot">Delivered by you.</span>
            </h1>

            <p className="mt-4 text-[17px] text-soft">
              Choose a favorite from a nearby restaurant. Set your delivered
              price, delivery area, and hours. Share your board with your
              social followers&mdash;and choose which requests to accept.
            </p>

            <p className="mt-2 text-sm font-semibold text-ink">
              Start small. Grow your board on your terms.
            </p>

            <div className="mt-3 inline-flex items-center rounded-full bg-tomato-tint px-3 py-1.5 text-xs font-semibold text-hot">
              Food only · No drinks or cold items
            </div>

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
                  <p className="mt-3 text-sm text-soft">
                    Start with one favorite. Learn what your customers want.
                    Add only what works for you.
                  </p>
                  <div className="mt-4 rounded-input border border-line2 bg-surface p-3 text-xs text-soft">
                    <p className="font-semibold text-ink">
                      Build and share free.
                    </p>
                    <p className="mt-1">
                      Activate requests for{" "}
                      <strong className="font-semibold text-ink">
                        $12 total for your first three months
                      </strong>
                      , then{" "}
                      <strong className="font-semibold text-ink">
                        $12/month starting in month four
                      </strong>
                      . No commission on your sales.
                    </p>
                  </div>
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
          <h2 className="font-display text-2xl font-extrabold lg:text-3xl">
            How it works
          </h2>
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

        <section className="-mx-5 mt-14 bg-herb/15 px-5 py-6 lg:rounded-card lg:py-8">
          <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
              <h2 className="shrink-0 font-display text-xl font-extrabold leading-tight">
                You control the flow.
              </h2>
              <div className="hidden h-8 w-px shrink-0 bg-ink/15 lg:block" />
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <MenuIcon size={17} /> Your menu
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <PriceIcon size={17} /> Your price
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <HoursIcon size={17} /> Your hours
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <AreaIcon size={17} /> Your area
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <RequestsIcon size={17} /> Your requests
                </span>
              </div>
            </div>
            <DeliveryScene className="mx-auto w-full max-w-[300px] text-ink/60 lg:mx-0 lg:w-[300px] lg:shrink-0" />
          </div>
        </section>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <section>
            <h2 className="font-display text-2xl font-extrabold leading-tight lg:text-3xl">
              You choose every request.
            </h2>
            <p className="mt-3 text-[15px] text-soft">
              When someone requests a Spread, it lands in your queue &mdash;
              never an assignment. Accept the ones you want, decline the
              rest, no explanation needed.
            </p>

            <SampleRequestCard />
          </section>

          <section>
            <h2 className="font-display text-2xl font-extrabold leading-tight lg:text-3xl">
              A few more things
            </h2>
            <div className="mt-5 flex flex-col gap-5">
              <div>
                <p className="font-display font-bold">How do I get paid?</p>
                <p className="mt-1 text-[15px] text-soft">
                  Customers pay you directly through your chosen payment
                  method. You arrange payment and any refunds with your
                  customer. Spread does not collect customer payments.
                </p>
              </div>
              <div>
                <p className="font-display font-bold">What about refunds?</p>
                <p className="mt-1 text-[15px] text-soft">
                  Refunds go straight back through Cash App or Venmo, worked
                  out directly between you and your customer — the same way
                  payment did.
                </p>
              </div>
              <div>
                <p className="font-display font-bold">
                  Is Spread a marketplace?
                </p>
                <p className="mt-1 text-[15px] text-soft">
                  No — it&rsquo;s a membership. We give you the board and
                  sharing tools. You handle requests, payment, and delivery
                  yourself, directly with your customers.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <FoodOnlyBadge />
            </div>
            <Link
              href="/why"
              className="mt-4 inline-block text-sm font-semibold text-hot hover:underline"
            >
              Curious why delivery needed this? →
            </Link>
          </section>
        </div>

        <section className="mx-auto mt-14 w-full max-w-[720px]">
          <h2 className="font-display text-2xl font-extrabold leading-tight lg:text-3xl">
            Add more when it&rsquo;s worth it.
          </h2>
          <p className="mt-3 text-[15px] text-soft">
            Your board grows one favorite at a time — from the same
            restaurant or a new one, whenever you&rsquo;re ready. Customers
            can always suggest something they&rsquo;d love to see;
            it&rsquo;s always your call whether to add it.
          </p>

          <div className="mt-6 divide-y divide-line overflow-hidden rounded-card border border-line2">
            <div className="flex items-center gap-3 p-4">
              <Tile letter="Chicken Strips" color="tomato" size="sm" />
              <div className="min-w-0">
                <p className="truncate font-display font-bold">
                  Raising Cane&rsquo;s
                </p>
                <p className="truncate text-sm text-soft">Chicken Strips</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <Tile letter="Orange Chicken" color="teal" size="sm" />
              <div className="min-w-0">
                <p className="truncate font-display font-bold">
                  Panda Express
                </p>
                <p className="truncate text-sm text-soft">Orange Chicken</p>
              </div>
            </div>
          </div>
          <Link
            href="/example"
            className="btn-secondary mt-4 block w-full text-center"
          >
            See how this works →
          </Link>
        </section>

        <section className="mx-auto mt-14 w-full max-w-[560px] card p-6 text-center">
          <p className="font-display text-lg font-bold">
            Ready to build your own board?
          </p>
          <p className="mt-2 text-sm text-soft">
            Free to build and share. Activate requests when you&rsquo;re
            ready.
          </p>
          <Link href="#signup" className="btn-primary mt-4 w-full">
            Create your free board
          </Link>
        </section>

        <div className="mt-16 flex flex-col items-center pb-8 text-center text-xs text-soft">
          <CarMark size={140} />
          <p className="mt-3">Or by car — however you already get around.</p>
          <p className="mt-2">Your favorites. Your neighborhood. Your terms.</p>
        </div>
      </main>
    </DemoResultProvider>
  );
}
