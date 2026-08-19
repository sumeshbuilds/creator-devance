import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PublicProfilePage from "@/components/public/PublicProfilePage";
import {
  districtSlug,
  getPublicProfile,
  profileLongUrl,
  buildProfileMetadata,
} from "@/lib/public-profile";

type Props = {
  params: Promise<{ district: string; profession: string; username: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { district, profession, username } = await params;
  const data = await getPublicProfile(username);
  if (!data) return {};

  if (district !== districtSlug(data.profile.location) || profession !== data.profile.profession) {
    return {};
  }

  return {
    ...buildProfileMetadata(data.profile),
    alternates: { canonical: profileLongUrl(data.profile) },
    robots: { index: true, follow: true },
  };
}

export default async function PublicProfileCanonicalPage({ params }: Props) {
  const { district, profession, username } = await params;
  const data = await getPublicProfile(username);
  if (!data) notFound();

  if (district !== districtSlug(data.profile.location) || profession !== data.profile.profession) {
    redirect(profileLongUrl(data.profile));
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.profile.brand_name || data.profile.full_name,
    url: profileLongUrl(data.profile),
    image: data.profile.avatar_url,
    description: data.profile.bio ?? undefined,
    sameAs: [data.profile.instagram_url, data.profile.facebook_url, data.profile.youtube_url].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      addressRegion: "Odisha",
      addressLocality: data.profile.location,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicProfilePage
        profile={data.profile}
        links={data.links}
        services={data.services}
        projects={data.projects}
        products={data.products}
      />
    </>
  );
}
