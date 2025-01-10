-- Enable RLS on all relevant tables if not already enabled
alter table public.contests enable row level security;
alter table public.questions enable row level security;
alter table public.participants enable row level security;
alter table public.prizes enable row level security;

-- Create or replace admin policies for contests
drop policy if exists "Admins can do everything on contests" on contests;
create policy "Admins can do everything on contests"
on public.contests
for all
using (auth.jwt() ->> 'email' = 'renaudcanuel@me.com')
with check (auth.jwt() ->> 'email' = 'renaudcanuel@me.com');

-- Create or replace admin policies for questions
drop policy if exists "Admins can do everything on questions" on questions;
create policy "Admins can do everything on questions"
on public.questions
for all
using (auth.jwt() ->> 'email' = 'renaudcanuel@me.com')
with check (auth.jwt() ->> 'email' = 'renaudcanuel@me.com');

-- Create or replace admin policies for participants
drop policy if exists "Admins can do everything on participants" on participants;
create policy "Admins can do everything on participants"
on public.participants
for all
using (auth.jwt() ->> 'email' = 'renaudcanuel@me.com')
with check (auth.jwt() ->> 'email' = 'renaudcanuel@me.com');

-- Create or replace admin policies for prizes
drop policy if exists "Admins can do everything on prizes" on prizes;
create policy "Admins can do everything on prizes"
on public.prizes
for all
using (auth.jwt() ->> 'email' = 'renaudcanuel@me.com')
with check (auth.jwt() ->> 'email' = 'renaudcanuel@me.com');

-- Ensure the user has the admin role
update public.members
set role = 'admin'
where email = 'renaudcanuel@me.com';