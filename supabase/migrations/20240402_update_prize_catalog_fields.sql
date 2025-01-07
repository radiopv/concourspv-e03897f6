-- Remove is_active column and add is_archived and is_hidden
alter table public.prize_catalog 
  drop column if exists is_active,
  add column if not exists is_archived boolean default false,
  add column if not exists is_hidden boolean default false,
  add column if not exists images text[] default array[]::text[],
  add column if not exists main_image_url text;

-- Update RLS policies
drop policy if exists "Anyone can view prize catalog" on public.prize_catalog;
drop policy if exists "Authenticated users can manage prize catalog" on public.prize_catalog;

create policy "Anyone can view prize catalog"
  on public.prize_catalog
  for select
  using (true);

create policy "Authenticated users can manage prize catalog"
  on public.prize_catalog
  for all
  to authenticated
  using (true)
  with check (true);