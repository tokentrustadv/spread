import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { listPublicSpreadsByHandle } from "@/services/spreads";
import { isMembershipActiveForUser } from "@/services/membership";
import { Tile } from "@/components/Tile";
import { AvatarTile } from "@/components/AvatarTile";
import { siteUrl } from "@/lib/site";
import { CopyLinkButton } from "@/components/CopyLinkButton";

type Params = { handle: string };

async function loadMenu(params: Params) {
  const handle = decodeURIComponent(params.handle).replace(/^@/, "");
  const supabase = await createClient();
  const { profile, spreads } = await listPublicSpreadsByHandle(supabase, handle);
  const membershipActive = profile
    ? await isMembershipActiveForUser(supabase, profile.id)
    : false;
  return { profile, spreads, membershipActive };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolved = await params;
  const { profile } = await loadMenu(resolved);
  if (!profile) return {};

  const description = profile.bio ?? `${profile.displayName}'s menu on Spread.`;
  return {
    title: `${profile.displayName} (@${profile.handle}) — Spread`,
    description,
    openGraph: {
      title: `${profile.displayName} on Spread`,
      description,
      url: `${siteUrl}/@${profile.handle}`,
      type: "website",
    },
  };
}

export default async function CreatorMenuPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolved = await params;
  const { profile, spreads, membershipActive } = await loadMenu(resolved);

  if (!profile) notFound();

  const menuUrl = `${siteUrl}/@${profile.handle}`;

  return (
    <main className="frame py-10">
      <div className="flex flex-col items-center text-center">
        <AvatarTile letter={profile.displayName} size="lg" />
        <h1 className="mt-4 font-display text-2xl font-extrabold">
          {profile.displayName}
        </h1>
        <p className="text-sm text-soft">@{profile.handle}</p>
        {profile.bio && (
          <p className="mt-3 max-w-[360px] text-sm text-soft">{profile.bio}</p>
        )}
      </div>

      <div className="mt-6 text-center">
        {profile.isLive && membershipActive ? (
          <p className="font-display text-sm font-bold text-herb">
            Accepting requests
          </p>
        ) : (
          <p className="font-display text-sm font-bold text-soft">
            Not currently accepting requests
          </p>
        )}
        {profile.area && <p className="mt-1 text-sm text-soft">{profile.area}</p>}
        {profile.availability && (
          <p className="text-sm text-soft">{profile.availability}</p>
        )}
      </div>

      <div className="mt-6">
        <CopyLinkButton url={menuUrl} label="Copy board link" />
      </div>

      {profile.socialLink && (
        <div className="mt-4 text-center">
          <a
            href={profile.socialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-hot hover:underline"
          >
            Suggest something to {profile.displayName}
          </a>
          <p className="mt-1 text-xs text-soft">
            Have something in mind? Ask directly. The creator decides what
            they offer.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {spreads.length === 0 ? (
          <p className="text-center text-sm text-soft">No meals yet.</p>
        ) : (
          spreads.map((spread) => (
            <Link
              key={spread.id}
              href={`/@${profile.handle}/${spread.slug}`}
              className="card block p-4"
            >
              <div className="flex items-center gap-4">
                <Tile style={spread.color} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-bold">{spread.title}</h3>
                  {spread.price != null && (
                    <p className="text-sm text-soft">${spread.price.toFixed(2)}</p>
                  )}
                  {spread.isPaused && (
                    <p className="text-xs text-soft">Currently unavailable</p>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-xs text-soft hover:text-ink">
          Made with Spread — create your own board →
        </Link>
      </div>
    </main>
  );
}
