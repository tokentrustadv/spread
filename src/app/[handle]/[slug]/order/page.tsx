import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPublicSpread } from "@/services/spreads";
import { OrderForm } from "./OrderForm";

type Params = { handle: string; slug: string };

export default async function OrderPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolved = await params;
  const handle = decodeURIComponent(resolved.handle).replace(/^@/, "");
  const supabase = await createClient();
  const spread = await getPublicSpread(supabase, handle, resolved.slug);

  if (!spread) notFound();
  if (!spread.ownerIsLive) {
    redirect(`/@${handle}/${resolved.slug}`);
  }

  return (
    <main className="frame py-10">
      <OrderForm spread={spread} />
    </main>
  );
}
