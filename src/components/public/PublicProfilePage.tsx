import Link from "next/link";
import Logo from "@/components/Logo";
import type { PublicLink, PublicProfile } from "@/lib/public-profile";
import { PROFESSION_LABELS } from "@/lib/auth-constants";

type SocialKey = "instagram" | "facebook" | "youtube";

const SOCIALS: { key: SocialKey; label: string; href: string; path: string }[] = [
  {
    key: "instagram",
    label: "Instagram",
    href: "https://instagram.com",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm4.5-2.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
  },
  {
    key: "facebook",
    label: "Facebook",
    href: "https://facebook.com",
    path: "M13.4 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.8H7.7v2.8h2.4V21h3.3z",
  },
  {
    key: "youtube",
    label: "YouTube",
    href: "https://youtube.com",
    path: "M23 7.6s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.6 4 12 4 12 4s-4.6 0-7.7.3c-.5.1-1.5.1-2.4 1-.7.7-.9 2.3-.9 2.3S.8 9.5.8 11.3v1.4c0 1.8.2 3.7.2 3.7s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 7.5.2 7.5.2s4.6 0 7.7-.2c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.7v-1.4c0-1.8-.2-3.7-.2-3.7zM9.7 15.3V8.7l6.4 3.3-6.4 3.3z",
  },
];

function initialsOf(name: string) {
  return (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function normalizeUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export default function PublicProfilePage({
  profile,
  links,
}: {
  profile: PublicProfile;
  links: PublicLink[];
}) {
  const displayName = profile.brand_name || profile.full_name;

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center px-4 py-12 sm:py-16">
        <div className="flex w-full flex-col items-center">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-light text-4xl font-bold text-white shadow-lg shadow-primary/30 ring-4 ring-white">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={`${displayName} avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              initialsOf(displayName)
            )}
          </div>

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground">
            {displayName}
          </h1>
          <p className="mt-1 text-zinc-500">
            @{profile.username} ·{" "}
            {PROFESSION_LABELS[profile.profession]} in {profile.location}
          </p>

          {profile.bio && (
            <p className="mt-4 text-center leading-relaxed text-zinc-600">
              {profile.bio}
            </p>
          )}

          {SOCIALS.some((s) => profile[`${s.key}_url`]) && (
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((social) => {
                const url = profile[`${social.key}_url`];
                if (!url) return null;
                return (
                  <a
                    key={social.key}
                    href={normalizeUrl(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <path d={social.path} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                );
              })}
            </div>
          )}

          <ul className="mt-8 flex w-full flex-col gap-3">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={normalizeUrl(link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
                >
                  <span className="truncate">{link.title}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4 shrink-0 text-zinc-400 transition-colors group-hover:text-primary"
                  >
                    <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            ))}
            {links.length === 0 && (
              <li className="rounded-2xl border border-dashed border-zinc-200 px-5 py-6 text-center text-sm text-zinc-400">
                No links yet.
              </li>
            )}
          </ul>
        </div>

        <footer className="mt-auto pt-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-primary"
          >
            <Logo className="[&>span]:hidden [&>svg]:h-6 [&>svg]:w-6" />
            Create your own page
          </Link>
        </footer>
      </div>
    </main>
  );
}