-- Remove is_active column and add is_archived and is_hidden
alter table public.prize_catalog 
  drop column is_active,
  add column is_archived boolean default false,
  add column is_hidden boolean default false;