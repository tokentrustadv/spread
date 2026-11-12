import Link from "next/link";
import { Logo } from "./Logo";
import { missionLine } from "@/lib/site";

// A plain, thin-stroke X (Twitter) glyph — no brand asset, just a simple
// line mark consistent with the rest of the icon set.
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4 L20 20 M20 4 L4 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const X_PROFILE_URL = "https://x.com/chipmahoney9";

export function Footer() {
  return (
    <footer className="bg-ink text-bg">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:py-16">
        <div className="flex flex-col gap-8 border-b border-bg/10 pb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:pb-12">
          <div className="max-w-[520px]">
            <Logo size={18} />
            <h2 className="mt-5 font-display text-2xl font-semibold leading-snug sm:text-3xl">
              {missionLine}
            </h2>
          </div>
          <Link
            href="#signup"
            className="btn-primary w-full shrink-0 sm:w-auto"
          >
            Create your free board
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-[480px] text-xs leading-relaxed text-bg/55">
            Spread is a membership and sharing tool for independent
            creators &mdash; not a food delivery service. Spread does not
            purchase, prepare, handle, or deliver food, and has no
            business relationship or software connection with any
            restaurant. A creator buys each item themselves, in person,
            at the restaurant, after confirming the request and
            arranging payment directly with their customer through their
            own social media or messaging.{" "}
            <Link href="/terms" className="font-semibold text-warm hover:underline">
              Read the full terms
            </Link>
            .
          </p>

          <div className="flex flex-col gap-3 sm:items-end">
            <a
              href={X_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-bg hover:text-warm"
            >
              <XIcon size={15} />
              Follow on X
            </a>
            <div className="flex gap-4 text-xs text-bg/55">
              <Link href="/terms" className="hover:text-bg">
                Terms
              </Link>
              <Link href="/why" className="hover:text-bg">
                Why Spread
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-bg/40">
          &copy; 2026 CM9 Group LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
