-- creator-devance: configurable public page sections (visibility + order)
-- Add a jsonb column storing the ordered list of visible page sections.
-- Example: '["social", "store", "portfolio"]' — absent sections are hidden.
-- Null = show all sections in the default order.

alter table public.profiles
  add column if not exists page_sections jsonb;

comment on column public.profiles.page_sections is
  'Ordered list of visible public page sections (social, store, portfolio). Null = show all in default order.';

-- Recreate the public view to expose page_sections (CREATE OR REPLACE VIEW cannot
-- reorder/add columns across definitions, so drop + recreate is the safe pattern).
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
  whatsapp_number,
  page_sections
from public.profiles;

grant select on public.public_profiles to anon, authenticated;