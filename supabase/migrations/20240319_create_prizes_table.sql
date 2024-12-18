-- Create the prizes table
create table public.prizes (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    contest_id uuid references public.contests(id) on delete cascade not null,
    catalog_item_id uuid references public.prize_catalog(id) not null
);

-- Enable RLS
alter table public.prizes enable row level security;

-- Create policies
create policy "Anyone can view prizes"
    on public.prizes
    for select
    using (true);

create policy "Authenticated users can insert prizes"
    on public.prizes
    for insert
    to authenticated
    with check (true);

create policy "Authenticated users can update prizes"
    on public.prizes
    for update
    to authenticated
    using (true);

create policy "Authenticated users can delete prizes"
    on public.prizes
    for delete
    to authenticated
    using (true);

-- Create storage bucket for prize images if it doesn't exist
insert into storage.buckets (id, name)
values ('prizes', 'prizes')
on conflict do nothing;

-- Enable public access to prize images
create policy "Public Access"
    on storage.objects for select
    using ( bucket_id = 'prizes' );

create policy "Auth Upload"
    on storage.objects for insert
    to authenticated
    with check ( bucket_id = 'prizes' );

create policy "Auth Delete"
    on storage.objects for delete
    to authenticated
    using ( bucket_id = 'prizes' );