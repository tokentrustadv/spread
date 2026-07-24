import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getPublicSpread } from "@/services/spreads";
import { Tile } from "@/components/Tile";
import { Node } from "@/components/Node";
import { OwnerActions } from "@/components/OwnerActions";
import { ShareSheet } from "@/components/ShareSheet";
import { siteUrl } from "@/lib/site";

type Params = { handle: string; slug: string };

async function loadSpread(params: Params) {
  const handle = decodeURIComponent(params.handle).replace(/^@/, "");
  const supabase = await createClient();
  try {
    const spread = await getPublicSpread(supabase, handle, params.slug);
    return { supabase, spread, handle, error: null as string | null };
  } catch (err) {
    console.error("loadSpread failed", { handle, slug: params.slug, err });
    const message = err instanceof Error ? err.message : String(err);
    return { supabase, spread: null, handle, error: message };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolved = await params;
  const { spread } = await loadSpread(resolved);
  if (!spread) return {};

  const [a, b] = spread.restaurants;
  const ogParams = new URLSearchParams({
    title: spread.title,
    a: a?.name ?? "",
    b: b?.name ?? "",
  });
  const ogImage = `${siteUrl}/api/og?${ogParams.toString()}`;
  const description = `A meal ${spread.title} swears by.`;
  const url = `${siteUrl}/@${spread.ownerHandle}/${spread.slug}`;

  return {
    title: `${spread.title} — Spread`,
    description,
    openGraph: {
      title: spread.title,
      description,
      url,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: spread.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function SpreadDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolved = await params;
  const { supabase, spread, handle, error } = await loadSpread(resolved);

  if (!spread) {
    if (error) {
      return (
        <main className="frame py-16">
          <p className="font-display text-sm font-bold text-hot">
            Couldn&rsquo;t load this spread
          </p>
          <p className="mt-2 text-sm text-soft">handle: {handle}</p>
          <p className="text-sm text-soft">slug: {resolved.slug}</p>
          <p className="mt-4 rounded-input bg-tomato-tint p-3 text-sm text-hot">
            {error}
          </p>
        </main>
      );
    }
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === spread.userId;

  const [a, b] = spread.restaurants;
  const shareUrl = `${siteUrl}/@${spread.ownerHandle}/${spread.slug}`;

  return (
    <main className="frame py-10">
      <div className="flex flex-col items-center text-center">
        <Tile letter={spread.title} color={spread.color} size="lg" />
        <h1 className="mt-4 font-display text-3xl font-extrabold">
          {spread.title}
        </h1>
        <p className="mt-1 text-sm text-soft">by @{spread.ownerHandle}</p>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {a && (
          <RestaurantBlock name={a.name} items={a.items} />
        )}
        <div className="flex justify-center">
          <Node size="lg" />
        </div>
        {b && (
          <RestaurantBlock name={b.name} items={b.items} />
        )}
      </div>

      {spread.notes && (
        <p className="mt-8 rounded-input bg-surface border border-line p-4 text-sm text-soft">
          {spread.notes}
        </p>
      )}

      <div className="mt-10">
        {isOwner ? (
          <div className="flex flex-col gap-4">
            <ShareSheet
              title={spread.title}
              color={spread.color}
              restaurantA={a?.name ?? "?"}
              restaurantB={b?.name ?? "?"}
              url={shareUrl}
            />
            <OwnerActions spreadId={spread.id} userId={spread.userId} />
          </div>
        ) : (
          <Link href="/" className="card block p-5 text-center">
            <p className="font-display text-sm font-bold text-hot">
              Made with Spread
            </p>
            <p className="mt-1 text-sm text-soft">Make your own spread →</p>
          </Link>
        )}
      </div>
    </main>
  );
}

function RestaurantBlock({
  name,
  items,
}: {
  name: string;
  items: { id: string; name: string; note: string | null }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-soft">
        From
      </p>
      <h2 className="mt-1 font-display text-xl font-bold">{name}</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <p className="font-medium">{item.name}</p>
            {item.note && <p className="text-sm text-soft">{item.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
