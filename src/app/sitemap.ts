import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteUrl } from "@/lib/site";

// Refresh hourly rather than only at build time, so new creators and new
// Spreads show up without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/why`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/example`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const admin = createAdminClient();

  const { data: profiles } = await admin.from("profiles").select("id, handle");
  const handleById = new Map((profiles ?? []).map((p) => [p.id, p.handle]));

  const profilePages: MetadataRoute.Sitemap = (profiles ?? []).map((p) => ({
    url: `${siteUrl}/@${p.handle}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const { data: spreads } = await admin
    .from("spreads")
    .select("user_id, slug")
    .eq("is_public", true)
    .is("deleted_at", null);

  const spreadPages: MetadataRoute.Sitemap = (spreads ?? [])
    .map((s) => {
      const handle = handleById.get(s.user_id);
      if (!handle) return null;
      return {
        url: `${siteUrl}/@${handle}/${s.slug}`,
        changeFrequency: "daily" as const,
        priority: 0.8,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return [...staticPages, ...profilePages, ...spreadPages];
}
