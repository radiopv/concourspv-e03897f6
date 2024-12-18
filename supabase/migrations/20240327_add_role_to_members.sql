-- Add role column to members table if it doesn't exist
alter table public.members 
add column if not exists role text default 'user';

-- Add check constraint to ensure role is either 'user' or 'admin'
alter table public.members 
drop constraint if exists members_role_check;

alter table public.members 
add constraint members_role_check 
check (role in ('user', 'admin'));

-- Update your email to be admin
update public.members 
set role = 'admin' 
where email = 'admin@passionvaradero.com';