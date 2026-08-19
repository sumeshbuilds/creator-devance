"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";
import { formatPrice } from "@/lib/whatsapp";
import {
  DangerButton,
  PrimaryButton,
  editorInputClass,
  FlashMessage,
  useFlash,
} from "./editor-ui";

type Service = Database["public"]["Tables"]["services"]["Row"];
type Selection = { kind: "new" } | { kind: "edit"; id: string };

export default function ServicesEditor({
  initialServices,
  userId,
}: {
  initialServices: Service[];
  userId: string;
}) {
  const supabase = createClient();
  const { message, flash } = useFlash();

  const [services, setServices] = useState<Service[]>(initialServices);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);

  function openNew() {
    setSelection({ kind: "new" });
    setTitle("");
    setDescription("");
    setPrice("");
  }

  function openEdit(service: Service) {
    setSelection({ kind: "edit", id: service.id });
    setTitle(service.title);
    setDescription(service.description ?? "");
    setPrice(service.price ?? "");
  }

  async function save() {
    if (!title.trim()) {
      flash("Title is required.", "err");
      return;
    }
    setSaving(true);
    const values = {
      title: title.trim(),
      description: description.trim() || null,
      price: price.trim() || null,
    };
    if (selection?.kind === "edit") {
      const { error } = await supabase
        .from("services")
        .update(values)
        .eq("id", selection.id);
      setSaving(false);
      if (error) {
        flash(error.message, "err");
        return;
      }
      setServices((list) =>
        list.map((s) => (s.id === selection.id ? { ...s, ...values } : s)),
      );
      flash("Service updated");
    } else {
      const maxPos = services.reduce((max, s) => Math.max(max, s.position), -1);
      const { data, error } = await supabase
        .from("services")
        .insert({ profile_id: userId, ...values, position: maxPos + 1 })
        .select()
        .single();
      setSaving(false);
      if (error || !data) {
        flash(error?.message ?? "Could not add the service.", "err");
        return;
      }
      setServices((list) => [...list, data]);
      setSelection({ kind: "edit", id: data.id });
      flash("Service added");
    }
  }

  async function remove() {
    if (selection?.kind !== "edit") return;
    setSaving(true);
    const { error } = await supabase.from("services").delete().eq("id", selection.id);
    setSaving(false);
    if (error) {
      flash(error.message, "err");
      return;
    }
    setServices((list) => list.filter((s) => s.id !== selection.id));
    setSelection(null);
    flash("Service deleted");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Services</h1>
          <p className="mt-2 text-zinc-600">
            What you offer — video creation, promotional reels, custom art… Each service gets a
            WhatsApp contact button on your page.
          </p>
        </div>
        <FlashMessage message={message} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <p className="px-2 pb-2 pt-1 text-xs font-bold uppercase tracking-wider text-zinc-400">
            Your services
          </p>
          {services.length === 0 && (
            <p className="rounded-2xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
              No services yet. Add your first one.
            </p>
          )}
          <ul className="flex flex-col gap-1.5">
            {services.map((service) => {
              const active = selection?.kind === "edit" && selection.id === service.id;
              return (
                <li key={service.id}>
                  <button
                    type="button"
                    onClick={() => openEdit(service)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <path d="M13 2 4.5 13.5H11L9.5 22 19 9.5h-6.5L13 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-foreground">
                        {service.title}
                      </span>
                      <span className="block truncate text-sm text-zinc-500">
                        {formatPrice(service.price) ?? "No price"}
                      </span>
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto h-4 w-4 shrink-0 text-zinc-300">
                      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={openNew}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-3 py-3 text-sm font-semibold transition-colors ${
              selection?.kind === "new"
                ? "border-primary/40 bg-primary/5 text-primary"
                : "border-zinc-300 text-zinc-500 hover:border-primary/50 hover:text-primary"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Add service
          </button>
        </aside>

        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">
            {selection?.kind === "new" ? "Add a service" : selection ? "Edit service" : "Select a service"}
          </h2>
          <p className="mt-2 text-zinc-600">
            {selection
              ? "Shown as a card on your public page with a WhatsApp contact button."
              : "Pick a service on the left, or add a new one."}
          </p>

          {selection && (
            <>
              <div className="mt-6">
                <label htmlFor="serviceTitle" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Title
                </label>
                <input
                  id="serviceTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Promotional reel"
                  className={editorInputClass}
                />
              </div>

              <div className="mt-5">
                <label htmlFor="serviceDescription" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Description
                </label>
                <textarea
                  id="serviceDescription"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this service include?"
                  className={`${editorInputClass} resize-none`}
                />
              </div>

              <div className="mt-5">
                <label htmlFor="servicePrice" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Price
                </label>
                <input
                  id="servicePrice"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. ₹500 onwards, or leave blank for a quote"
                  className={editorInputClass}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton saving={saving} savingLabel="Saving…" onClick={save}>
                  {selection.kind === "new" ? "Add service" : "Save service"}
                </PrimaryButton>
                {selection.kind === "edit" && (
                  <DangerButton saving={saving} onClick={remove}>
                    Delete
                  </DangerButton>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}