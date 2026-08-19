import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import Logo from "@/components/Logo";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: links }, { data: services }, { data: projects }, { data: products }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("links").select("*").eq("profile_id", user.id).order("position", { ascending: true }),
      supabase.from("services").select("*").eq("profile_id", user.id).order("position", { ascending: true }),
      supabase.from("projects").select("*").eq("profile_id", user.id).order("position", { ascending: true }),
      supabase.from("products").select("*").eq("profile_id", user.id).order("position", { ascending: true }),
    ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-white">
      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Logo />
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="py-10 text-center text-zinc-400">Loading dashboard…</div>}>
          <DashboardTabs
            profile={profile}
            links={links ?? []}
            services={services ?? []}
            projects={projects ?? []}
            products={products ?? []}
            userId={user.id}
          />
        </Suspense>
      </main>
    </div>
  );
}