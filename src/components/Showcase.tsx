"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const showcaseLinks = [
  { label: "Design portfolio", color: "bg-rose-500", emoji: "🎨" },
  { label: "YouTube · 1.2M subs", color: "bg-red-600", emoji: "▶️" },
  { label: "Spotify playlist", color: "bg-green-600", emoji: "🎧" },
  { label: "Merch drop — limited", color: "bg-violet-600", emoji: "👕" },
  { label: "Newsletter", color: "bg-amber-500", emoji: "📬" },
];

export default function Showcase() {
  return (
    <section id="showcase" className="scroll-mt-24 overflow-hidden py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="A page that wows"
          title="Your fans see"
          accent="your best self"
          description="Every page is a mini website with your name, your vibe and every thing you love — one tap away."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mt-16"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-100 via-purple-100 to-amber-100 blur-3xl" />

          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-violet-900/15">
            <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-4 flex flex-1 items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm text-zinc-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
                creator-devance.page/alex
              </span>
              <span className="hidden text-sm font-semibold text-zinc-700 sm:block">
                ⚡ Live preview
              </span>
            </div>

            <div className="grid lg:grid-cols-[1fr_380px]">
              <div className="relative flex flex-col items-center overflow-hidden bg-gradient-to-b from-violet-100 via-white to-white px-6 py-14 text-center">
                <motion.div
                  aria-hidden="true"
                  animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-8 top-10 hidden rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-lg lg:block"
                >
                  <p className="text-xs font-semibold text-zinc-500">Subscribers</p>
                  <p className="text-xl font-extrabold text-foreground">1.2M</p>
                </motion.div>
                <motion.div
                  aria-hidden="true"
                  animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-8 top-16 hidden rounded-2xl border border-amber-100 bg-white px-4 py-3 shadow-lg lg:block"
                >
                  <p className="text-xs font-semibold text-zinc-500">Revenue</p>
                  <p className="text-xl font-extrabold text-foreground">$8.4k</p>
                </motion.div>

                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-4xl shadow-xl">
                  🧑‍🎨
                </div>
                <h3 className="mt-4 text-2xl font-bold text-foreground">
                  Alex Carter
                </h3>
                <p className="font-cursive text-lg text-primary">
                  designer · youtuber · dreamer
                </p>
                <p className="mt-2 max-w-sm text-sm text-zinc-600">
                  Building in public. Sharing what I learn, one pixel at a time.
                </p>

                <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
                  {showcaseLinks.map((link) => (
                    <div
                      key={link.label}
                      className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-md ${link.color}`}
                    >
                      <span>{link.emoji}</span>
                      {link.label}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-3 text-zinc-400">
                  {["𝕏", "in", "▶", "✉"].map((s, i) => (
                    <span
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold shadow-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden flex-col gap-4 border-l border-zinc-100 bg-zinc-50/60 p-8 lg:flex">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <p className="text-sm font-bold text-foreground">
                    📈 Performance
                  </p>
                  <div className="mt-4 flex h-24 items-end gap-2">
                    {[35, 55, 42, 70, 60, 85, 100].map((h, i) => (
                      <motion.span
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 + i * 0.07 }}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-primary to-primary-light"
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] font-medium text-zinc-400">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <p className="text-sm font-bold text-foreground">🎯 Top links</p>
                  <ul className="mt-3 space-y-3">
                    {[
                      { label: "Design portfolio", pct: 84, color: "bg-rose-500" },
                      { label: "YouTube", pct: 61, color: "bg-red-600" },
                      { label: "Merch drop", pct: 45, color: "bg-violet-600" },
                    ].map((row) => (
                      <li key={row.label}>
                        <div className="flex justify-between text-xs font-semibold text-zinc-600">
                          <span>{row.label}</span>
                          <span>{row.pct}%</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${row.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className={`h-full rounded-full ${row.color}`}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="/signup"
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-all hover:bg-zinc-800"
                >
                  Build your page
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h9.19L9.47 6.72a.75.75 0 1 1 1.06-1.06l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06l3.47-3.47H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}