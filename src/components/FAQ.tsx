"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const faqs = [
  {
    q: "Is creator-devance really free?",
    a: "Yes! The Starter plan is free forever with unlimited links. You only pay when you want advanced features like analytics insights, monetization or a custom domain.",
  },
  {
    q: "Can I use my own domain?",
    a: "Absolutely. On Creator+ you can connect any custom domain you own, with free SSL included. Your page keeps working exactly as before.",
  },
  {
    q: "Will my page work on all devices?",
    a: "Every page is fully responsive and loads instantly on phones, tablets and desktops. Your fans always get the best experience.",
  },
  {
    q: "How do payments and donations work?",
    a: "creator-devance integrates with Stripe so you can collect donations and sell digital products directly from your page. Fees are transparent — you keep the majority of what you earn.",
  },
  {
    q: "Can I migrate from another link-in-bio tool?",
    a: "Yes, importing your existing links takes a single click. We support most major platforms, and your new page will be live in under a minute.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Questions, answered"
          title="Frequently asked"
          accent="questions"
        />

        <div className="mt-14 flex flex-col gap-4">
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  open
                    ? "border-violet-200 bg-violet-50/60"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={open}
                >
                  <span className="font-semibold text-foreground">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      open
                        ? "bg-primary text-white"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p className="px-6 pb-6 leading-relaxed text-zinc-600">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}