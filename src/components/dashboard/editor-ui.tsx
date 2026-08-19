"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type FlashState = { type: "ok" | "err"; text: string } | null;

export function useFlash() {
  const [message, setMessage] = useState<FlashState>(null);

  function flash(text: string, type: "ok" | "err" = "ok") {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 2500);
  }

  return { message, flash };
}

export function FlashMessage({ message }: { message: FlashState }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            message.type === "ok"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-rose-200 bg-rose-50 text-rose-600"
          }`}
        >
          {message.text}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export const editorInputClass =
  "w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20";

export function PrimaryButton({
  children,
  savingLabel,
  saving,
  onClick,
}: {
  children: string;
  savingLabel: string;
  saving: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {saving ? savingLabel : children}
    </button>
  );
}

export function DangerButton({
  children,
  saving,
  onClick,
}: {
  children: string;
  saving: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}