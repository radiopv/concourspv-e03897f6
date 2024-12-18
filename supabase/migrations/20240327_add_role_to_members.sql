-- Add role column to members table
alter table public.members 
add column if not exists role text default 'user';

-- Add check constraint to ensure role is either 'user' or 'admin'
alter table public.members 
add constraint members_role_check 
check (role in ('user', 'admin'));

-- Update specific user to be admin
update public.members 
set role = 'admin' 
where email = 'renaudcanuel@me.com';