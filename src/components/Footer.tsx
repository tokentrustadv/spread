import Link from "next/link";
import { Logo } from "./Logo";

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
    <footer className="border-t border-line2 bg-surface">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo size={16} />
            <p className="mt-3 max-w-[480px] text-xs leading-relaxed text-soft">
              Spread is a membership and sharing tool for independent
              creators &mdash; not a food delivery service. Spread does not
              purchase, prepare, handle, or deliver food, and has no
              business relationship or software connection with any
              restaurant. A creator buys each item themselves, in person,
              at the restaurant, after confirming the request and
              arranging payment directly with their customer through their
              own social media or messaging.{" "}
              <Link href="/terms" className="font-semibold text-hot hover:underline">
                Read the full terms
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <a
              href={X_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-hot"
            >
              <XIcon size={15} />
              Follow on X
            </a>
            <div className="flex gap-4 text-xs text-soft">
              <Link href="/terms" className="hover:text-ink">
                Terms
              </Link>
              <Link href="/why" className="hover:text-ink">
                Why Spread
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-soft">
          &copy; 2026 CM9 Group LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
