import { createPublicClient } from "@/lib/supabase/public";
import type { Database, Json } from "@/lib/database.types";
import { siteUrl } from "@/lib/site";
import { PROFESSION_LABELS } from "@/lib/auth-constants";

export type PublicProfile =
  Database["public"]["Views"]["public_profiles"]["Row"];
export type PublicLink = Database["public"]["Tables"]["links"]["Row"];
export type PublicService = Database["public"]["Tables"]["services"]["Row"];
export type PublicProject = Database["public"]["Tables"]["projects"]["Row"];
export type PublicProduct = Database["public"]["Tables"]["products"]["Row"];

export const PAGE_SECTION_KEYS = ["social", "store", "portfolio"] as const;
export type PageSectionKey = (typeof PAGE_SECTION_KEYS)[number];

export const DEFAULT_PAGE_SECTIONS: PageSectionKey[] = [
  "social",
  "store",
  "portfolio",
];

export function parsePageSections(raw: Json | null | undefined): PageSectionKey[] {
  if (!Array.isArray(raw)) return [...DEFAULT_PAGE_SECTIONS];
  const seen = new Set<PageSectionKey>();
  const result: PageSectionKey[] = [];
  for (const item of raw) {
    if (
      typeof item === "string" &&
      PAGE_SECTION_KEYS.includes(item as PageSectionKey) &&
      !seen.has(item as PageSectionKey)
    ) {
      seen.add(item as PageSectionKey);
      result.push(item as PageSectionKey);
    }
  }
  return result;
}

export function districtSlug(district: string) {
  return district.toLowerCase();
}

export function profileLongPath(profile: Pick<PublicProfile, "location" | "profession" | "username">) {
  return `/${districtSlug(profile.location)}/${profile.profession}/${profile.username}`;
}

export function profileShortPath(profile: Pick<PublicProfile, "username">) {
  return `/${profile.username}`;
}

export function profileLongUrl(profile: Pick<PublicProfile, "location" | "profession" | "username">) {
  return `${siteUrl()}${profileLongPath(profile)}`;
}

export function profileShortUrl(profile: Pick<PublicProfile, "username">) {
  return `${siteUrl()}${profileShortPath(profile)}`;
}

export async function getPublicProfile(username: string) {
  const supabase = createPublicClient();
  const { data: profile, error } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (error || !profile) return null;

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", profile.id)
    .order("position", { ascending: true });

  const [{ data: services }, { data: projects }, { data: products }] =
    await Promise.all([
      supabase
        .from("services")
        .select("*")
        .eq("profile_id", profile.id)
        .order("position", { ascending: true }),
      supabase
        .from("projects")
        .select("*")
        .eq("profile_id", profile.id)
        .order("position", { ascending: true }),
      supabase
        .from("products")
        .select("*")
        .eq("profile_id", profile.id)
        .eq("is_active", true)
        .order("position", { ascending: true }),
    ]);

  return {
    profile,
    links: links ?? [],
    services: services ?? [],
    projects: projects ?? [],
    products: products ?? [],
  };
}

export async function listPublicProfiles() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("public_profiles")
    .select("username, location, profession, updated_at");
  return data ?? [];
}

export function buildProfileMetadata(profile: PublicProfile) {
  const label = PROFESSION_LABELS[profile.profession];
  const displayName = profile.brand_name || profile.full_name;
  const description =
    profile.bio && profile.bio.trim()
      ? profile.bio.trim().slice(0, 160)
      : `${displayName} — a ${label.toLowerCase()} in ${profile.location}, Odisha. Follow along on devance.`;

  return {
    title: `${displayName} | ${label} in ${profile.location} | devance`,
    description,
    openGraph: {
      title: `${displayName} | ${label} in ${profile.location}`,
      description,
      url: profileLongUrl(profile),
      siteName: "devance",
      type: "profile",
      images: profile.avatar_url
        ? [{ url: profile.avatar_url, alt: `${displayName} avatar` }]
        : undefined,
    },
    twitter: {
      card: "summary",
      title: `${displayName} | ${label} in ${profile.location}`,
      description,
      images: profile.avatar_url ?? undefined,
    },
  };
}