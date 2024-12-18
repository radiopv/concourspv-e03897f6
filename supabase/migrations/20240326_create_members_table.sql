-- Create members table
create table public.members (
    id uuid references auth.users on delete cascade not null primary key,
    first_name text,
    last_name text,
    email text unique not null,
    phone_number text,
    avatar_url text,
    notifications_enabled boolean default true,
    share_scores boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table members enable row level security;

-- Create policies
create policy "Users can view their own profile"
    on members for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on members for update
    using (auth.uid() = id);

-- Create storage bucket for avatars if it doesn't exist
create bucket if not exists avatars;

-- Set bucket to public
update storage.buckets
set public = true
where id = 'avatars';

-- Drop existing policies if they exist
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;

-- Create new storage policies
create policy "Avatar images are publicly accessible"
    on storage.objects for select
    using ( bucket_id = 'avatars' );

create policy "Users can upload their own avatar"
    on storage.objects for insert
    with check (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
    );

create policy "Users can update their own avatar"
    on storage.objects for update
    using (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
    );

create policy "Users can delete their own avatar"
    on storage.objects for delete
    using (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
    );

-- Enable RLS on storage.objects
alter table storage.objects enable row level security;