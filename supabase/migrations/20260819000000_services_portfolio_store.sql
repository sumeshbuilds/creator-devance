-- creator-devance: services, portfolio, WhatsApp store + contact

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

create policy "read own services"
  on public.services for select
  to authenticated
  using ( (select auth.uid()) = profile_id );

create policy "insert own services"
  on public.services for insert
  to authenticated
  with check ( (select auth.uid()) = profile_id );

create policy "update own services"
  on public.services for update
  to authenticated
  using ( (select auth.uid()) = profile_id )
  with check ( (select auth.uid()) = profile_id );

create policy "delete own services"
  on public.services for delete
  to authenticated
  using ( (select auth.uid()) = profile_id );

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

create policy "read own projects"
  on public.projects for select
  to authenticated
  using ( (select auth.uid()) = profile_id );

create policy "insert own projects"
  on public.projects for insert
  to authenticated
  with check ( (select auth.uid()) = profile_id );

create policy "update own projects"
  on public.projects for update
  to authenticated
  using ( (select auth.uid()) = profile_id )
  with check ( (select auth.uid()) = profile_id );

create policy "delete own projects"
  on public.projects for delete
  to authenticated
  using ( (select auth.uid()) = profile_id );

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

create policy "read own products"
  on public.products for select
  to authenticated
  using ( (select auth.uid()) = profile_id );

create policy "insert own products"
  on public.products for insert
  to authenticated
  with check ( (select auth.uid()) = profile_id );

create policy "update own products"
  on public.products for update
  to authenticated
  using ( (select auth.uid()) = profile_id )
  with check ( (select auth.uid()) = profile_id );

create policy "delete own products"
  on public.products for delete
  to authenticated
  using ( (select auth.uid()) = profile_id );

create policy "products are publicly readable"
  on public.products for select
  to anon, authenticated
  using ( true );

-- Storage: portfolio images + product images in a public `media` bucket,
-- per-user folder (userId/...), mirroring the avatars policies.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media are publicly readable"
  on storage.objects for select
  to public
  using ( bucket_id = 'media' );

create policy "users can upload their own media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

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

create policy "users can delete their own media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Expose whatsapp_number on the public view (used by contact + order buttons).
create or replace view public.public_profiles
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
  whatsapp_number,
  created_at,
  updated_at
from public.profiles;

grant select on public.public_profiles to anon, authenticated;