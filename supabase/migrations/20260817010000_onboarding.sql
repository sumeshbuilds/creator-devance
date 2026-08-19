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