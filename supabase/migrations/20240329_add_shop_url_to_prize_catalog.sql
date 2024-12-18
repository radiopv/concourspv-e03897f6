-- Add shop_url column to prize_catalog table
alter table public.prize_catalog 
add column shop_url text;

-- Update RLS policies to include the new column
create policy "Anyone can view prize_catalog shop_url"
    on public.prize_catalog
    for select
    using (true);

create policy "Authenticated users can update prize_catalog shop_url"
    on public.prize_catalog
    for update
    to authenticated
    using (true)
    with check (true);