"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthShell from "@/components/AuthShell";
import { createClient } from "@/lib/supabase/client";
import {
  ODISHA_DISTRICTS,
  PROFESSIONS,
  normalizeUsername,
  isReservedUsername,
  USERNAME_PATTERN,
} from "@/lib/auth-constants";

type Availability = "idle" | "checking" | "available" | "taken" | "invalid";

const PASSWORD_MIN = 6;

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profession, setProfession] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [availability, setAvailability] = useState<Availability>("idle");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (checkTimer.current) clearTimeout(checkTimer.current);

    const normalized = normalizeUsername(username);
    if (!normalized || !USERNAME_PATTERN.test(normalized) || isReservedUsername(normalized)) return;

    checkTimer.current = setTimeout(async () => {
      const { data, error: rpcError } = await supabase.rpc(
        "is_username_available",
        { p_username: normalized },
      );
      if (!rpcError) setAvailability(data ? "available" : "taken");
    }, 450);

    return () => {
      if (checkTimer.current) clearTimeout(checkTimer.current);
    };
  }, [username, supabase]);

  function handleUsernameChange(value: string) {
    const normalized = normalizeUsername(value);
    setUsername(normalized);
    if (!normalized) {
      setAvailability("idle");
    } else if (isReservedUsername(normalized)) {
      setAvailability("taken");
    } else if (!USERNAME_PATTERN.test(normalized)) {
      setAvailability("invalid");
    } else {
      setAvailability("checking");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const normalized = normalizeUsername(username);

    if (!USERNAME_PATTERN.test(normalized)) {
      setError("Username must be 3–20 characters: letters, numbers, underscores.");
      return;
    }
    if (isReservedUsername(normalized)) {
      setError("That username is not available.");
      return;
    }
    if (availability === "taken") {
      setError("That username is already taken.");
      return;
    }
    if (!profession) {
      setError("Please choose your profession.");
      return;
    }
    if (!location) {
      setError("Please select your district.");
      return;
    }
    if (password.length < PASSWORD_MIN) {
      setError(`Password must be at least ${PASSWORD_MIN} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: normalized,
            full_name: name,
            profession,
            location,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      if (signUpError) throw signUpError;

      // If email confirmation is disabled, we get a session immediately.
      if (data?.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setConfirmed(true);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(
        message.toLowerCase().includes("username")
          ? "That username is already taken."
          : message,
      );
    } finally {
      setLoading(false);
    }
  }

  if (confirmed) {
    return (
      <AuthShell
        heading="Almost there"
        accent="Check your email"
        sub="We sent a confirmation link to your inbox to activate your page."
      >
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-7 w-7">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="text-sm text-emerald-800">
            Once you confirm, sign in with your username and password to reach
            your dashboard.
          </p>
          <Link
            href="/login"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-light"
          >
            Go to login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      heading="Join creator-devance"
      accent="Create your free page"
      sub="One link for everything you do. Live in under a minute."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-semibold text-zinc-700"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Carter"
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-zinc-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

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
              autoComplete="off"
              required
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="alexcreates"
              className="w-full bg-transparent px-2 py-3 text-sm text-foreground outline-none placeholder:text-zinc-400"
            />
            <span className="ml-2 text-xs font-semibold">
              {availability === "checking" && (
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  checking
                </span>
              )}
              {availability === "available" && (
                <span className="text-emerald-600">✓ available</span>
              )}
              {availability === "taken" && (
                <span className="text-rose-500">✕ taken</span>
              )}
              {availability === "invalid" && (
                <span className="text-amber-600">3–20 chars, a–z 0–9 _</span>
              )}
            </span>
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-semibold text-zinc-700">
            Profession
          </span>
          <div className="grid grid-cols-3 gap-2">
            {PROFESSIONS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setProfession(p.value)}
                aria-pressed={profession === p.value}
                className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-semibold transition-all ${
                  profession === p.value
                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                    : "border-zinc-300 bg-zinc-50 text-zinc-600 hover:border-primary/40"
                }`}
              >
                <span className="text-xl">{p.emoji}</span>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="location"
            className="mb-1.5 block text-sm font-semibold text-zinc-700"
          >
            District (Odisha)
          </label>
          <select
            id="location"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`w-full appearance-none rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 ${
              location ? "text-foreground" : "text-zinc-400"
            }`}
          >
            <option value="" disabled>
              Select your district
            </option>
            {ODISHA_DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-semibold text-zinc-700"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className={`w-full rounded-xl border bg-zinc-50 px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-primary/20 ${
                confirmPassword && confirmPassword !== password
                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200"
                  : "border-zinc-300 focus:border-primary focus:ring-primary/20"
              }`}
            />
          </div>
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
          disabled={loading || availability === "taken"}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              Creating your page…
            </>
          ) : (
            "Create my page"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary-light"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}