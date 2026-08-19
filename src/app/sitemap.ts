import type { MetadataRoute } from "next";
import { listPublicProfiles, profileLongPath } from "@/lib/public-profile";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const profiles = await listPublicProfiles();

  return [
    {
      url: siteUrl(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...profiles.map((profile) => ({
      url: `${siteUrl()}${profileLongPath(profile)}`,
      lastModified: profile.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}