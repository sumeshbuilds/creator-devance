"use client";

import { useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";
import {
  PAGE_SECTION_KEYS,
  DEFAULT_PAGE_SECTIONS,
  parsePageSections,
  type PageSectionKey,
} from "@/lib/public-profile";
import { PrimaryButton, FlashMessage, useFlash } from "./editor-ui";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const SECTION_META: Record<
  PageSectionKey,
  { label: string; description: string; icon: ReactNode }
> = {
  social: {
    label: "Social & Links",
    description: "Your social media icons and custom links.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M7 20a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13a3 3 0 0 1-3 3H7Zm0 0h8m-3-9 2-2 2 2m-2-2v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  store: {
    label: "Store & Services",
    description: "Your products (e-commerce) and services.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M4 7h16l1 4a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0l1-4Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 11v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" strokeLinecap="round" />
      </svg>
    ),
  },
  portfolio: {
    label: "Portfolio",
    description: "Your projects and work showcase.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5-10 10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        on ? "bg-primary" : "bg-zinc-300"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          on ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function MoveButton({
  direction,
  disabled,
  onClick,
  label,
}: {
  direction: "up" | "down";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-500"
    >
      {direction === "up" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path d="m5 15 7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path d="m5 9 7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

export default function PageLayoutEditor({
  initialProfile,
  userId,
}: {
  initialProfile: Profile | null;
  userId: string;
}) {
  const supabase = createClient();
  const { message, flash } = useFlash();

  const [sections, setSections] = useState<PageSectionKey[]>(() =>
    parsePageSections(initialProfile?.page_sections),
  );
  const [saving, setSaving] = useState(false);

  const hidden = PAGE_SECTION_KEYS.filter((key) => !sections.includes(key));
  const isDefault =
    sections.length === DEFAULT_PAGE_SECTIONS.length &&
    DEFAULT_PAGE_SECTIONS.every((key, i) => sections[i] === key);

  function move(key: PageSectionKey, direction: -1 | 1) {
    const idx = sections.indexOf(key);
    const next = idx + direction;
    if (idx < 0 || next < 0 || next >= sections.length) return;
    const copy = [...sections];
    [copy[idx], copy[next]] = [copy[next], copy[idx]];
    setSections(copy);
  }

  function show(key: PageSectionKey) {
    setSections((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  function hide(key: PageSectionKey) {
    setSections((prev) => prev.filter((k) => k !== key));
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ page_sections: sections })
      .eq("id", userId);
    setSaving(false);
    if (error) {
      flash(error.message, "err");
      return;
    }
    flash("Page layout saved");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Page layout
          </h1>
          <p className="mt-2 text-zinc-600">
            Choose which sections appear on your public page and in what order.
            Hide any section you don&apos;t need — your page, your rules.
          </p>
        </div>
        <FlashMessage message={message} />
      </div>

      <section className="mt-6 max-w-3xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-foreground">Visible sections</h2>
          {!isDefault && (
            <button
              type="button"
              onClick={() => setSections([...DEFAULT_PAGE_SECTIONS])}
              className="text-sm font-semibold text-primary transition-colors hover:text-primary-light"
            >
              Reset to default
            </button>
          )}
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          Drag priority with the arrows. The top row appears first on your page.
        </p>

        {sections.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center text-sm text-zinc-500">
            No sections shown. Everything below is hidden — add one back to
            start.
          </div>
        )}

        <ol className="mt-6 flex flex-col gap-3">
          {sections.map((key, index) => {
            const meta = SECTION_META[key];
            return (
              <li
                key={key}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                  {index + 1}
                </span>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                  {meta.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground">{meta.label}</p>
                  <p className="text-sm text-zinc-500">{meta.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <MoveButton
                    direction="up"
                    disabled={index === 0}
                    onClick={() => move(key, -1)}
                    label={`Move ${meta.label} up`}
                  />
                  <MoveButton
                    direction="down"
                    disabled={index === sections.length - 1}
                    onClick={() => move(key, 1)}
                    label={`Move ${meta.label} down`}
                  />
                  <Toggle
                    on
                    onClick={() => hide(key)}
                    label={`Hide ${meta.label}`}
                  />
                </div>
              </li>
            );
          })}
        </ol>

        {hidden.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
              Hidden
            </h3>
            <div className="mt-3 flex flex-col gap-3">
              {hidden.map((key) => {
                const meta = SECTION_META[key];
                return (
                  <div
                    key={key}
                    className="flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-zinc-400">
                      {meta.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-zinc-400">{meta.label}</p>
                      <p className="text-sm text-zinc-400">
                        {meta.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => show(key)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:border-primary hover:text-primary"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                      Show
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <PrimaryButton saving={saving} savingLabel="Saving…" onClick={save}>
            Save layout
          </PrimaryButton>
          <p className="text-sm text-zinc-400">
            Saved order:{" "}
            {sections.length === 0 ? (
              "nothing shown"
            ) : (
              sections.map((k) => SECTION_META[k].label).join(" → ")
            )}
          </p>
        </div>
      </section>
    </div>
  );
}