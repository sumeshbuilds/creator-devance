"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section id="cta" className="scroll-mt-24 px-4 pb-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-700 via-primary to-primary px-8 py-20 text-center text-white shadow-2xl shadow-violet-900/40 sm:px-16"
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full text-white/10"
        >
          <defs>
            <pattern
              id="cta-grid"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M36 0H0V36"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>

        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -16, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-6 top-10 rounded-2xl bg-white/10 px-5 py-4 text-left backdrop-blur-sm"
        >
          <p className="text-xs text-violet-100">New follower</p>
          <p className="text-lg font-bold">@yourfan 💜</p>
        </motion.div>
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, 14, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-4 bottom-12 rounded-2xl bg-white/10 px-5 py-4 text-right backdrop-blur-sm"
        >
          <p className="text-xs text-violet-100">Clicks today</p>
          <p className="text-lg font-bold">+2,148 ⚡</p>
        </motion.div>

        <div className="relative">
          <p className="font-cursive text-3xl font-semibold text-amber-300">
            Your fans are waiting
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            Put your whole world behind one link.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-violet-100">
            Join 2M+ creators who turned their bio into a destination. Free to
            start, live in 60 seconds.
          </p>

          <a
            href="/signup"
            className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <span className="flex flex-1 items-center rounded-full border border-white/30 bg-white/15 px-5 py-3.5 text-left text-white placeholder-violet-200 backdrop-blur-sm transition-colors">
              your@email.com
            </span>
            <button
              type="button"
              className="rounded-full bg-white px-7 py-3.5 font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Claim your link
            </button>
          </a>
          <p className="mt-4 text-sm text-violet-200">
            No credit card required · Set up in under a minute
          </p>
        </div>
      </motion.div>
    </section>
  );
}