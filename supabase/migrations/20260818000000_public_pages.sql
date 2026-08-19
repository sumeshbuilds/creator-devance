-- creator-devance: public profile pages (portfolio/business page + SEO)

-- Public view exposing only the fields a public profile page needs.
-- Owned by postgres -> bypasses the RLS on profiles, so anon can read it
-- WITHOUT exposing private columns (email, etc.).
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
  created_at,
  updated_at
from public.profiles;

grant select on public.public_profiles to anon, authenticated;

-- Public pages render the creator's custom links.
create policy "links are publicly readable"
  on public.links for select
  to anon, authenticated
  using ( true );
