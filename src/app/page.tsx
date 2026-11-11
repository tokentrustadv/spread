import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignInForm } from "./SignInForm";
import { SpreadDemo } from "./SpreadDemo";
import { DemoResultProvider } from "./DemoResultContext";
import { SampleRequestCard } from "./SampleRequestCard";
import { FoodOnlyBadge } from "@/components/FoodOnlyBadge";
import { Logo } from "@/components/Logo";
import { CarMark } from "@/components/CarMark";
import { DeliveryScene } from "@/components/DeliveryScene";
import { BoardPreview } from "@/components/BoardPreview";
import {
  MenuIcon,
  PriceIcon,
  HoursIcon,
  AreaIcon,
  RequestsIcon,
} from "@/components/ControlIcons";

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
        {/* ---------- Hero ---------- */}
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="mx-auto w-full max-w-[480px] lg:mx-0">
            <Logo size={20} />

            <p className="mt-5 text-xs font-bold uppercase tracking-wide text-herb">
              A membership for independent delivery creators
            </p>

            <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.04] lg:text-6xl">
              One favorite.
              <br />
              Your price.
              <br />
              <span className="text-hot">Delivered by you.</span>
            </h1>

            <p className="mt-5 text-lg text-soft">
              Build a board around one favorite, and deliver it yourself.
            </p>

            <div className="mt-4 inline-flex items-center rounded-full bg-tomato-tint px-3 py-1.5 text-xs font-semibold text-hot">
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

          <div className="mt-12 lg:mt-0">
            <BoardPreview
              handle="yourhandle"
              displayName="Your Board"
              initial="Y"
              color="tomato"
              title="Your First Spread"
              restaurant="A restaurant near you"
              item="Your favorite item"
              price={14}
              area="Within 5 miles"
              hours="Pick your hours"
            />
            <DeliveryScene className="mt-6 w-full text-ink/60" />
          </div>
        </div>

        {/* ---------- Creator story ---------- */}
        <section className="mt-24 lg:mt-28">
          <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <h2 className="font-display text-2xl font-extrabold leading-tight lg:text-4xl">
                Start with the spot around the corner.
              </h2>
              <p className="mt-4 text-[17px] text-soft">
                Jordan picked one favorite from a restaurant down the
                street, named it, and shared it with their followers.
                That&rsquo;s a complete start &mdash; more can come later,
                whenever it&rsquo;s worth it.
              </p>
            </div>

            <div className="mt-8 lg:mt-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-soft">
                Example &mdash; not a real account
              </p>
              <BoardPreview
                handle="jordan_example"
                displayName="Jordan"
                initial="J"
                color="amber"
                title="The Orange Chicken Favorite"
                restaurant="Panda Express"
                item="Orange Chicken"
                price={13}
                area="Delivering around Eastside"
                hours="Fri–Sun, 5–8pm"
              />
            </div>
          </div>
        </section>

        {/* ---------- Product storytelling ---------- */}
        <section className="mt-24 lg:mt-28">
          <div className="mx-auto max-w-[640px] text-center">
            <h2 className="font-display text-2xl font-extrabold leading-tight lg:text-4xl">
              See it come together.
            </h2>
            <p className="mt-4 text-[17px] text-soft">
              Pick a favorite, name it, and watch the same offering move
              from built to requested &mdash; no separate steps, no
              guesswork.
            </p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
            <SpreadDemo />
            <div className="lg:pt-10">
              <p className="text-sm font-semibold text-ink">
                Then, a request comes in.
              </p>
              <SampleRequestCard />
            </div>
          </div>
        </section>

        {/* ---------- You control the flow ---------- */}
        <section className="-mx-5 mt-24 bg-herb/15 px-5 py-8 lg:mt-28 lg:rounded-card">
          <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            <h2 className="shrink-0 font-display text-xl font-extrabold leading-tight lg:text-2xl">
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
        </section>

        {/* ---------- Membership ---------- */}
        <section className="mx-auto mt-24 max-w-[640px] text-center lg:mt-28">
          <h2 className="font-display text-2xl font-extrabold leading-tight lg:text-4xl">
            A membership, not a marketplace.
          </h2>
          <p className="mt-4 text-[17px] text-soft">
            Build and share free. Activate requests for{" "}
            <strong className="font-semibold text-ink">
              $12 total for your first three months
            </strong>
            , then{" "}
            <strong className="font-semibold text-ink">
              $12/month starting in month four
            </strong>
            . No commission on your sales &mdash; ever.
          </p>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="mx-auto mt-24 max-w-[640px] lg:mt-28">
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
                out directly between you and your customer &mdash; the
                same way payment did.
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

        {/* ---------- Closing ---------- */}
        <section className="mx-auto mt-24 max-w-[560px] text-center lg:mt-28">
          <h2 className="font-display text-3xl font-extrabold leading-tight lg:text-4xl">
            Your first Spread could be around the corner.
          </h2>
          <Link href="#signup" className="btn-primary mt-6 w-full">
            Create your free board
          </Link>
        </section>

        <div className="mt-16 flex flex-col items-center pb-8 text-center text-xs text-soft">
          <CarMark size={110} />
          <p className="mt-3">Or by car &mdash; however you already get around.</p>
        </div>
      </main>
    </DemoResultProvider>
  );
}
