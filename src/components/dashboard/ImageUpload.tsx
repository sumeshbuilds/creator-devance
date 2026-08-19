"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useImageUpload(userId: string) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File | undefined): Promise<string | null> {
    if (!file) return null;
    if (!file.type.startsWith("image/")) {
      throw new Error("Please choose an image file.");
    }
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "png";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, {
      upsert: false,
    });
    if (error) {
      setUploading(false);
      throw new Error(error.message);
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(path);
    setUploading(false);
    return publicUrl;
  }

  return { uploading, uploadImage };
}

export function ImageUpload({
  imageUrl,
  uploading,
  onUpload,
  label = "Image",
}: {
  imageUrl: string | null;
  uploading: boolean;
  onUpload: (file: File | undefined) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<string | null>(null);

  const shown = pending ?? imageUrl;

  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold text-zinc-700">{label}</p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="group relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-xs font-semibold text-zinc-400 transition-colors hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed"
        >
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="Upload preview" className="h-full w-full object-cover" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
              Uploading…
            </span>
          )}
        </button>
        {shown && (
          <button
            type="button"
            onClick={() => {
              setPending(null);
              onUpload(undefined);
            }}
            className="text-xs font-semibold text-zinc-400 transition-colors hover:text-rose-500"
          >
            Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setPending(URL.createObjectURL(file));
            onUpload(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}