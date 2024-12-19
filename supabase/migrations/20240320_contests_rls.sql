-- Enable RLS
alter table contests enable row level security;

-- Create policy for admins to do everything
create policy "Admins can do everything on contests"
on contests
for all
using (
  auth.jwt() ->> 'email' = 'renaudcanuel@me.com'
);

-- Create policy for authenticated users to view contests
create policy "Authenticated users can view contests"
on contests
for select
using (
  auth.role() = 'authenticated'
);

-- Create policy for public to view active contests
create policy "Public can view active contests"
on contests
for select
using (
  status = 'active'
);