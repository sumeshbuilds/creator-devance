# creator-devance — Project Process Notes

This file captures the state, decisions and conventions for the **creator-devance**
platform (marketing landing page + auth + dashboard) so future sessions can pick
up where we left off.

## What this project is

A Linktree-style "link in bio" platform for creators (esp. Odisha, India):

1. **Marketing / landing page** — all content is demo/fictional (branding,
   analytics numbers, testimonials, pricing, avatars).
2. **Auth** — email/password signup with username login, backed by Supabase Auth.
3. **Dashboard** — protected page; onboarding "ask for more details" is a future step.

## Tech stack

- **Next.js 16.3.1** (App Router, Turbopack) — NOT the familiar Next.js; breaking
  changes vs older versions. Always consult `node_modules/next/dist/docs/` before
  writing Next code (see AGENTS.md).
  - Next 16: `middleware` is renamed to **`proxy.ts`** (root-level `proxy.ts`,
    exports `proxy`, uses `NextRequest`/`NextResponse`).
- **React 19.2.8**, **TypeScript** (strict)
- **Tailwind CSS v4** (`@import "tailwindcss"`, `@theme inline` in `globals.css`)
- **framer-motion** (v12) — client-side animations
- **next/font/google** — self-hosted fonts
- **@supabase/ssr + @supabase/supabase-js** — auth + Postgres (publishable key)

## Environment / Supabase

- Domain: **`https://creator.devance.in`** (set in `.env` as `NEXT_PUBLIC_SITE_URL`)
- Supabase project ref: **`txnvbuiyxwgjahejfobj`**
  (`.env` → `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
- Supabase MCP is configured in `C:\Users\ompra\.config\opencode\opencode.jsonc`.
  **IMPORTANT:** it was pointed at a stale project ref (`gqhmmbvrzpftqtpynttm`);
  the project ref was fixed to `txnvbuiyxwgjahejfobj`, but the MCP session must be
  **reloaded/re-authenticated** for the tools to work. If MCP DB tools return
  `You do not have permission to perform this action`, re-auth the MCP (see below).
- Migration lives at `supabase/migrations/20260817000000_profiles.sql` and is NOT
  yet applied to the remote DB — apply once MCP is authenticated
  (`supabase_apply_migration` or `supabase db push`). Signup/login will fail until
  the `profiles` table + RPCs exist.

## Re-authenticating the Supabase MCP

Symptom: every Supabase MCP DB tool returns
`MCP error -32600: You do not have permission to perform this action`.
Docs tools (`search_docs`) still work — the issue is the OAuth token, not the config.

Steps (from inside the opencode TUI):

1. Open the MCP/connections menu: type `/mcp` and press Enter (or find "MCP
   servers" in the UI). Confirm the `supabase` server is listed/enabled.
2. If there is a **login/authenticate** action for the server, run it.
   Otherwise **log out / disconnect**, then **log in / connect** again — the
   opencode CLI starts the OAuth flow and opens your browser.
3. In the browser, approve the Supabase MCP request and authorize the Supabase
   account that owns project **`txnvbuiyxwgjahejfobj`**.
4. Return to opencode and (if prompted) reload the session. If the server is
   listed as connected but tools still fail, **quit and restart opencode**
   (config + tokens load at startup; they are not hot-reloaded).
5. Sanity-check with a tool call:
   `supabase_list_tables(schemas=["public"])` should return the table list, not
   a permission error.

Notes:
- The project ref in `C:\Users\ompra\.config\opencode\opencode.jsonc` was already
  corrected from the stale `gqhmmbvrzpftqtpynttm` to `txnvbuiyxwgjahejfobj`, so a
  restart picks up the right project automatically.
- The `.env` publishable key is a separate credential used by the app at runtime;
  the MCP token is what gates database/schema tooling. Both are required for the
  full flow.

## Database schema (migration ready)

`public.profiles` (populated by a trigger on `auth.users` insert):

- `id` uuid PK → `auth.users(id)` (cascade)
- `username` text UNIQUE (lowercased, validated in app: `/^[a-z0-9_]{3,20}$/`)
- `full_name` text, `email` text
- `profession` text CHECK (`artisan` | `professional` | `creator`)
- `location` text (Odisha district — see `ODISHA_DISTRICTS` in `src/lib/auth-constants.ts`)
- `avatar_url`, `bio`, `onboarding_completed` bool default false
- `brand_name` text (nullable; display name on public page), set in dashboard onboarding
- `instagram_url`, `facebook_url`, `youtube_url` text (nullable; optional social links)
- `created_at` / `updated_at` timestamptz (trigger keeps updated_at fresh)

`public.links` (custom page links, added in onboarding migration):

- `id` uuid PK, `profile_id` uuid FK → `profiles(id)` (cascade)
- `title` text, `url` text, `position` int (ordering), `created_at`
- RLS: each user CRUDs only their own rows; anon can SELECT (public page)

`public.public_profiles` (view — public-facing, no email exposed):

- Same columns as profiles minus `email`, `onboarding_completed`
- Created by migration 3 (`20260818000000_public_pages.sql`)
- Owned by postgres (bypasses RLS), SELECT granted to `anon` and `authenticated`
- Used by public profile pages and sitemap

Storage: public `avatars` bucket, per-user folder `{userId}/…`, users manage only
their own folder (see migration `20260817010000_onboarding.sql`).

RPCs (security definer, granted to anon/authenticated, revoked from public):

- `is_username_available(p_username)` → bool (live availability check pre-signup)
- `get_email_by_username(p_username)` → text (username → email for login)

Trigger: `handle_new_user()` copies `raw_user_meta_data` (username, full_name,
profession, location) into `profiles` on signup; raises on username conflict so
the `auth.users` insert rolls back.

RLS on `profiles`: SELECT/UPDATE/INSERT only for `auth.uid() = id`
(own row). No anon read access. Landing/public pages read profiles later via a
different mechanism (not yet built).

## Pages & routes

All routes serve on `creator.devance.in` (production domain).

| Route               | File                          | Notes |
| ------------------- | ----------------------------- | ----- |
| `/` (landing)       | `src/app/page.tsx`            | Public; composed of `src/components/*` |
| `/login`            | `src/app/login/page.tsx`      | Client; username + password → resolves email via RPC → `signInWithPassword` → `/dashboard` |
| `/signup`           | `src/app/signup/page.tsx`     | Client; name, email, username (live availability + reserved check), profession, Odisha district, password + confirm. Shows "check email" screen if confirmation on |
| `/auth/confirm`     | `src/app/auth/confirm/route.ts` | Email confirmation callback (`verifyOtp`) → `/dashboard` |
| `/dashboard`        | `src/app/dashboard/page.tsx`  | Server; protected. Fetches profile, shows onboarding checklist + details; share panel (short link only); sign out via `actions.ts` |
| `/{username}`       | `src/app/[...username]/page.tsx` | Public profile page (short share link `creator.devance.in/username`). Canonical → long URL. 404 for bad/reserved usernames |
| `/{district}/{profession}/{username}` | `src/app/[district]/[profession]/[username]/page.tsx` | SEO canonical URL — only used by search engines, sitemap, and canonical tags. Wrong district/profession → 307 redirect. JSON-LD Schema.org Person |
| `/sitemap.xml`      | `src/app/sitemap.ts`          | Dynamic; queries `public_profiles` view, outputs long URLs (for Google) |
| `/robots.txt`       | `src/app/robots.ts`           | Allow all, sitemap link |

Auth infra:
- `src/lib/supabase/client.ts` — browser client
- `src/lib/supabase/server.ts` — server client (cookies)
- `src/lib/supabase/public.ts` — public client (no cookies, for anon reads of public pages + sitemap)
- `src/lib/supabase/proxy.ts` + root `proxy.ts` — session refresh via `getClaims()`,
  protects `/dashboard*`, redirects logged-in users off `/login|/signup`
- `src/lib/database.types.ts` — hand-written `Database` types (MCP type gen blocked)
- `src/lib/auth-constants.ts` — `PROFESSIONS`, `ODISHA_DISTRICTS` (30 districts),
  `USERNAME_PATTERN`, `normalizeUsername()`, `RESERVED_USERNAMES`, `isReservedUsername()`, `PROFESSION_LABELS`
- `src/lib/site.ts` — `siteUrl()` helper (reads `NEXT_PUBLIC_SITE_URL`)
- `src/lib/public-profile.ts` — `getPublicProfile()`, `listPublicProfiles()`,
  `districtSlug()`, `profileLongUrl()`, `profileShortUrl()`, `buildProfileMetadata()`
- `src/components/AuthShell.tsx` — shared auth page shell
- `src/components/public/PublicProfilePage.tsx` — server component rendering the public profile page (avatar, brand, bio, socials, links, footer) (logo + card)

Signup flow note: Supabase project has **email confirmation enabled**
(`mailer_autoconfirm: false`), so signup lands on a "check your email" state until
the user confirms. Login by username still works post-confirmation. Reserved
usernames (`login`, `signup`, `dashboard`, `auth`, etc.) are rejected client-side
before the RPC call.

## Fonts

- **Outfit** — primary sans (`--font-outfit`, applied via `--font-sans` and `body`)
- **Dancing Script** — cursive accent (`--font-cursive`, `--font-cursive`)
- Used via the `.font-cursive` class or `font-cursive` utility.
- Fonts are configured once in `src/app/layout.tsx` (per Next 16 `next/font` docs).

## Theme / design tokens

Defined in `src/app/globals.css` under `@theme inline`:

- `--color-primary: #6d28d9` (violet-700)
- `--color-primary-light: #8b5cf6`
- `--color-accent: #f59e0b` (amber-500)
- `--color-background` / `--color-foreground`
- Light theme only (no dark mode). `::selection` is purple/white.
- `scroll-behavior: smooth` on html; sections use `scroll-mt-24` to clear the
  fixed navbar.

## Landing page structure & components

All under `src/components/`, composed in `src/app/page.tsx`:

| Section (id)          | File                  | Notes                                          |
| --------------------- | --------------------- | ---------------------------------------------- |
| navbar                | `Navbar.tsx`          | Fixed glassy bar, mobile menu; CTAs → `/login`, `/signup` |
| top (hero)            | `Hero.tsx`            | Grid SVG bg, animated blobs, phone mockup, floating cards |
| features              | `Features.tsx`        | 6 feature cards with SVG icons                 |
| how-it-works          | `HowItWorks.tsx`      | 3 steps, dashed connector SVG                  |
| showcase              | `Showcase.tsx`        | Browser mockup of creator page + analytics panel |
| testimonials          | `Testimonials.tsx`    | Dark section (uses `dark` prop on SectionHeading) |
| pricing               | `Pricing.tsx`         | 3 tiers, highlighted Pro card                  |
| faq                   | `FAQ.tsx`             | Accordion with AnimatePresence height animation |
| cta                   | `CTA.tsx`             | Gradient banner → `/signup`                    |
| footer                | `Footer.tsx`          | Logo, social SVGs, link columns (server component) |

Shared:
- `SectionHeading.tsx` — eyebrow (cursive) + title (with optional cursive accent) +
  description; `dark` prop for dark backgrounds.
- `Logo.tsx` — SVG logo mark + wordmark with cursive "devance".
- `AuthShell.tsx` — auth page shell.

## Conventions & gotchas

- **Client components**: everything with framer-motion, `useState` or Supabase
  browser client is marked `"use client"`. Footer, Logo, dashboard page, server
  supabase client are server components.
- **ESLint**: `react/no-unescaped-entities` is enforced — escape apostrophes as
  `&apos;` in JSX text. `react-hooks/set-state-in-effect` — do NOT call `setState`
  synchronously inside `useEffect`; move it to event handlers (see the username
  availability pattern in signup).
- **Path alias**: `@/*` → `./src/*` (configured in tsconfig).
- **Colors**: use theme tokens (`text-primary`, `bg-primary-light`, `text-foreground`,
  `text-background`) rather than hardcoded hex.
- **Animations**: reveal-on-scroll via `whileInView` + `viewport={{ once: true, margin: "-60px" }}`;
  infinite float via `animate={{ y: [0, -12, 0] }}` + `repeat: Infinity`.
- Section pattern: `<section id="..." className="scroll-mt-24 py-24">` wrapped in
  `mx-auto max-w-6xl px-4 sm:px-6 lg:px-8`.

## Commands

- Dev: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Verify server response: `npm run start -- -p 3100` then request localhost:3100.

## Demo data used

- Creator persona: **Alex Carter** (@alexcreates) — designer/YouTuber; 1.2M subs,
  $8.4k revenue, 1,284 daily clicks, +38% weekly growth.
- Social proof: "2M+ creators", 4-letter avatar initials (A/B/C/D).
- Testimonials: Maya Lin (YouTuber 850k), Jordi Santos (podcast host), Aria Bennett
  (artist).
- Pricing: Starter $0 / Pro $8 / Creator+ $19 per month.

## Status

- [x] Landing page composed, lint clean, production build passing, HTTP 200 smoke test
- [x] Signup + login + dashboard pages built (client/server auth via @supabase/ssr)
- [x] proxy.ts (Next 16) session guard working (`/dashboard` → `/login` when logged out)
- [x] Migration SQL authored (profiles + RPCs + RLS)
- [x] Onboarding: dashboard rebuilt as link editor (left = link list, right = edit
      panel). Profile section sets brand name, about/bio, profile pic (Storage
      `avatars` bucket). Social slots (Instagram/Facebook/YouTube, optional) +
      unlimited custom links (title/URL). All in
      `src/components/dashboard/DashboardEditor.tsx`.
- [x] Public profile pages live — shareable as portfolio/business pages:
      - Short share link: `creator.devance.in/{username}` (user-facing, shown in dashboard)
      - SEO canonical: `creator.devance.in/{district}/{profession}/{username}` (internal only — sitemap + canonical tags, not shown to users)
      - Wrong district/profession → 307 redirect to correct canonical
      - Metadata: title, description, OpenGraph, Twitter card, JSON-LD Schema.org Person
      - `robots.txt` + dynamic `sitemap.xml` listing all profile long URLs
      - Public view (`public_profiles`) exposes only public fields — email never leaked
      - Anon SELECT granted on `public_profiles` view and `links` table
- [x] Dashboard share panel — copy short link + open page (SEO long URL not shown)
- [x] Signup reserved-username guard — blocks `login`, `signup`, `dashboard`, etc.
- [x] Migrations applied — profiles, onboarding, public_pages view all live
- [x] Fixed `.env` — `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` was corrupted
      (PowerShell `Add-Content` appended to last line without newline)
- [x] Domain updated to `creator.devance.in` (was `devance.in`)