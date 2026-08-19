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
import { ImageUpload, useImageUpload } from "./ImageUpload";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Selection = { kind: "new" } | { kind: "edit"; id: string };

export default function StoreEditor({
  initialProducts,
  userId,
}: {
  initialProducts: Product[];
  userId: string;
}) {
  const supabase = createClient();
  const { message, flash } = useFlash();
  const { uploading, uploadImage } = useImageUpload(userId);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setSelection({ kind: "new" });
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl(null);
    setIsActive(true);
  }

  function openEdit(product: Product) {
    setSelection({ kind: "edit", id: product.id });
    setName(product.name);
    setDescription(product.description ?? "");
    setPrice(product.price === null || product.price === undefined ? "" : String(product.price));
    setImageUrl(product.image_url);
    setIsActive(product.is_active);
  }

  async function handleUpload(file: File | undefined) {
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      flash(err instanceof Error ? err.message : "Upload failed.", "err");
    }
  }

  async function save() {
    if (!name.trim()) {
      flash("Name is required.", "err");
      return;
    }
    const parsedPrice = price.trim() === "" ? null : Number(price);
    if (price.trim() !== "" && (Number.isNaN(parsedPrice) || parsedPrice! < 0)) {
      flash("Please enter a valid price.", "err");
      return;
    }
    setSaving(true);
    const values = {
      name: name.trim(),
      description: description.trim() || null,
      price: parsedPrice,
      image_url: imageUrl,
      is_active: isActive,
    };
    if (selection?.kind === "edit") {
      const { error } = await supabase
        .from("products")
        .update(values)
        .eq("id", selection.id);
      setSaving(false);
      if (error) {
        flash(error.message, "err");
        return;
      }
      setProducts((list) =>
        list.map((p) => (p.id === selection.id ? { ...p, ...values } : p)),
      );
      flash("Product updated");
    } else {
      const maxPos = products.reduce((max, p) => Math.max(max, p.position), -1);
      const { data, error } = await supabase
        .from("products")
        .insert({ profile_id: userId, ...values, position: maxPos + 1 })
        .select()
        .single();
      setSaving(false);
      if (error || !data) {
        flash(error?.message ?? "Could not add the product.", "err");
        return;
      }
      setProducts((list) => [...list, data]);
      setSelection({ kind: "edit", id: data.id });
      flash("Product added");
    }
  }

  async function remove() {
    if (selection?.kind !== "edit") return;
    setSaving(true);
    const { error } = await supabase.from("products").delete().eq("id", selection.id);
    setSaving(false);
    if (error) {
      flash(error.message, "err");
      return;
    }
    setProducts((list) => list.filter((p) => p.id !== selection.id));
    setSelection(null);
    flash("Product deleted");
  }

  async function toggleActive(product: Product) {
    const next = !product.is_active;
    const { error } = await supabase
      .from("products")
      .update({ is_active: next })
      .eq("id", product.id);
    if (error) {
      flash(error.message, "err");
      return;
    }
    setProducts((list) => list.map((p) => (p.id === product.id ? { ...p, is_active: next } : p)));
    flash(next ? "Product is now visible" : "Product hidden");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Store</h1>
          <p className="mt-2 text-zinc-600">
            Sell your handmade goods or digital art. Customers order on WhatsApp with the product
            details pre-filled — no checkout needed yet.
          </p>
        </div>
        <FlashMessage message={message} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <p className="px-2 pb-2 pt-1 text-xs font-bold uppercase tracking-wider text-zinc-400">
            Your products
          </p>
          {products.length === 0 && (
            <p className="rounded-2xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
              No products yet. Add your first one.
            </p>
          )}
          <ul className="flex flex-col gap-1.5">
            {products.map((product) => {
              const active = selection?.kind === "edit" && selection.id === product.id;
              return (
                <li key={product.id}>
                  <div
                    className={`rounded-2xl border transition-colors ${
                      active ? "border-primary bg-primary/5" : "border-transparent"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left ${
                        active ? "" : "hover:border-zinc-200 hover:bg-zinc-50"
                      }`}
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-100">
                        {product.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-lg">🛍️</span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-foreground">
                          {product.name}
                        </span>
                        <span className="block truncate text-sm text-zinc-500">
                          {formatPrice(product.price) ?? "No price"}
                        </span>
                      </span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-zinc-300">
                        <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          product.is_active ? "text-emerald-600" : "text-zinc-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            product.is_active ? "bg-emerald-500" : "bg-zinc-300"
                          }`}
                        />
                        {product.is_active ? "Visible" : "Hidden"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleActive(product)}
                        className="text-xs font-semibold text-zinc-400 transition-colors hover:text-primary"
                      >
                        {product.is_active ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
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
            Add product
          </button>
        </aside>

        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">
            {selection?.kind === "new" ? "Add a product" : selection ? "Edit product" : "Select a product"}
          </h2>
          <p className="mt-2 text-zinc-600">
            {selection
              ? "Customers tap your product to order it on WhatsApp."
              : "Pick a product on the left, or add a new one."}
          </p>

          {selection && (
            <>
              <div className="mt-6">
                <label htmlFor="productName" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Name
                </label>
                <input
                  id="productName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hand-painted palm leaf fan"
                  className={editorInputClass}
                />
              </div>

              <div className="mt-5">
                <ImageUpload
                  key={selection.kind === "edit" ? selection.id : "new"}
                  imageUrl={imageUrl}
                  uploading={uploading}
                  onUpload={handleUpload}
                  label="Product image"
                />
              </div>

              <div className="mt-5">
                <label htmlFor="productPrice" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Price (₹)
                </label>
                <input
                  id="productPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 499"
                  className={editorInputClass}
                />
              </div>

              <div className="mt-5">
                <label htmlFor="productDescription" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Description
                </label>
                <textarea
                  id="productDescription"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell buyers what makes this special."
                  className={`${editorInputClass} resize-none`}
                />
              </div>

              <label className="mt-5 flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <span>
                  <span className="block text-sm font-semibold text-zinc-700">Show in store</span>
                  <span className="block text-xs text-zinc-400">Hidden products are not shown on your page.</span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  onClick={() => setIsActive((v) => !v)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    isActive ? "bg-primary" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      isActive ? "translate-x-5.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </label>

              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton saving={saving} savingLabel="Saving…" onClick={save}>
                  {selection.kind === "new" ? "Add product" : "Save product"}
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