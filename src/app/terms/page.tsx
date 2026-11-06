export const metadata = {
  title: "Membership Terms — Spread",
  description: "Spread's membership terms and liability agreement.",
};

import { TERMS_VERSION } from "@/lib/terms";

export default function TermsPage() {
  return (
    <main className="frame py-10">
      <h1 className="font-display text-2xl font-extrabold">
        Spread Membership Terms
      </h1>
      <p className="mt-2 text-sm text-soft">
        Version {TERMS_VERSION} — draft, pending legal review.
      </p>

      <div className="mt-8 flex flex-col gap-6 text-sm text-soft">
        <section>
          <h2 className="font-display text-base font-bold text-ink">
            1. What Spread is
          </h2>
          <p className="mt-2">
            Spread is a software platform and membership service. It lets a
            person (a &ldquo;Creator&rdquo;) build and publish a named meal
            combining items from local restaurants, share that meal with
            their own audience, and display delivery information such as
            area, availability, and price.
          </p>
          <p className="mt-2">
            Spread does not sell food, does not process payments between a
            Creator and anyone requesting a meal (a &ldquo;Customer&rdquo;),
            does not handle, prepare, package, or deliver any food, and does
            not dispatch, route, or supervise any delivery. Spread is not a
            restaurant, a delivery service, or a marketplace for food
            transactions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-ink">
            2. The relationship is between Creator and Customer
          </h2>
          <p className="mt-2">
            Every request, price, payment, refund, delivery arrangement, and
            communication happens directly between a Creator and a Customer,
            through channels the Creator chooses (such as social media,
            messaging apps, Cash App, or Venmo). Spread is not a party to
            that transaction, does not hold or move any money exchanged
            between a Creator and a Customer, and has no visibility into or
            control over whether any transaction is completed, fulfilled,
            refunded, or disputed.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-ink">
            3. Creator responsibility
          </h2>
          <p className="mt-2">
            If you use Spread to publish and offer meals, you are solely
            responsible for: the accuracy of what you list; safely
            purchasing, handling, and transporting food; setting and
            collecting your own prices; delivering what you offer, on the
            terms you set; resolving any complaint, refund, or dispute
            directly with your Customer; and complying with all laws that
            apply to you, including any local, state, or federal requirements
            around food handling, resale, business licensing, or permits.
            Spread makes no representation that your use of the app complies
            with any such law, and does not verify, inspect, or guarantee
            any Creator&rsquo;s food, pricing, or conduct.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-ink">
            4. Customer acknowledgment
          </h2>
          <p className="mt-2">
            If you request a meal through a Creator&rsquo;s Spread page, you
            are transacting directly with that Creator, not with Spread. You
            are responsible for confirming details, price, and delivery
            directly with the Creator before paying, and for working out any
            refund directly with the Creator if something goes wrong.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-ink">
            5. Release of liability
          </h2>
          <p className="mt-2">
            By creating an account, you release Spread and its operators
            from any and all claims, liability, damages, costs, or losses
            arising from or related to any meal, listing, transaction,
            payment, refund, delivery, or interaction between a Creator and
            a Customer facilitated through your use of the app. This
            includes, without limitation, claims related to food safety,
            food quality, allergic reactions, delivery delays or failures,
            payment disputes, or any dispute between a Creator and a
            Customer.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-ink">
            6. No warranty
          </h2>
          <p className="mt-2">
            Spread is provided &ldquo;as is,&rdquo; without any warranty of
            any kind, express or implied, including as to the accuracy of
            any listing, the safety or quality of any food, or the outcome
            of any transaction between a Creator and a Customer.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-ink">
            7. Membership
          </h2>
          <p className="mt-2">
            Building, saving, and sharing meals on Spread is free. Spread may
            offer a paid membership that unlocks additional features, such
            as the ability to accept requests. Any membership fee is billed
            to the Creator for use of the Spread software, separately from
            and unrelated to any payment a Creator collects from a Customer.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-bold text-ink">
            8. Changes
          </h2>
          <p className="mt-2">
            These terms may be updated from time to time. Continuing to use
            Spread after a change means you accept the updated terms.
          </p>
        </section>
      </div>
    </main>
  );
}
