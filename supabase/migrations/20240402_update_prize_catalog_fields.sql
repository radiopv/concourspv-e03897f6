-- Remove is_active column and add is_archived and is_hidden
alter table public.prize_catalog 
  drop column if exists is_active,
  add column if not exists is_archived boolean default false,
  add column if not exists is_hidden boolean default false;