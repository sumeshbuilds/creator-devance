import Link from "next/link";
import Logo from "@/components/Logo";
import type {
  PublicLink,
  PublicProduct,
  PublicProfile,
  PublicProject,
  PublicService,
} from "@/lib/public-profile";
import { PROFESSION_LABELS } from "@/lib/auth-constants";
import { formatPrice, waLink } from "@/lib/whatsapp";

type SocialKey = "instagram" | "facebook" | "youtube";

const SOCIALS: { key: SocialKey; label: string; path: string }[] = [
  {
    key: "instagram",
    label: "Instagram",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm4.5-2.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
  },
  {
    key: "facebook",
    label: "Facebook",
    path: "M13.4 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.8H7.7v2.8h2.4V21h3.3z",
  },
  {
    key: "youtube",
    label: "YouTube",
    path: "M23 7.6s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.6 4 12 4 12 4s-4.6 0-7.7.3c-.5.1-1.5.1-2.4 1-.7.7-.9 2.3-.9 2.3S.8 9.5.8 11.3v1.4c0 1.8.2 3.7.2 3.7s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 7.5.2 7.5.2s4.6 0 7.7-.2c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.7v-1.4c0-1.8-.2-3.7-.2-3.7zM9.7 15.3V8.7l6.4 3.3-6.4 3.3z",
  },
];

const BANNERS = [
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
];

function bannerFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return BANNERS[hash % BANNERS.length];
}

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

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        {title}
      </p>
      <span className="h-px flex-1 bg-zinc-200" />
    </div>
  );
}

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35zM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.97.99-3.63-.24-.37a9.77 9.77 0 0 1-1.5-5.22c0-5.4 4.4-9.8 9.83-9.8a9.77 9.77 0 0 1 9.8 9.81c0 5.4-4.39 9.78-9.79 9.78zm8.24-18.02A11.75 11.75 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.64a11.9 11.9 0 0 0 5.75 1.46h.01c6.55 0 11.89-5.33 11.89-11.9 0-3.18-1.24-6.16-3.64-8.4z" />
    </svg>
  );
}

function ServiceRow({
  service,
  waLinkFor,
}: {
  service: PublicService;
  waLinkFor: (text: string) => string;
}) {
  const price = formatPrice(service.price);
  return (
    <div className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      <div className="max-w-2xl">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-lg font-bold text-zinc-900">{service.title}</h3>
          {price && <span className="text-sm font-bold text-primary">{price}</span>}
        </div>
        {service.description && (
          <p className="mt-1.5 leading-relaxed text-zinc-500">
            {service.description}
          </p>
        )}
      </div>
      <a
        href={waLinkFor(`Hi, I'm interested in your service: ${service.title}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-emerald-600/30 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white sm:self-auto"
      >
        <WhatsAppIcon className="h-4 w-4" />
        Contact
      </a>
    </div>
  );
}

function ProjectCard({
  project,
  featured,
}: {
  project: PublicProject;
  featured?: boolean;
}) {
  const rounded = featured
    ? "rounded-3xl"
    : "rounded-2xl";
  if (project.media_type === "video") {
    return (
      <a
        href={normalizeUrl(project.media_url)}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-700 shadow-sm transition-transform hover:-translate-y-1 ${rounded}`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-transform group-hover:scale-110">
          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-6 w-6">
            <path d="M8 5.5v13l11-6.5-11-6.5z" />
          </svg>
        </span>
        {project.title && (
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10 text-sm font-semibold text-white">
            {project.title}
          </span>
        )}
      </a>
    );
  }
  return (
    <div className={`group relative h-full w-full overflow-hidden bg-zinc-100 shadow-sm transition-transform hover:-translate-y-1 ${rounded}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.media_url}
        alt={project.title || "Portfolio image"}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {project.title && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10 text-sm font-semibold text-white">
          {project.title}
        </span>
      )}
    </div>
  );
}

function ProductCard({
  product,
  waLinkFor,
}: {
  product: PublicProduct;
  waLinkFor: (text: string) => string;
}) {
  const price = formatPrice(product.price);
  return (
    <article className="group">
      <div className="aspect-square overflow-hidden rounded-3xl bg-zinc-100">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-3xl">
            🛍️
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-zinc-900">{product.name}</h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-500">
              {product.description}
            </p>
          )}
        </div>
        {price && (
          <span className="shrink-0 text-sm font-bold text-primary">
            {price}
          </span>
        )}
      </div>
      <a
        href={waLinkFor(
          `Hi, I want to order "${product.name}"${price ? ` (${price})` : ""}`,
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        <WhatsAppIcon className="h-4 w-4" />
        Order on WhatsApp
      </a>
    </article>
  );
}

export default function PublicProfilePage({
  profile,
  links,
  services,
  projects,
  products,
}: {
  profile: PublicProfile;
  links: PublicLink[];
  services: PublicService[];
  projects: PublicProject[];
  products: PublicProduct[];
}) {
  const displayName = profile.brand_name || profile.full_name;
  const hasWhatsApp = Boolean(profile.whatsapp_number);
  const waLinkFor = (text: string) => waLink(profile.whatsapp_number ?? "", text);
  const firstName = displayName.split(" ")[0];
  const hasSocials = SOCIALS.some((s) => profile[`${s.key}_url`]);

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="relative h-48 w-full overflow-hidden sm:h-56 md:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerFor(profile.username)}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/25 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-5 md:flex-row md:items-end md:gap-8">
          <div className="-mt-14 h-28 w-28 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-light text-4xl font-bold text-white shadow-xl shadow-primary/20 ring-4 ring-zinc-50 md:-mt-20 md:h-36 md:w-36">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={`${displayName} avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                {initialsOf(displayName)}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center gap-4 pt-3 text-center md:items-start md:pt-4 md:text-left">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
                {displayName}
              </h1>
              <p className="mt-2 text-zinc-500">
                @{profile.username} ·{" "}
                {PROFESSION_LABELS[profile.profession]} in {profile.location}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {hasWhatsApp && (
                <a
                  href={waLinkFor(
                    "Hi, I found your page on devance and would like to connect.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              )}

              {hasSocials && (
                <div className="flex items-center gap-2">
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
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-zinc-500 shadow-sm ring-1 ring-zinc-200 transition-all hover:-translate-y-0.5 hover:text-primary hover:ring-primary/40"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-5 w-5"
                        >
                          <path
                            d={social.path}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {profile.bio && (
          <p className="mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-zinc-600 md:text-left">
            {profile.bio}
          </p>
        )}

        <div className="pb-8">
          {links.length > 0 && (
            <section className="mt-16">
              <SectionHeading title="Links" />
              <div className="mt-4 flex flex-col">
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={normalizeUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 border-b border-zinc-200 py-5 text-base font-semibold text-zinc-900 transition-colors hover:text-primary"
                  >
                    <span className="flex items-center gap-3">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary/70" />
                      <span className="truncate">{link.title}</span>
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4 shrink-0 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                    >
                      <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ))}
              </div>
            </section>
          )}

          {services.length > 0 && (
            <section className="mt-16">
              <SectionHeading title="Services" />
              <div className="mt-2 divide-y divide-zinc-200">
                {services.map((service) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    waLinkFor={waLinkFor}
                  />
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="mt-16">
              <SectionHeading title="Portfolio" />
              <div className="mt-6 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[170px] lg:auto-rows-[190px] lg:grid-cols-4">
                {projects.map((project, i) => (
                  <div
                    key={project.id}
                    className={i === 0 ? "col-span-2 row-span-2" : ""}
                  >
                    <ProjectCard project={project} featured={i === 0} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {products.length > 0 && (
            <section className="mt-16">
              <SectionHeading title="Store" />
              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    waLinkFor={waLinkFor}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="relative mt-20 overflow-hidden rounded-[2.5rem] bg-primary px-6 py-14 text-center shadow-xl shadow-primary/20 sm:px-14 sm:py-16">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-light/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Let&apos;s work together
              </p>
              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Start a conversation with {firstName}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/80">
                {PROFESSION_LABELS[profile.profession]} based in{" "}
                {profile.location}, Odisha — reach out anytime.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {hasWhatsApp && (
                  <a
                    href={waLinkFor(
                      "Hi, I found your page on devance and would like to connect.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-900 shadow-lg transition-colors hover:bg-zinc-100"
                  >
                    <WhatsAppIcon className="h-5 w-5 text-emerald-600" />
                    Chat on WhatsApp
                  </a>
                )}

                {hasSocials && (
                  <div className="flex items-center gap-2">
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
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 transition-all hover:-translate-y-0.5 hover:bg-white/20"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-5 w-5"
                          >
                            <path
                              d={social.path}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <footer className="border-t border-zinc-200 py-10 text-center">
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