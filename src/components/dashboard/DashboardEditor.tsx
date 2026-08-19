"use client";

import { useRef, useState, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { siteUrl } from "@/lib/site";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type CreatorLink = Database["public"]["Tables"]["links"]["Row"];
type SocialKey = "instagram" | "facebook" | "youtube";

type Selection =
  | { kind: "profile" }
  | { kind: SocialKey }
  | { kind: "link"; id: string }
  | { kind: "new" };

const SOCIALS: { key: SocialKey; label: string; icon: ReactElement }[] = [
  {
    key: "instagram",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M13.4 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.8H7.7v2.8h2.4V21h3.3z" />
      </svg>
    ),
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M23 7.6s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.6 4 12 4 12 4s-4.6 0-7.7.3c-.5.1-1.5.1-2.4 1-.7.7-.9 2.3-.9 2.3S.8 9.5.8 11.3v1.4c0 1.8.2 3.7.2 3.7s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 7.5.2 7.5.2s4.6 0 7.7-.2c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.7v-1.4c0-1.8-.2-3.7-.2-3.7zM9.7 15.3V8.7l6.4 3.3-6.4 3.3z" />
      </svg>
    ),
  },
];

function initialsOf(name: string) {
  return (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function DashboardEditor({
  profile: initialProfile,
  links: initialLinks,
  userId,
}: {
  profile: Profile | null;
  links: CreatorLink[];
  userId: string;
}) {
  const supabase = createClient();
  const fileInput = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [links, setLinks] = useState<CreatorLink[]>(initialLinks);
  const [selection, setSelection] = useState<Selection>({ kind: "profile" });

  const [brandName, setBrandName] = useState(initialProfile?.brand_name ?? "");
  const [about, setAbout] = useState(initialProfile?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url ?? "");
  const [socialDrafts, setSocialDrafts] = useState<Record<SocialKey, string>>({
    instagram: initialProfile?.instagram_url ?? "",
    facebook: initialProfile?.facebook_url ?? "",
    youtube: initialProfile?.youtube_url ?? "",
  });
  const [draftTitle, setDraftTitle] = useState("");
  const [draftUrl, setDraftUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const fullName = profile?.full_name ?? "";
  const username = profile?.username ?? "";
  const displayName = profile?.brand_name || fullName;

  function selectProfile() {
    setSelection({ kind: "profile" });
    setBrandName(profile?.brand_name ?? "");
    setAbout(profile?.bio ?? "");
    setAvatarUrl(profile?.avatar_url ?? "");
  }

  function selectSocial(key: SocialKey) {
    setSelection({ kind: key });
    setSocialDrafts((d) => ({ ...d, [key]: profile?.[`${key}_url`] ?? "" }));
  }

  function selectLink(id: string) {
    const link = links.find((l) => l.id === id);
    setSelection({ kind: "link", id });
    setDraftTitle(link?.title ?? "");
    setDraftUrl(link?.url ?? "");
  }

  function flash(text: string, type: "ok" | "err" = "ok") {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 2500);
  }

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      flash(`${label} copied`);
    } catch {
      flash("Could not copy the link.", "err");
    }
  }

  async function saveProfile() {
    setSaving(true);
    setMessage(null);
    const { error } = await supabase
      .from("profiles")
      .update({ brand_name: brandName.trim() || null, bio: about.trim() || null })
      .eq("id", userId);
    setSaving(false);
    if (error) {
      flash(error.message, "err");
      return;
    }
    setProfile((p) =>
      p ? { ...p, brand_name: brandName.trim() || null, bio: about.trim() || null } : p,
    );
    flash("Profile saved");
  }

  async function handleAvatar(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      flash("Please choose an image file.", "err");
      return;
    }
    setUploading(true);
    setMessage(null);
    const ext = file.name.split(".").pop() ?? "png";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: false });
    if (uploadError) {
      setUploading(false);
      flash(uploadError.message, "err");
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(publicUrl);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);
    setUploading(false);
    if (updateError) {
      flash(updateError.message, "err");
      return;
    }
    setProfile((p) => (p ? { ...p, avatar_url: publicUrl } : p));
    flash("Profile picture updated");
  }

  async function saveSocial(key: SocialKey) {
    setSaving(true);
    setMessage(null);
    const column = `${key}_url` as const;
    const value = socialDrafts[key].trim();
    const { error } = await supabase
      .from("profiles")
      .update({ [column]: value || null } as Database["public"]["Tables"]["profiles"]["Update"])
      .eq("id", userId);
    setSaving(false);
    if (error) {
      flash(error.message, "err");
      return;
    }
    setProfile((p) => (p ? { ...p, [column]: value || null } : p));
    flash(`${SOCIALS.find((s) => s.key === key)!.label} updated`);
  }

  async function createLink() {
    if (!newTitle.trim() || !newUrl.trim()) {
      flash("Title and URL are required.", "err");
      return;
    }
    setSaving(true);
    setMessage(null);
    const maxPos = links.reduce((max, l) => Math.max(max, l.position), -1);
    const { data, error } = await supabase
      .from("links")
      .insert({
        profile_id: userId,
        title: newTitle.trim(),
        url: newUrl.trim(),
        position: maxPos + 1,
      })
      .select()
      .single();
    setSaving(false);
    if (error || !data) {
      flash(error?.message ?? "Could not add the link.", "err");
      return;
    }
    setLinks((ls) => [...ls, data]);
    setNewTitle("");
    setNewUrl("");
    setSelection({ kind: "link", id: data.id });
    flash("Link added");
  }

  async function saveLink() {
    if (selection.kind !== "link") return;
    if (!draftTitle.trim() || !draftUrl.trim()) {
      flash("Title and URL are required.", "err");
      return;
    }
    setSaving(true);
    setMessage(null);
    const { error } = await supabase
      .from("links")
      .update({ title: draftTitle.trim(), url: draftUrl.trim() })
      .eq("id", selection.id);
    setSaving(false);
    if (error) {
      flash(error.message, "err");
      return;
    }
    setLinks((ls) =>
      ls.map((l) =>
        l.id === selection.id ? { ...l, title: draftTitle.trim(), url: draftUrl.trim() } : l,
      ),
    );
    flash("Link updated");
  }

  async function deleteLink() {
    if (selection.kind !== "link") return;
    setSaving(true);
    setMessage(null);
    const { error } = await supabase.from("links").delete().eq("id", selection.id);
    setSaving(false);
    if (error) {
      flash(error.message, "err");
      return;
    }
    setLinks((ls) => ls.filter((l) => l.id !== selection.id));
    setSelection({ kind: "profile" });
    flash("Link deleted");
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20";

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-cursive text-2xl font-semibold text-primary">
            Welcome, {displayName.split(" ")[0] || "creator"}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Your links
          </h1>
          <p className="mt-2 text-zinc-600">
            {siteUrl().replace(/^https?:\/\//, "")}/
            <span className="font-semibold text-primary">@{username}</span>
          </p>
        </div>
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
      </div>

      <div className="mt-6 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5">
              <circle cx="6" cy="12" r="2.5" />
              <circle cx="18" cy="6" r="2.5" />
              <circle cx="18" cy="18" r="2.5" />
              <path d="M8.4 10.8 15.6 7.2M8.4 13.2l7.2 3.6" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <h2 className="font-bold text-foreground">Share your page</h2>
            <p className="text-sm text-zinc-500">
              Send this link to customers, clients or followers.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Your page</p>
              <p className="truncate font-medium text-foreground">{siteUrl()}/{username}</p>
            </div>
            <div className="flex shrink-0 gap-2 sm:ml-auto">
              <button
                type="button"
                onClick={() => copyText(`${siteUrl()}/${username}`, "Link")}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-light"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" />
                </svg>
                Copy
              </button>
              <a
                href={`${siteUrl()}/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 transition-colors hover:border-primary/40 hover:text-primary"
              >
                Open
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <p className="px-2 pb-2 pt-1 text-xs font-bold uppercase tracking-wider text-zinc-400">
            Your links
          </p>
          <ul className="flex flex-col gap-1.5">
            <li>
              <button
                type="button"
                onClick={selectProfile}
                className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${
                  selection.kind === "profile"
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-light text-sm font-bold text-white">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initialsOf(displayName)
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-bold text-foreground">
                    {displayName || "Your brand"}
                  </span>
                  <span className="block truncate text-sm text-zinc-500">
                    Profile &amp; picture
                  </span>
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto h-4 w-4 shrink-0 text-zinc-300">
                  <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </li>

            {SOCIALS.map((social) => {
              const value = profile?.[`${social.key}_url`];
              const active = selection.kind === social.key;
              return (
                <li key={social.key}>
                  <button
                    type="button"
                    onClick={() => selectSocial(social.key)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        value ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-400"
                      }`}
                    >
                      {social.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold text-foreground">{social.label}</span>
                      <span className={`block truncate text-sm ${value ? "text-zinc-500" : "text-zinc-400"}`}>
                        {value || "Add link"}
                      </span>
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto h-4 w-4 shrink-0 text-zinc-300">
                      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </li>
              );
            })}

            {links.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => selectLink(link.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${
                    selection.kind === "link" && selection.id === link.id
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold text-foreground">{link.title}</span>
                    <span className="block truncate text-sm text-zinc-500">{link.url}</span>
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto h-4 w-4 shrink-0 text-zinc-300">
                    <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </li>
            ))}

            {selection.kind === "new" && (
              <li>
                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-3 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="font-bold text-primary">New link</span>
                </div>
              </li>
            )}
          </ul>

          <button
            type="button"
            onClick={() => setSelection({ kind: "new" })}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 px-3 py-3 text-sm font-semibold text-zinc-500 transition-colors hover:border-primary/50 hover:text-primary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Add link
          </button>
        </aside>

        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          {selection.kind === "profile" && (
            <>
              <h2 className="text-xl font-bold text-foreground">Your brand</h2>
              <p className="mt-2 text-zinc-600">
                This is what people see on your page. Introduce your brand and yourself.
              </p>

              <div className="mt-6 flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="group relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-light text-2xl font-bold text-white shadow-md"
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    initialsOf(displayName)
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {uploading ? "Uploading…" : "Change"}
                  </span>
                </button>
                <div>
                  <p className="font-semibold text-foreground">Profile picture</p>
                  <p className="mt-1 max-w-xs text-sm text-zinc-500">
                    Square image works best. It is shown on your public page.
                  </p>
                </div>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatar(e.target.files?.[0])}
                />
              </div>

              <div className="mt-6">
                <label htmlFor="brandName" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Brand name
                </label>
                <input
                  id="brandName"
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Alex Carter Studio"
                  className={inputClass}
                />
              </div>

              <div className="mt-5">
                <label htmlFor="about" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  About
                </label>
                <textarea
                  id="about"
                  rows={5}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell people about your brand and yourself — what you make, what you love, where people can find you."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {saving ? "Saving…" : "Save profile"}
              </button>
            </>
          )}

          {selection.kind !== "profile" && selection.kind !== "new" && (
            <>
              {(() => {
                const social = SOCIALS.find((s) => s.key === selection.kind);
                if (social) {
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {social.icon}
                        </span>
                        <div>
                          <h2 className="text-xl font-bold text-foreground">{social.label}</h2>
                          <p className="text-sm text-zinc-500">Optional link — leave blank to hide</p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <label
                          htmlFor={`${social.key}-url`}
                          className="mb-1.5 block text-sm font-semibold text-zinc-700"
                        >
                          {social.label} URL
                        </label>
                        <input
                          id={`${social.key}-url`}
                          type="url"
                          value={socialDrafts[social.key]}
                          onChange={(e) =>
                            setSocialDrafts((d) => ({ ...d, [social.key]: e.target.value }))
                          }
                          placeholder={`https://${social.key}.com/your-handle`}
                          className={inputClass}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => saveSocial(social.key)}
                        disabled={saving}
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                      >
                        {saving ? "Saving…" : "Save link"}
                      </button>
                    </>
                  );
                }
                if (selection.kind === "link") {
                  const link = links.find((l) => l.id === selection.id);
                  if (link) {
                  return (
                    <>
                      <h2 className="text-xl font-bold text-foreground">Edit link</h2>
                      <p className="mt-2 text-zinc-600">
                        A button on your page that opens this URL.
                      </p>
                      <div className="mt-6">
                        <label htmlFor="linkTitle" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                          Title
                        </label>
                        <input
                          id="linkTitle"
                          type="text"
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          placeholder="e.g. My portfolio"
                          className={inputClass}
                        />
                      </div>
                      <div className="mt-5">
                        <label htmlFor="linkUrl" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                          URL
                        </label>
                        <input
                          id="linkUrl"
                          type="url"
                          value={draftUrl}
                          onChange={(e) => setDraftUrl(e.target.value)}
                          placeholder="https://…"
                          className={inputClass}
                        />
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={saveLink}
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                        >
                          {saving ? "Saving…" : "Save link"}
                        </button>
                        <button
                          type="button"
                          onClick={deleteLink}
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  );
                  }
                }
                return null;
              })()}
            </>
          )}

          {selection.kind === "new" && (
            <>
              <h2 className="text-xl font-bold text-foreground">Add a link</h2>
              <p className="mt-2 text-zinc-600">
                Add a button to your page — portfolio, shop, booking, anything.
              </p>
              <div className="mt-6">
                <label htmlFor="newTitle" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Title
                </label>
                <input
                  id="newTitle"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. My portfolio"
                  className={inputClass}
                />
              </div>
              <div className="mt-5">
                <label htmlFor="newUrl" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  URL
                </label>
                <input
                  id="newUrl"
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://…"
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={createLink}
                disabled={saving}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {saving ? "Adding…" : "Add link"}
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}