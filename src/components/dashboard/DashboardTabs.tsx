"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { Database } from "@/lib/database.types";
import DashboardEditor from "./DashboardEditor";
import ServicesEditor from "./ServicesEditor";
import PortfolioEditor from "./PortfolioEditor";
import StoreEditor from "./StoreEditor";
import ContactEditor from "./ContactEditor";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type CreatorLink = Database["public"]["Tables"]["links"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];
type Project = Database["public"]["Tables"]["projects"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

type TabId = "profile" | "services" | "portfolio" | "store" | "contact";

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  {
    id: "profile",
    label: "Profile & Links",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21c.5-4 3.5-6 7-6s6.5 2 7 6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "services",
    label: "Services",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <path d="M13 2 4.5 13.5H11L9.5 22 19 9.5h-6.5L13 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5-10 10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "store",
    label: "Store",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <path d="M4 7h16l1 4a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0l1-4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 11v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function DashboardTabs({
  profile,
  links,
  services,
  projects,
  products,
  userId,
}: {
  profile: Profile | null;
  links: CreatorLink[];
  services: Service[];
  projects: Project[];
  products: Product[];
  userId: string;
}) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab: TabId = TABS.some((t) => t.id === tabParam) ? (tabParam as TabId) : "profile";

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-3xl border border-zinc-200 bg-white p-2 shadow-sm">
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <a
              key={t.id}
              href={`/dashboard?tab=${t.id}`}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </a>
          );
        })}
      </div>

      <div className="mt-8">
        {tab === "profile" && (
          <DashboardEditor profile={profile} links={links} userId={userId} />
        )}
        {tab === "services" && <ServicesEditor initialServices={services} userId={userId} />}
        {tab === "portfolio" && <PortfolioEditor initialProjects={projects} userId={userId} />}
        {tab === "store" && <StoreEditor initialProducts={products} userId={userId} />}
        {tab === "contact" && <ContactEditor initialProfile={profile} userId={userId} />}
      </div>
    </div>
  );
}