-- Add prize claiming fields to participants table
alter table public.participants
add column prize_claimed boolean default false,
add column prize_claimed_at timestamp with time zone,
add column shipping_address text,
add column phone_number text,
add column claim_notes text;

-- Update RLS policies
create policy "Winners can update their prize claim"
    on public.participants
    for update
    using (status = 'winner')
    with check (status = 'winner');