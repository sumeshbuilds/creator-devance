"use client";

import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function AuthShell({
  children,
  heading,
  accent,
  sub,
}: {
  children: React.ReactNode;
  heading: string;
  accent: string;
  sub: string;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
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
            id="auth-grid"
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
        <rect width="100%" height="100%" fill="url(#auth-grid)" />
      </svg>
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -24, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary-light/30 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 24, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
      />

      <motion.a
        href="/"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Logo />
      </motion.a>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-violet-900/5 sm:p-10"
      >
        <p className="font-cursive text-2xl font-semibold text-primary">
          {heading}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
          {accent}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{sub}</p>
        <div className="mt-8">{children}</div>
      </motion.div>
    </div>
  );
}