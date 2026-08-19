-- creator-devance: services, portfolio, WhatsApp store + contact
-- Fully idempotent: safe to re-run after a partial/previous failed attempt.
-- (Policies are dropped before creation; the public_profiles view is
--  drop+recreated instead of CREATE OR REPLACE, which cannot reorder columns.)

-- WhatsApp number for the "Contact" / "Order on WhatsApp" buttons.
alter table public.profiles
  add column if not exists whatsapp_number text;

comment on column public.profiles.whatsapp_number is
  'Creator WhatsApp number (international digits) used for contact + order buttons.';

-- Services a creator offers (video creation, promotional reels, etc.).
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  price text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.services is
  'Services a creator lists on their public page, each with a WhatsApp contact button.';

create index if not exists services_profile_position_idx
  on public.services (profile_id, position);

alter table public.services enable row level security;

drop policy if exists "read own services" on public.services;
create policy "read own services"
  on public.services for select
  to authenticated
  using ( (select auth.uid()) = profile_id );

drop policy if exists "insert own services" on public.services;
create policy "insert own services"
  on public.services for insert
  to authenticated
  with check ( (select auth.uid()) = profile_id );

drop policy if exists "update own services" on public.services;
create policy "update own services"
  on public.services for update
  to authenticated
  using ( (select auth.uid()) = profile_id )
  with check ( (select auth.uid()) = profile_id );

drop policy if exists "delete own services" on public.services;
create policy "delete own services"
  on public.services for delete
  to authenticated
  using ( (select auth.uid()) = profile_id );

drop policy if exists "services are publicly readable" on public.services;
create policy "services are publicly readable"
  on public.services for select
  to anon, authenticated
  using ( true );

-- Portfolio projects (art, reels, videos). Images are uploaded to Storage;
-- videos reference an external URL (YouTube, Instagram, etc.).
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  media_type text not null check (media_type in ('image', 'video')),
  media_url text not null,
  description text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.projects is
  'Portfolio projects shown on the public page (image uploads or video URLs).';

create index if not exists projects_profile_position_idx
  on public.projects (profile_id, position);

alter table public.projects enable row level security;

drop policy if exists "read own projects" on public.projects;
create policy "read own projects"
  on public.projects for select
  to authenticated
  using ( (select auth.uid()) = profile_id );

drop policy if exists "insert own projects" on public.projects;
create policy "insert own projects"
  on public.projects for insert
  to authenticated
  with check ( (select auth.uid()) = profile_id );

drop policy if exists "update own projects" on public.projects;
create policy "update own projects"
  on public.projects for update
  to authenticated
  using ( (select auth.uid()) = profile_id )
  with check ( (select auth.uid()) = profile_id );

drop policy if exists "delete own projects" on public.projects;
create policy "delete own projects"
  on public.projects for delete
  to authenticated
  using ( (select auth.uid()) = profile_id );

drop policy if exists "projects are publicly readable" on public.projects;
create policy "projects are publicly readable"
  on public.projects for select
  to anon, authenticated
  using ( true );

-- Store products (handmade goods, digital art). Orders connect via WhatsApp.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  price numeric(12, 2),
  image_url text,
  is_active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.products is
  'Products in a creator store. Price in INR; orders via WhatsApp.';

create index if not exists products_profile_position_idx
  on public.products (profile_id, position);

alter table public.products enable row level security;

drop policy if exists "read own products" on public.products;
create policy "read own products"
  on public.products for select
  to authenticated
  using ( (select auth.uid()) = profile_id );

drop policy if exists "insert own products" on public.products;
create policy "insert own products"
  on public.products for insert
  to authenticated
  with check ( (select auth.uid()) = profile_id );

drop policy if exists "update own products" on public.products;
create policy "update own products"
  on public.products for update
  to authenticated
  using ( (select auth.uid()) = profile_id )
  with check ( (select auth.uid()) = profile_id );

drop policy if exists "delete own products" on public.products;
create policy "delete own products"
  on public.products for delete
  to authenticated
  using ( (select auth.uid()) = profile_id );

drop policy if exists "products are publicly readable" on public.products;
create policy "products are publicly readable"
  on public.products for select
  to anon, authenticated
  using ( true );

-- Storage: portfolio images + product images in a public `media` bucket,
-- per-user folder (userId/...), mirroring the avatars policies.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media are publicly readable" on storage.objects;
create policy "media are publicly readable"
  on storage.objects for select
  to public
  using ( bucket_id = 'media' );

drop policy if exists "users can upload their own media" on storage.objects;
create policy "users can upload their own media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "users can update their own media" on storage.objects;
create policy "users can update their own media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "users can delete their own media" on storage.objects;
create policy "users can delete their own media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Expose whatsapp_number on the public view. Drop+recreate: CREATE OR REPLACE
-- VIEW cannot reorder columns (would raise 42P16), so this is the safe way to
-- update an existing view. Grants are re-applied afterwards.
drop view if exists public.public_profiles;

create view public.public_profiles
as
select
  id,
  username,
  full_name,
  profession,
  location,
  avatar_url,
  bio,
  brand_name,
  instagram_url,
  facebook_url,
  youtube_url,
  created_at,
  updated_at,
  whatsapp_number
from public.profiles;

grant select on public.public_profiles to anon, authenticated;