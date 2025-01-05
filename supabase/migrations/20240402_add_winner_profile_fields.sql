-- Add profile fields to participants table
alter table public.participants
add column if not exists facebook_profile_url text,
add column if not exists profile_image_url text;