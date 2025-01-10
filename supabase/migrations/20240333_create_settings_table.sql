create table if not exists public.settings (
    id bigint primary key generated always as identity,
    default_attempts integer not null default 3,
    required_percentage integer not null default 90,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default settings
insert into public.settings (default_attempts, required_percentage)
values (3, 90);

-- Enable RLS
alter table public.settings enable row level security;

-- Create policies
create policy "Allow anonymous read access to settings"
    on public.settings for select
    to anon
    using (true);

create policy "Allow authenticated read access to settings"
    on public.settings for select
    to authenticated
    using (true);

create policy "Allow admin insert access to settings"
    on public.settings for insert
    to authenticated
    using (true);

create policy "Allow admin update access to settings"
    on public.settings for update
    to authenticated
    using (true);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_settings_updated_at
    before update on public.settings
    for each row
    execute function public.handle_updated_at();