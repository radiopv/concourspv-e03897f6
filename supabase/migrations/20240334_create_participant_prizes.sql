-- Create participant_prizes junction table
create table public.participant_prizes (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    participant_id uuid references public.participants(id) on delete cascade not null,
    prize_id uuid references public.prize_catalog(id) not null
);

-- Enable RLS
alter table public.participant_prizes enable row level security;

-- Create policies
create policy "Authenticated users can manage participant prizes"
    on public.participant_prizes
    for all
    to authenticated
    using (true)
    with check (true);

create policy "Public users can view participant prizes"
    on public.participant_prizes
    for select
    to public
    using (true);