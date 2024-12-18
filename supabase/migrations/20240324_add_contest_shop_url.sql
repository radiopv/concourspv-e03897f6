-- Ajouter les colonnes shop_url et prize_image_url à la table contests
alter table public.contests 
add column shop_url text,
add column prize_image_url text;

-- Mettre à jour les politiques RLS pour permettre la lecture et l'écriture de ces colonnes
create policy "Anyone can view contest shop_url and prize_image_url"
    on public.contests
    for select
    using (true);

create policy "Authenticated users can update contest shop_url and prize_image_url"
    on public.contests
    for update
    to authenticated
    using (true)
    with check (true);