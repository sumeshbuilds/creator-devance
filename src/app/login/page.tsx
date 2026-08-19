"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthShell from "@/components/AuthShell";
import { createClient } from "@/lib/supabase/client";
import { normalizeUsername, USERNAME_PATTERN } from "@/lib/auth-constants";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const normalized = normalizeUsername(username);
      if (!USERNAME_PATTERN.test(normalized)) {
        setError("Username must be 3–20 characters: letters, numbers, underscores.");
        return;
      }

      const { data, error: resolveError } = await supabase.rpc(
        "get_email_by_username",
        { p_username: normalized },
      );
      if (resolveError) throw resolveError;

      if (!data) {
        setError("No account found with that username.");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data,
        password,
      });
      if (signInError) throw signInError;

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.";
      setError(
        message.includes("Invalid login credentials")
          ? "Invalid username or password."
          : message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      heading="Welcome back"
      accent="Sign in to your page"
      sub="Your fans are waiting — let's get you back to creating."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block text-sm font-semibold text-zinc-700"
          >
            Username
          </label>
          <div className="flex items-center rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 transition-colors focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20">
            <span className="text-sm text-zinc-400">@</span>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="alexcreates"
              className="w-full bg-transparent px-2 py-3 text-sm text-foreground outline-none placeholder:text-zinc-400"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-semibold text-zinc-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="4"
                />
                <path
                  d="M22 12a10 10 0 0 1-10 10"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        New here?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary hover:text-primary-light"
        >
          Create your free page
        </Link>
      </p>
    </AuthShell>
  );
}