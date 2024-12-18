-- Create prizes table
create table public.prizes (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    contest_id uuid references public.contests(id) on delete cascade not null,
    catalog_item_id uuid references public.prize_catalog(id) not null
);

-- Enable RLS
alter table public.prizes enable row level security;

-- Create policies
create policy "Authenticated users can manage prizes"
    on public.prizes
    for all
    to authenticated
    using (true)
    with check (true);

create policy "Public users can view prizes"
    on public.prizes
    for select
    to public
    using (true);