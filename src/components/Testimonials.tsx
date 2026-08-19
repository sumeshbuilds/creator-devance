"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const testimonials = [
  {
    quote:
      "I replaced three tools with one page. My engagement went up 40% the first month and my merch finally sells itself.",
    name: "Maya Lin",
    role: "YouTuber · 850k subs",
    initials: "ML",
    color: "bg-violet-500",
  },
  {
    quote:
      "The analytics are genuinely addicting. I can see exactly which link my followers love — and lean into it.",
    name: "Jordi Santos",
    role: "Podcast host",
    initials: "JS",
    color: "bg-amber-500",
  },
  {
    quote:
      "As a musician, my page is my storefront, my tour bus and my fan club all in one. It's beautiful and it just works.",
    name: "Aria Bennett",
    role: "Independent artist",
    initials: "AB",
    color: "bg-emerald-500",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24 bg-violet-950 py-24 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Loved by creators"
          title="Don't take our word"
          accent="for it"
          description="Hundreds of thousands of creators grow their audience with creator-devance every day."
          dark
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
            >
              <div>
                <div className="flex gap-1 text-amber-400" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M10 1.5 12.9 7.4l6.1.9-4.4 4.3 1 6-5.6-3-5.6 3 1-6L1 8.3l6.1-.9Z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 leading-relaxed text-violet-100">
                  “{t.quote}”
                </blockquote>
              </div>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${t.color}`}
                >
                  {t.initials}
                </span>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-violet-300">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}