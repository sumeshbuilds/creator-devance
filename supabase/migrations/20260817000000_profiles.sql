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