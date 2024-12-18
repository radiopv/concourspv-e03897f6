-- Create the members table
create table public.members (
    id uuid references auth.users on delete cascade primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    first_name text not null,
    last_name text not null,
    email text not null unique,
    phone_number text,
    avatar_url text,
    notifications_enabled boolean default true,
    share_scores boolean default true,
    bio text,
    total_points integer default 0,
    contests_participated integer default 0,
    contests_won integer default 0
);

-- Enable RLS
alter table public.members enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
    on members for select
    using (true);

create policy "Users can insert their own profile"
    on members for insert
    with check (auth.uid() = id);

create policy "Users can update own profile"
    on members for update
    using (auth.uid() = id);

-- Create storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Enable public access to avatars
create policy "Avatar images are publicly accessible"
    on storage.objects for select
    using ( bucket_id = 'avatars' );

create policy "Users can upload their own avatar"
    on storage.objects for insert
    with check ( bucket_id = 'avatars' );

create policy "Users can update their own avatar"
    on storage.objects for update
    using ( bucket_id = 'avatars' );

create policy "Users can delete their own avatar"
    on storage.objects for delete
    using ( bucket_id = 'avatars' );