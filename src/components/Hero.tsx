"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const heroLinks = [
  { label: "Latest YouTube video", emoji: "🎬", color: "#ef4444" },
  { label: "My music on Spotify", emoji: "🎧", color: "#22c55e" },
  { label: "Free starter templates", emoji: "📦", color: "#8b5cf6" },
  { label: "Book a 1:1 session", emoji: "📅", color: "#f59e0b" },
  { label: "Join the Discord", emoji: "💬", color: "#3b82f6" },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-36 pb-20 sm:pt-40 lg:pt-44"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-50 via-white to-white"
      />
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full text-violet-100/60"
      >
        <defs>
          <pattern
            id="grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M48 0H0V48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 right-[-10%] -z-10 h-96 w-96 rounded-full bg-primary-light/30 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[-10%] -z-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-primary shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            The link-in-bio, reimagined
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            Every link. One place.{" "}
            <span className="font-cursive font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Your brand.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-600"
          >
            creator-devance turns every bio into your own mini website. Share
            your content, sell your products and grow your audience — all from
            a single, beautiful link.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-light"
            >
              Start creating — it&apos;s free
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h9.19L9.47 6.72a.75.75 0 1 1 1.06-1.06l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06l3.47-3.47H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#showcase"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-7 py-3.5 text-base font-semibold text-zinc-800 transition-colors hover:border-violet-300 hover:bg-violet-50"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M9 18V6l12 6-12 6Z" strokeLinejoin="round" />
              </svg>
              See it live
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[
                { i: "A", c: "bg-violet-500" },
                { i: "B", c: "bg-amber-400" },
                { i: "C", c: "bg-emerald-500" },
                { i: "D", c: "bg-rose-500" },
              ].map((a) => (
                <span
                  key={a.i}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white ${a.c}`}
                >
                  {a.i}
                </span>
              ))}
            </div>
            <p className="text-sm text-zinc-600">
              <span className="font-bold text-foreground">2M+ creators</span>{" "}
              trust creator-devance
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <PhoneMockup />

          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-8 top-10 hidden rounded-2xl border border-zinc-100 bg-white p-4 shadow-xl shadow-zinc-900/10 sm:block"
          >
            <p className="text-xs font-semibold text-zinc-500">Clicks today</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">1,284</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path
                  fillRule="evenodd"
                  d="M10 17a.75.75 0 0 1-.75-.75V5.61L5.29 9.6a.75.75 0 0 1-1.06-1.06l5.25-5.25a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 1 1-1.06 1.06l-3.97-3.99v10.64c0 .414-.33.75-.75.75Z"
                  clipRule="evenodd"
                />
              </svg>
              +38% this week
            </p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute -right-6 bottom-16 hidden items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-3 pr-5 shadow-xl shadow-zinc-900/10 sm:flex"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-lg">
              🎉
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">New follower</p>
              <p className="text-xs text-zinc-500">@devstudio · just now</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border-[10px] border-zinc-900 bg-white shadow-2xl shadow-violet-900/30">
      <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-zinc-900" />
      <div className="flex flex-col items-center bg-gradient-to-b from-violet-50 to-white px-6 pb-8 pt-12">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-3xl shadow-lg">
          ✨
        </div>
        <p className="mt-3 text-lg font-bold text-foreground">Alex Carter</p>
        <p className="font-cursive text-base text-primary">@alexcreates</p>

        <div className="mt-6 flex w-full flex-col gap-2.5">
          {heroLinks.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-md"
              style={{ backgroundColor: link.color }}
            >
              <span className="text-base">{link.emoji}</span>
              {link.label}
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 text-zinc-400">
          {["⬡", "▶", "✉", "●"].map((s, i) => (
            <span
              key={i}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}