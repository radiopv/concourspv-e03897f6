-- Create the prize catalog table
create table public.prize_catalog (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    description text,
    image_url text,
    value decimal(10,2),
    category text,
    stock integer default 0,
    is_active boolean default true
);

-- Modify the prizes table to reference the catalog
alter table public.prizes 
add column catalog_item_id uuid references public.prize_catalog(id);

-- Enable RLS
alter table public.prize_catalog enable row level security;

-- Create policies for prize_catalog
create policy "Anyone can view prize catalog"
    on public.prize_catalog
    for select
    using (true);

create policy "Authenticated users can manage prize catalog"
    on public.prize_catalog
    for all
    to authenticated
    using (true)
    with check (true);

-- Insert some sample prizes into the catalog
insert into public.prize_catalog (name, description, value, category, stock, is_active) values
    ('iPhone 15', 'Dernier modèle iPhone avec 128GB', 999.99, 'Électronique', 5, true),
    ('PlayStation 5', 'Console de jeu PS5 avec manette', 499.99, 'Gaming', 3, true),
    ('Carte cadeau Amazon', 'Carte cadeau Amazon de 100€', 100.00, 'Cartes Cadeaux', 20, true),
    ('AirPods Pro', 'Écouteurs sans fil Apple', 279.99, 'Audio', 10, true),
    ('Nintendo Switch', 'Console portable Nintendo', 299.99, 'Gaming', 5, true);