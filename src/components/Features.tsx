"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const features = [
  {
    title: "Link Manager",
    description:
      "Add, reorder and style unlimited links in seconds — no code required.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Beautiful Themes",
    description:
      "Pick from 20+ hand-crafted themes or make it fully yours with custom colors and fonts.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26 5.4 5.4 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1Z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Smart Analytics",
    description:
      "Track clicks, geography and device breakdowns with beautiful real-time dashboards.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m7 15 4-6 4 3 5-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "QR Codes",
    description:
      "Generate scannable QR codes for print, packaging and in-person events — for free.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3h-3zM21 14v.01M14 21h.01M17 21h4v-4" strokeLinecap="round" />
      </svg>
    ),
    color: "bg-sky-100 text-sky-600",
  },
  {
    title: "Monetization",
    description:
      "Collect donations, sell products and unlock paid content directly from your page.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "bg-rose-100 text-rose-600",
  },
  {
    title: "Smart Scheduling",
    description:
      "Show specific links at specific times — perfect for launches, streams and tours.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "bg-indigo-100 text-indigo-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Everything you need"
          title="Built for the modern"
          accent="creator"
          description="Stop juggling link-in-bio tools, landing pages and social sites. creator-devance brings it all together."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm transition-shadow hover:shadow-xl hover:shadow-violet-900/10"
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.color} transition-transform group-hover:scale-110`}
              >
                {feature.icon}
              </span>
              <h3 className="mt-5 text-xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 leading-relaxed text-zinc-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}