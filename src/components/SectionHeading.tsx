"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  dark?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-2xl text-center"
    >
      <p className="font-cursive text-2xl font-semibold text-primary">
        {eyebrow}
      </p>
      <h2
        className={`mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl ${
          dark ? "text-white" : "text-foreground"
        }`}
      >
        {title}{" "}
        {accent && (
          <span className="font-cursive bg-gradient-to-r from-primary to-primary-light bg-clip-text font-semibold text-transparent">
            {accent}
          </span>
        )}
      </h2>
      {description && (
        <p
          className={`mt-4 text-lg leading-relaxed ${
            dark ? "text-violet-200" : "text-zinc-600"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}