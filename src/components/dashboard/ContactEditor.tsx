"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";
import { waLink } from "@/lib/whatsapp";
import { PrimaryButton, editorInputClass, FlashMessage, useFlash } from "./editor-ui";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function ContactEditor({
  initialProfile,
  userId,
}: {
  initialProfile: Profile | null;
  userId: string;
}) {
  const supabase = createClient();
  const { message, flash } = useFlash();

  const [number, setNumber] = useState(initialProfile?.whatsapp_number ?? "");
  const [saving, setSaving] = useState(false);

  const digits = number.replace(/\D/g, "");
  const previewLink = waLink(number, "Hi, I found your page on devance and would like to connect.");

  async function save() {
    if (digits.length < 10) {
      flash("Please enter a valid WhatsApp number.", "err");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ whatsapp_number: digits })
      .eq("id", userId);
    setSaving(false);
    if (error) {
      flash(error.message, "err");
      return;
    }
    setNumber(digits);
    flash("Contact saved");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Contact</h1>
          <p className="mt-2 text-zinc-600">
            Add your WhatsApp number to show a contact button on your page. Services and products
            use it too, so customers can reach you directly.
          </p>
        </div>
        <FlashMessage message={message} />
      </div>

      <section className="mt-6 max-w-2xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-foreground">WhatsApp number</h2>
        <p className="mt-2 text-zinc-600">
          Include your country code. For India, that is{" "}
          <span className="font-semibold text-zinc-800">91</span> followed by your 10-digit number,
          e.g. <span className="font-semibold text-zinc-800">919876543210</span>.
        </p>

        <div className="mt-6">
          <label htmlFor="whatsappNumber" className="mb-1.5 block text-sm font-semibold text-zinc-700">
            WhatsApp number
          </label>
          <input
            id="whatsappNumber"
            type="tel"
            inputMode="numeric"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="919876543210"
            className={editorInputClass}
          />
        </div>

        {previewLink && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <svg viewBox="0 0 24 24" fill="#25D366" className="h-6 w-6 shrink-0">
              <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35zM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.97.99-3.63-.24-.37a9.77 9.77 0 0 1-1.5-5.22c0-5.4 4.4-9.8 9.83-9.8a9.77 9.77 0 0 1 9.8 9.81c0 5.4-4.39 9.78-9.79 9.78zm8.24-18.02A11.75 11.75 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.64a11.9 11.9 0 0 0 5.75 1.46h.01c6.55 0 11.89-5.33 11.89-11.9 0-3.18-1.24-6.16-3.64-8.4z" />
            </svg>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-emerald-800">Preview</p>
              <a
                href={previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-sm text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-600"
              >
                {previewLink}
              </a>
            </div>
          </div>
        )}

        <div className="mt-6">
          <PrimaryButton saving={saving} savingLabel="Saving…" onClick={save}>
            Save contact
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}