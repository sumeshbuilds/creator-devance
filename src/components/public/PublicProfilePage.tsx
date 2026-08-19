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
import { parsePageSections } from "@/lib/public-profile";
import { formatPrice, waLink } from "@/lib/whatsapp";

type SocialKey = "instagram" | "facebook" | "youtube";

const SOCIALS: { key: SocialKey; label: string; path: string; brandClass: string }[] = [
  {
    key: "instagram",
    label: "Instagram",
    brandClass: "hover:bg-gradient-to-tr hover:from-amber-400 hover:via-pink-500 hover:to-purple-600",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    key: "facebook",
    label: "Facebook",
    brandClass: "hover:bg-[#1877f2]",
    path: "M22.676 0h-21.352c-.732 0-1.324.592-1.324 1.324v21.352c0 .732.592 1.324 1.324 1.324h11.494v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.732 0 1.324-.592 1.324-1.324v-21.352c0-.732-.592-1.324-1.324-1.324z",
  },
  {
    key: "youtube",
    label: "YouTube",
    brandClass: "hover:bg-[#ff0000]",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

const BANNER_IMAGE =
  "https://images.pexels.com/photos/33548814/pexels-photo-33548814.jpeg";

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

function hostOf(url: string) {
  try {
    return new URL(normalizeUrl(url)).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px]">
          ✦
        </span>
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

function ServiceCard({
  service,
  waLinkFor,
}: {
  service: PublicService;
  waLinkFor: (text: string) => string;
}) {
  const price = formatPrice(service.price);
  return (
    <article className="group flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <h3 className="text-lg font-bold text-zinc-900">{service.title}</h3>
      {price && (
        <span className="w-fit rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
          {price}
        </span>
      )}
      {service.description && (
        <p className="leading-relaxed text-zinc-500">{service.description}</p>
      )}
      <a
        href={waLinkFor(`Hi, I'm interested in your service: ${service.title}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        <WhatsAppIcon className="h-4 w-4" />
        Contact
      </a>
    </article>
  );
}

function ProjectCard({
  project,
  featured,
}: {
  project: PublicProject;
  featured?: boolean;
}) {
  const rounded = featured ? "rounded-3xl" : "rounded-2xl";
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
    <div className={`group relative h-full w-full overflow-hidden bg-zinc-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${rounded}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.media_url}
        alt={project.title || "Portfolio image"}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-zinc-950/0 transition-colors duration-300 group-hover:bg-zinc-950/20" />
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
          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
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
  const hasSocials = SOCIALS.some((s) => profile[`${s.key}_url`]);
  const sinceYear = profile.created_at
    ? new Date(profile.created_at).getFullYear()
    : null;
  const sections = parsePageSections(profile.page_sections);

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="relative h-48 w-full overflow-hidden sm:h-56 md:h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BANNER_IMAGE}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 md:-mt-20">
          <div className="rounded-3xl border border-zinc-200 bg-white px-6 pb-6 shadow-sm sm:px-8 md:px-10 md:pb-8">
            <div className="flex justify-center md:justify-start">
              <div className="relative -mt-14 h-28 w-28 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-light text-4xl font-bold text-white shadow-xl shadow-primary/20 ring-4 ring-white md:-mt-20 md:h-36 md:w-36">
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
                <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] text-primary shadow-sm ring-2 ring-white">
                  ✦
                </span>
              </div>
            </div>

            <div className="mt-4 text-center md:text-left">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
                {displayName}
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 sm:text-base">
                @{profile.username} ·{" "}
                {PROFESSION_LABELS[profile.profession]} in {profile.location}
                {sinceYear && <> · Since {sinceYear}</>}
              </p>
              <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                {hasWhatsApp && (
                  <a
                    href={waLinkFor(
                      "Hi, I found your page on devance and would like to connect.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700 sm:w-auto"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                )}
                {hasSocials && (
                  <div className="flex gap-2 sm:inline-flex">
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
                          className={`flex h-11 flex-1 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200 transition-all hover:-translate-y-0.5 hover:text-white sm:h-11 sm:w-11 sm:flex-none ${social.brandClass}`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5 sm:h-4 sm:w-4"
                            aria-hidden="true"
                          >
                            <path d={social.path} />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {profile.bio && (
              <p className="mt-6 text-lg leading-relaxed text-zinc-600">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        <div className="pb-8">
          {sections.map((key) => {
            if (key === "social") {
              if (!hasSocials && links.length === 0) return null;
              return (
            <section key="social" className="mt-16">
              <SectionHeading title="Social" />
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SOCIALS.map((social) => {
                  const url = profile[`${social.key}_url`];
                  if (!url) return null;
                  return (
                    <a
                      key={social.key}
                      href={normalizeUrl(url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-primary group-hover:text-white">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-6 w-6"
                          aria-hidden="true"
                        >
                          <path d={social.path} />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-bold text-zinc-900">
                          {social.label}
                        </span>
                        <span className="block truncate text-sm text-zinc-500">
                          {hostOf(url)}
                        </span>
                      </span>
                    </a>
                  );
                })}
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={normalizeUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-6 w-6"
                        aria-hidden="true"
                      >
                        <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-bold text-zinc-900">
                        {link.title}
                      </span>
                      <span className="block truncate text-sm text-zinc-500">
                        {hostOf(link.url)}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </section>
              );
            }

            if (key === "store") {
              if (products.length === 0 && services.length === 0) return null;
              return (
            <section
              key="store"
              className={`mt-16 grid gap-12 lg:gap-10 ${
                products.length > 0 && services.length > 0
                  ? "lg:grid-cols-[7fr_3fr]"
                  : "lg:grid-cols-1"
              }`}
            >
              {products.length > 0 && (
                <div>
                  <SectionHeading title="Store" />
                  <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        waLinkFor={waLinkFor}
                      />
                    ))}
                  </div>
                </div>
              )}

              {services.length > 0 && (
                <div>
                  <SectionHeading title="Services" />
                  <div className="mt-8 flex flex-col gap-4">
                    {services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        waLinkFor={waLinkFor}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
              );
            }

            if (key === "portfolio") {
              if (projects.length === 0) return null;
              return (
            <section key="portfolio" className="mt-16">
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
              );
            }
            return null;
          })}
        </div>

        <footer className="border-t border-zinc-200 py-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-primary"
          >
            <Logo className="[&>span]:hidden [&>svg]:h-6 [&>svg]:w-6" />
            Create your own page with devance
          </Link>
        </footer>
      </div>
    </main>
  );
}