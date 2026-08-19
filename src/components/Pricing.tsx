"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "/forever",
    tagline: "For creators getting started",
    features: [
      "1 page · unlimited links",
      "Custom themes & fonts",
      "QR code generator",
      "Basic analytics",
      "Community support",
    ],
    cta: "Start for free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$8",
    period: "/month",
    tagline: "For serious creators",
    features: [
      "Everything in Starter",
      "Advanced analytics & insights",
      "Link scheduling",
      "Monetization & donations",
      "Remove creator-devance branding",
      "Priority support",
    ],
    cta: "Go Pro",
    featured: true,
  },
  {
    name: "Creator+",
    price: "$19",
    period: "/month",
    tagline: "For brands & teams",
    features: [
      "Everything in Pro",
      "Up to 5 pages",
      "Custom domain & SSL",
      "Team collaboration",
      "A/B testing",
      "Dedicated account manager",
    ],
    cta: "Get Creator+",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-zinc-50 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Simple pricing"
          title="Pay for"
          accent="impact"
          description="Start free, upgrade when you're ready. No hidden fees, cancel anytime."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                tier.featured
                  ? "border-transparent bg-gradient-to-b from-violet-600 to-primary text-white shadow-2xl shadow-violet-900/40"
                  : "border-zinc-200 bg-white text-foreground shadow-sm"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-white shadow-lg">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-bold">{tier.name}</h3>
              <p
                className={`mt-1 text-sm ${
                  tier.featured ? "text-violet-200" : "text-zinc-500"
                }`}
              >
                {tier.tagline}
              </p>
              <p className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-extrabold tracking-tight">
                  {tier.price}
                </span>
                <span
                  className={`mb-1.5 text-sm ${
                    tier.featured ? "text-violet-200" : "text-zinc-500"
                  }`}
                >
                  {tier.period}
                </span>
              </p>

              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        tier.featured ? "text-amber-300" : "text-emerald-500"
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.79a1 1 0 0 1 1.4 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span
                      className={tier.featured ? "text-violet-50" : "text-zinc-600"}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="/signup"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                  tier.featured
                    ? "bg-white text-primary hover:-translate-y-0.5 hover:bg-zinc-100"
                    : "bg-primary text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:bg-primary-light"
                }`}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}