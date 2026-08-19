"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";
import {
  DangerButton,
  PrimaryButton,
  editorInputClass,
  FlashMessage,
  useFlash,
} from "./editor-ui";
import { ImageUpload, useImageUpload } from "./ImageUpload";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type MediaType = "image" | "video";
type Selection = { kind: "new" } | { kind: "edit"; id: string };

export default function PortfolioEditor({
  initialProjects,
  userId,
}: {
  initialProjects: Project[];
  userId: string;
}) {
  const supabase = createClient();
  const { message, flash } = useFlash();
  const { uploading, uploadImage } = useImageUpload(userId);

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [title, setTitle] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [mediaUrl, setMediaUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  function openNew() {
    setSelection({ kind: "new" });
    setTitle("");
    setMediaType("image");
    setMediaUrl("");
    setDescription("");
  }

  function openEdit(project: Project) {
    setSelection({ kind: "edit", id: project.id });
    setTitle(project.title);
    setMediaType(project.media_type);
    setMediaUrl(project.media_url);
    setDescription(project.description ?? "");
  }

  async function handleUpload(file: File | undefined) {
    try {
      const url = await uploadImage(file);
      setMediaUrl(url ?? "");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Upload failed.", "err");
    }
  }

  async function save() {
    if (!title.trim()) {
      flash("Title is required.", "err");
      return;
    }
    if (!mediaUrl.trim()) {
      flash(mediaType === "image" ? "Please add an image." : "Please add a video URL.", "err");
      return;
    }
    setSaving(true);
    const values = {
      title: title.trim(),
      media_type: mediaType,
      media_url: mediaUrl.trim(),
      description: description.trim() || null,
    };
    if (selection?.kind === "edit") {
      const { error } = await supabase
        .from("projects")
        .update(values)
        .eq("id", selection.id);
      setSaving(false);
      if (error) {
        flash(error.message, "err");
        return;
      }
      setProjects((list) =>
        list.map((p) => (p.id === selection.id ? { ...p, ...values } : p)),
      );
      flash("Project updated");
    } else {
      const maxPos = projects.reduce((max, p) => Math.max(max, p.position), -1);
      const { data, error } = await supabase
        .from("projects")
        .insert({ profile_id: userId, ...values, position: maxPos + 1 })
        .select()
        .single();
      setSaving(false);
      if (error || !data) {
        flash(error?.message ?? "Could not add the project.", "err");
        return;
      }
      setProjects((list) => [...list, data]);
      setSelection({ kind: "edit", id: data.id });
      flash("Project added");
    }
  }

  async function remove() {
    if (selection?.kind !== "edit") return;
    setSaving(true);
    const { error } = await supabase.from("projects").delete().eq("id", selection.id);
    setSaving(false);
    if (error) {
      flash(error.message, "err");
      return;
    }
    setProjects((list) => list.filter((p) => p.id !== selection.id));
    setSelection(null);
    flash("Project deleted");
  }

  const typeTabs: { value: MediaType; label: string }[] = [
    { value: "image", label: "Image / Art" },
    { value: "video", label: "Video / Reel" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Portfolio</h1>
          <p className="mt-2 text-zinc-600">
            Show your work — upload art and photos, or link reels and videos from YouTube,
            Instagram, and more.
          </p>
        </div>
        <FlashMessage message={message} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <p className="px-2 pb-2 pt-1 text-xs font-bold uppercase tracking-wider text-zinc-400">
            Your projects
          </p>
          {projects.length === 0 && (
            <p className="rounded-2xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
              No projects yet. Add your first piece.
            </p>
          )}
          <ul className="flex flex-col gap-1.5">
            {projects.map((project) => {
              const active = selection?.kind === "edit" && selection.id === project.id;
              return (
                <li key={project.id}>
                  <button
                    type="button"
                    onClick={() => openEdit(project)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-100">
                      {project.media_type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={project.media_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary-light text-white">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                            <path d="M8 5.5v13l11-6.5-11-6.5z" />
                          </svg>
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-foreground">
                        {project.title}
                      </span>
                      <span className="block truncate text-sm text-zinc-500">
                        {project.media_type === "video" ? "Video / Reel" : "Image / Art"}
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
            Add project
          </button>
        </aside>

        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">
            {selection?.kind === "new" ? "Add a project" : selection ? "Edit project" : "Select a project"}
          </h2>
          <p className="mt-2 text-zinc-600">
            {selection
              ? "Images are uploaded and shown on your page. Videos open the link you provide."
              : "Pick a project on the left, or add a new one."}
          </p>

          {selection && (
            <>
              <div className="mt-6">
                <label htmlFor="projectTitle" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Title
                </label>
                <input
                  id="projectTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Clay festival stall, Wedding reel"
                  className={editorInputClass}
                />
              </div>

              <div className="mt-5">
                <p className="mb-1.5 text-sm font-semibold text-zinc-700">Type</p>
                <div className="flex rounded-xl border border-zinc-300 bg-zinc-50 p-1">
                  {typeTabs.map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => {
                        setMediaType(tab.value);
                        setMediaUrl("");
                      }}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                        mediaType === tab.value
                          ? "bg-white text-primary shadow-sm"
                          : "text-zinc-500 hover:text-zinc-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                {mediaType === "image" ? (
                  <ImageUpload
                    key={selection.kind === "edit" ? selection.id : "new"}
                    imageUrl={mediaUrl || null}
                    uploading={uploading}
                    onUpload={handleUpload}
                    label="Artwork / photo"
                  />
                ) : (
                  <div>
                    <label htmlFor="projectVideoUrl" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                      Video / reel URL
                    </label>
                    <input
                      id="projectVideoUrl"
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://youtube.com/… or https://instagram.com/…"
                      className={editorInputClass}
                    />
                  </div>
                )}
              </div>

              <div className="mt-5">
                <label htmlFor="projectDescription" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Description
                </label>
                <textarea
                  id="projectDescription"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional — tell people about this piece."
                  className={`${editorInputClass} resize-none`}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton saving={saving} savingLabel="Saving…" onClick={save}>
                  {selection.kind === "new" ? "Add project" : "Save project"}
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