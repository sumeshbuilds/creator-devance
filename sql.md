# Supabase SQL — apply in SQL Editor

Paste into https://supabase.com/dashboard → project `txnvbuiyxwgjahejfobj` → SQL Editor → New query → Run.

## Order matters

Run **migration 1** first (creates `profiles`, RPCs, RLS). Then **migration 2** (onboarding).

---

## Migration 1 — `profiles` + auth helpers

```sql
-- creator-devance: profiles for creator accounts + auth helpers
-- Table is populated by a trigger on auth.users insert (metadata from signup).

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  full_name text not null,
  email text not null,
  profession text not null
    check (profession in ('artisan', 'professional', 'creator')),
  location text not null,
  avatar_url text,
  bio text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Creator profile. Populated by handle_new_user trigger on signup.';

-- Keep updated_at fresh on changes.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create profile row from raw_user_meta_data on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, username, full_name, email, profession, location
  ) values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    new.raw_user_meta_data ->> 'profession',
    new.raw_user_meta_data ->> 'location'
  );
  return new;
exception
  when unique_violation then
    -- username already taken: roll back the auth.users insert too
    raise exception 'Username already taken';
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.set_updated_at() from public;

-- Username availability check (live, pre-signup).
create or replace function public.is_username_available(p_username text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1 from public.profiles
    where username = lower(p_username)
  );
$$;

grant execute on function public.is_username_available(text) to anon, authenticated;
revoke execute on function public.is_username_available(text) from public;

-- Resolve a username to its auth email (used by username login).
create or replace function public.get_email_by_username(p_username text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select email from public.profiles
  where username = lower(p_username)
  limit 1;
$$;

grant execute on function public.get_email_by_username(text) to anon, authenticated;
revoke execute on function public.get_email_by_username(text) from public;

-- RLS: each user can read and edit only their own profile.
alter table public.profiles enable row level security;

create policy "read own profile"
  on public.profiles for select
  to authenticated
  using ( (select auth.uid()) = id );

create policy "update own profile"
  on public.profiles for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

create policy "insert own profile"
  on public.profiles for insert
  to authenticated
  with check ( (select auth.uid()) = id );
```

---

## Migration 2 — onboarding: brand, socials, custom links, avatars

```sql
-- creator-devance: onboarding columns, custom links, avatar storage

-- Extend profiles with brand + social links (all optional except brand_name later).
alter table public.profiles
  add column if not exists brand_name text,
  add column if not exists instagram_url text,
  add column if not exists facebook_url text,
  add column if not exists youtube_url text;

comment on column public.profiles.brand_name is
  'Display name of the creator brand on the public page.';
comment on column public.profiles.instagram_url is 'Optional Instagram URL.';
comment on column public.profiles.facebook_url is 'Optional Facebook URL.';
comment on column public.profiles.youtube_url is 'Optional YouTube URL.';

-- Custom links a creator adds to their page (beyond the fixed social slots).
create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.links is
  'Custom links shown on a creator public page.';

create index if not exists links_profile_position_idx
  on public.links (profile_id, position);

alter table public.links enable row level security;

create policy "read own links"
  on public.links for select
  to authenticated
  using ( (select auth.uid()) = profile_id );

create policy "insert own links"
  on public.links for insert
  to authenticated
  with check ( (select auth.uid()) = profile_id );

create policy "update own links"
  on public.links for update
  to authenticated
  using ( (select auth.uid()) = profile_id )
  with check ( (select auth.uid()) = profile_id );

create policy "delete own links"
  on public.links for delete
  to authenticated
  using ( (select auth.uid()) = profile_id );

-- Avatar storage: public bucket, per-user folder (userId/...).
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars are publicly readable"
  on storage.objects for select
  to public
  using ( bucket_id = 'avatars' );

create policy "users can upload their own avatars"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users can update their own avatars"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users can delete their own avatars"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
```

---

## Verify

Run this after both migrations:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('profiles', 'links');

select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
order by ordinal_position;
```

Expected: both `profiles` and `links` rows, and `profiles` has `brand_name`,
`instagram_url`, `facebook_url`, `youtube_url` columns.