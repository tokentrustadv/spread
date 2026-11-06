import Link from "next/link";

export const metadata = {
  title: "Why Spread — delivery, flipped",
  description:
    "Gas costs, app markups, tip skimming, algorithms telling you what to do. Spread flips the script: your menu, your price, your customers.",
};

const problems = [
  {
    title: "You pay for the gas. The app keeps the rate the same.",
    body: "Mileage doesn't change because gas did. You're still paid by the drop, not by what it actually cost you to get there.",
  },
  {
    title: "The customer pays more than the menu says.",
    body: "Delivery apps quietly mark up restaurant prices to cover what they charge restaurants in commission. The customer thinks they're paying for food. Some of it is paying the app.",
  },
  {
    title: "Tips don't always mean what you think.",
    body: "Several of the biggest delivery apps have been investigated or sued over using tips to cover base pay instead of adding to it. You did the delivery. The algorithm decided what you actually made.",
  },
  {
    title: "You don't pick your customer. The app does.",
    body: "No say in the order, the distance, the restaurant, or the person on the other end of the delivery. You're a resource the app allocates, not someone building anything of your own.",
  },
];

export default function WhyPage() {
  return (
    <main className="frame py-10">
      <h1 className="font-display text-3xl font-extrabold leading-[1.05]">
        Delivery isn&rsquo;t broken because of drivers.{" "}
        <span className="bg-node bg-clip-text text-transparent">
          It&rsquo;s broken because of the apps.
        </span>
      </h1>
      <p className="mt-4 text-[17px] text-soft">
        If you&rsquo;ve driven for one, you already know this list.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        {problems.map((p) => (
          <div key={p.title} className="card p-5">
            <h2 className="font-display text-lg font-bold">{p.title}</h2>
            <p className="mt-2 text-sm text-soft">{p.body}</p>
          </div>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-extrabold leading-tight">
          Spread flips the script.
        </h2>
        <p className="mt-3 text-[15px] text-soft">
          There&rsquo;s no algorithm deciding your rate, your route, or your
          customer. You build a Spread — your own item from two local
          spots — and put a price on it that actually accounts for your
          gas, your time, your effort. Nobody marks it up on the way to the
          customer. Nobody skims the tip. It&rsquo;s your menu, so it&rsquo;s
          your terms.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-extrabold leading-tight">
          Your customers, not the app&rsquo;s.
        </h2>
        <p className="mt-3 text-[15px] text-soft">
          Every person who orders from a delivery app is the app&rsquo;s
          customer first. On Spread, they&rsquo;re yours — they found you
          through your own social media, they trust you, and they can come
          back to the same Spread next time without an algorithm deciding
          whether you show up in their feed. The more people who know what
          you make, the more there is for you to build.
        </p>
      </section>

      <div className="mt-10 card p-5 text-center">
        <p className="font-display text-lg font-bold">
          Build something that&rsquo;s actually yours.
        </p>
        <Link href="/#signup" className="btn-primary mt-4 w-full">
          Create your free menu
        </Link>
      </div>
    </main>
  );
}
