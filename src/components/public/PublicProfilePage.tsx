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

function CardHeader({
  title,
  icon,
  count,
}: {
  title: string;
  icon: React.ReactNode;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <h2 className="text-base font-extrabold tracking-tight text-foreground">
        {title}
      </h2>
      {count !== undefined && (
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-500">
          {count}
        </span>
      )}
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
    <div className="flex flex-col gap-2 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition-colors hover:border-primary/20">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-foreground">{service.title}</h3>
        {price && (
          <span className="shrink-0 text-sm font-bold text-primary">
            {price}
          </span>
        )}
      </div>
      {service.description && (
        <p className="text-sm leading-relaxed text-zinc-600">
          {service.description}
        </p>
      )}
      <a
        href={waLinkFor(`Hi, I'm interested in your service: ${service.title}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
      >
        <WhatsAppIcon className="h-4 w-4" />
        Contact on WhatsApp
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
  if (project.media_type === "video") {
    return (
      <a
        href={normalizeUrl(project.media_url)}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-700 shadow-sm transition-transform hover:-translate-y-0.5"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-transform group-hover:scale-110">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-0.5 h-6 w-6"
          >
            <path d="M8 5.5v13l11-6.5-11-6.5z" />
          </svg>
        </span>
        {project.title && (
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 text-sm font-semibold text-white">
            {project.title}
          </span>
        )}
      </a>
    );
  }
  return (
    <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm transition-transform hover:-translate-y-0.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.media_url}
        alt={project.title || "Portfolio image"}
        className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${featured ? "" : ""}`}
      />
      {project.title && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 text-sm font-semibold text-white">
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
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-3xl">
            🛍️
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-foreground">{product.name}</h3>
          {price && (
            <span className="shrink-0 text-sm font-bold text-primary">
              {price}
            </span>
          )}
        </div>
        {product.description && (
          <p className="mt-1 text-sm leading-relaxed text-zinc-600">
            {product.description}
          </p>
        )}
        <a
          href={waLinkFor(
            `Hi, I want to order "${product.name}"${price ? ` (${price})` : ""}`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Order on WhatsApp
        </a>
      </div>
    </div>
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-white">
      <div className="relative h-44 w-full sm:h-52 md:h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerFor(profile.username)}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/5 to-white" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 pb-2 md:flex-row md:items-end md:gap-6">
          <div className="-mt-16 h-28 w-28 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-light text-4xl font-bold text-white shadow-xl shadow-primary/20 ring-4 ring-white md:-mt-20 md:h-32 md:w-32">
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

          <div className="flex flex-1 flex-col items-center gap-3 pt-2 text-center md:items-start md:pt-0 md:text-left">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {displayName}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
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
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              )}

              {SOCIALS.some((s) => profile[`${s.key}_url`]) && (
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
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
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
          <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-zinc-600 md:text-left">
            {profile.bio}
          </p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-5 pb-16 lg:grid-cols-12">
          {services.length > 0 && (
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-7">
              <CardHeader
                title="Services"
                count={services.length}
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path
                      d="M13 2 4.5 13.5H11l-1.5 8.5 9.5-12.5h-6.5L13 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
              <ul className="mt-5 flex flex-col gap-3">
                {services.map((service) => (
                  <li key={service.id}>
                    <ServiceCard
                      service={service}
                      waLinkFor={waLinkFor}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {links.length > 0 && (
            <section className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-primary/[0.03] to-white p-6 shadow-sm lg:col-span-5">
              <CardHeader
                title="Links"
                count={links.length}
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path
                      d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
              <ul className="mt-5 flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={normalizeUrl(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-zinc-100 bg-white px-4 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
                    >
                      <span className="truncate">{link.title}</span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4 shrink-0 text-zinc-300 transition-colors group-hover:text-primary"
                      >
                        <path
                          d="M7 17 17 7M8 7h9v9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {projects.length > 0 && (
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-12">
              <CardHeader
                title="Portfolio"
                count={projects.length}
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="3"
                    />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path
                      d="m21 15-5-5-10 10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
              <div className="mt-5 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[180px] lg:auto-rows-[200px] lg:grid-cols-6">
                {projects.map((project, i) => (
                  <div
                    key={project.id}
                    className={i === 0 ? "col-span-2 row-span-2" : ""}
                  >
                    <ProjectCard
                      project={project}
                      featured={i === 0}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {products.length > 0 && (
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-7">
              <CardHeader
                title="Store"
                count={products.length}
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path
                      d="M4 7h16l1 4a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0l1-4z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 11v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <section className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-primary/[0.03] to-white p-6 shadow-sm lg:col-span-5">
            <CardHeader
              title="Get in touch"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path
                    d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <div className="mt-5 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-zinc-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 shrink-0 text-zinc-400"
                >
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {PROFESSION_LABELS[profile.profession]} in{" "}
                {profile.location}, Odisha
              </div>

              {hasWhatsApp && (
                <a
                  href={waLinkFor(
                    "Hi, I found your page on devance and would like to connect.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              )}

              {SOCIALS.some((s) => profile[`${s.key}_url`]) && (
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
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
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
          </section>
        </div>

        <footer className="border-t border-zinc-100 py-8 text-center">
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
