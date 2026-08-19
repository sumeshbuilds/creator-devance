"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    number: "01",
    title: "Create your page",
    description:
      "Sign up free, pick your username and choose a theme that feels like you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "from-violet-500 to-purple-600",
  },
  {
    number: "02",
    title: "Add your links",
    description:
      "Drop in your YouTube, Spotify, store, newsletter — anything. Rearrange in a drag-and-drop.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "from-amber-400 to-orange-500",
  },
  {
    number: "03",
    title: "Share & grow",
    description:
      "Put your one link in every bio. Track clicks and keep growing with insights.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: "from-emerald-400 to-teal-500",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-gradient-to-b from-violet-50/60 to-white py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Dead simple"
          title="Up and running in"
          accent="three steps"
        />

        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          <svg
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-10 hidden h-0.5 text-violet-200 md:block"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
          >
            <line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" strokeDasharray="4 4" />
          </svg>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div
                className={`relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}
              >
                {step.icon}
              </div>
              <p className="font-cursive mt-6 text-xl font-semibold text-primary">
                Step {step.number}
              </p>
              <h3 className="mt-1 text-xl font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xs leading-relaxed text-zinc-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}