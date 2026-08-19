import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicProfilePage from "@/components/public/PublicProfilePage";
import {
  getPublicProfile,
  profileLongUrl,
  buildProfileMetadata,
} from "@/lib/public-profile";
import { isReservedUsername } from "@/lib/auth-constants";

type Props = {
  params: Promise<{ username: string[] }>;
};

export const dynamic = "force-dynamic";

async function resolveProfile(params: Props["params"]) {
  const { username } = await params;
  // Short share link is devance.in/{username} — a single segment.
  if (username.length !== 1) return null;
  const slug = username[0];
  if (isReservedUsername(slug)) return null;
  return { slug, data: await getPublicProfile(slug) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await resolveProfile(params);
  if (!resolved?.data) return {};

  return {
    ...buildProfileMetadata(resolved.data.profile),
    alternates: { canonical: profileLongUrl(resolved.data.profile) },
    robots: { index: true, follow: true },
  };
}

export default async function PublicProfileShortPage({ params }: Props) {
  const resolved = await resolveProfile(params);
  if (!resolved?.data) notFound();

  return (
    <PublicProfilePage
      profile={resolved.data.profile}
      links={resolved.data.links}
      services={resolved.data.services}
      projects={resolved.data.projects}
      products={resolved.data.products}
    />
  );
}