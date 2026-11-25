import Link from "next/link";
import Image from "next/image";
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
        {/* Mobile reads top-to-bottom as promise -> visual example -> action
            (order-1/2/3 on a flex column). Desktop uses the same three
            pieces but places them explicitly on a 2-col/2-row grid — text
            column (promise over action) beside a full-height image column —
            rather than relying on order, which only reshuffles flex/grid
            children and would otherwise fight the explicit placement. */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:items-center lg:gap-x-16">
          <div className="order-1 mx-auto w-full max-w-[480px] lg:col-start-1 lg:row-start-1 lg:mx-0 lg:self-end">
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
              Start with one favorite. Combine more when it works for you.
            </p>

            <p className="mt-2 text-sm text-soft">
              Choose a restaurant favorite, set your delivered price, and
              share it with your social followers. You decide your area,
              your hours, and every request you accept.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full bg-tomato-tint px-3 py-1.5 text-xs font-semibold text-hot">
                Food only · No drinks or cold items
              </div>
              <div className="inline-flex items-center rounded-full bg-herb/15 px-3 py-1.5 text-xs font-semibold text-herb">
                $12 to start · covers your first 3 months
              </div>
            </div>
          </div>

          <div className="order-2 mx-auto mt-10 w-full max-w-[480px] lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mx-0 lg:mt-0 lg:self-center">
            <div className="overflow-hidden rounded-card shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=1200&auto=format&fit=crop"
                alt="One favorite burger, the kind of single item a Spread starts with"
                width={1200}
                height={800}
                className="h-48 w-full object-cover sm:h-64"
                priority
              />
            </div>
            <div className="mt-5">
              <BoardPreview
                handle="yourhandle"
                displayName="Your Board"
                initial="Y"
                style="burger"
                title="Your First Spread"
                restaurant="A restaurant near you"
                item="Your favorite item"
                price={14}
                area="Within 5 miles"
                hours="Pick your hours"
                sampleRequest={{
                  customerName: "Sample customer",
                  contactLabel: "Instagram: @example_customer",
                }}
              />
            </div>
            <DeliveryScene className="mt-6 w-full text-ink/60" />
          </div>

          <div
            id="signup"
            className="order-3 mx-auto mt-8 w-full max-w-[480px] lg:col-start-1 lg:row-start-2 lg:mx-0 lg:mt-0 lg:self-start"
          >
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
                <div className="mt-3 flex items-center justify-center gap-4 text-sm font-semibold">
                  <Link href="#try-it" className="text-hot hover:underline">
                    Try building a Spread →
                  </Link>
                  <Link
                    href="/example"
                    className="text-soft hover:text-ink hover:underline"
                  >
                    See an example →
                  </Link>
                </div>
              </>
            )}
            {params.error && (
              <p className="mt-3 rounded-input bg-tomato-tint p-3 text-sm text-hot">
                {params.error}
              </p>
            )}
          </div>
        </div>

        {/* ---------- Founder provenance ---------- */}
        <div className="mt-10 rounded-input border border-line2 bg-surface px-5 py-3 text-center text-sm text-soft">
          From Chip Mahoney, host of{" "}
          <span className="font-semibold text-ink">The Chip Mahoney Show</span>.
        </div>

        {/* ---------- Creator story ---------- */}
        <section className="mt-24 lg:mt-28">
          <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <h2 className="font-display text-2xl font-extrabold leading-tight lg:text-4xl">
                Something of your own. Starting around the corner.
              </h2>
              <p className="mt-4 text-[17px] text-soft">
                Jordan picked one favorite from a restaurant down the
                street, named it, and shared it with their followers.
                That&rsquo;s a complete start &mdash; more can come later,
                whenever it&rsquo;s worth it.
              </p>
              <p className="mt-3 text-[15px] text-soft">
                A Spread starts with one item. Creators can optionally
                combine up to three items across two restaurants when
                that&rsquo;s worth doing. Either way, customers request the
                complete Spread as published &mdash; a suggestion from a
                customer is never an obligation to add an item or a stop.
              </p>
            </div>

            <div className="mt-8 lg:mt-0">
              <div className="overflow-hidden rounded-card shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1200&auto=format&fit=crop"
                  alt="Crispy glazed chicken, Jordan's favorite from the spot down the street"
                  width={1200}
                  height={800}
                  className="h-44 w-full object-cover sm:h-56"
                />
              </div>
              <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-soft">
                Example &mdash; not a real account
              </p>
              <BoardPreview
                handle="jordan_example"
                displayName="Jordan"
                initial="J"
                style="chicken"
                title="The Orange Glaze Favorite"
                restaurant="Sunny's Diner"
                item="Orange Glazed Chicken"
                price={13}
                area="Delivering around Eastside"
                hours="Fri–Sun, 5–8pm"
              />
            </div>
          </div>
        </section>

        {/* ---------- Product storytelling ---------- */}
        <section id="try-it" className="mt-24 scroll-mt-10 lg:mt-28">
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
        <section className="-mx-5 mt-24 bg-herb px-5 py-8 text-bg lg:mt-28 lg:rounded-card">
          <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
            <div className="h-40 overflow-hidden rounded-card shadow-sm lg:h-32 lg:w-[220px] lg:shrink-0">
              <Image
                src="https://images.pexels.com/photos/4393668/pexels-photo-4393668.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="A creator handing off a delivery bag in person"
                width={900}
                height={600}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
              <h2 className="shrink-0 font-display text-xl font-extrabold leading-tight lg:text-2xl">
                You control the flow.
              </h2>
              <div className="hidden h-8 w-px shrink-0 bg-bg/20 lg:block" />
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <MenuIcon size={17} /> Your menu
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <PriceIcon size={17} /> Your price
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <HoursIcon size={17} /> Your hours
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <AreaIcon size={17} /> Your area
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <RequestsIcon size={17} /> Your requests
                </span>
              </div>
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
            . No Spread commission on sales &mdash; ever. Separate
            payment-provider fees may apply.
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
            <div>
              <p className="font-display font-bold">What counts as food only?</p>
              <p className="mt-1 text-[15px] text-soft">
                No drinks, ice cream, or other cold items &mdash; hot or
                freshly prepared food only. Spread flags likely drink or
                cold-item names when you list them, but it&rsquo;s a
                reminder, not an automatic check: keeping your listings
                food-only is on you as the creator.
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
          <p className="mt-3 text-[15px] text-soft">
            Start with one favorite. Build at your own pace.
          </p>
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
