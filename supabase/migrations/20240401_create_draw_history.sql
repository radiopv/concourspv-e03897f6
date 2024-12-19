create table draw_history (
  id uuid default uuid_generate_v4() primary key,
  contest_id uuid references contests(id) on delete cascade not null,
  participant_id uuid references participants(id) on delete cascade not null,
  draw_date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ajout d'un index pour améliorer les performances des requêtes
create index draw_history_contest_id_idx on draw_history(contest_id);

-- Ajout d'une colonne pour la publication des résultats dans la table contests
alter table contests add column if not exists results_published boolean default false;
alter table contests add column if not exists results_published_at timestamp with time zone;

-- Politique RLS pour la table draw_history
create policy "Draw history is viewable by everyone"
  on draw_history for select
  using (true);

create policy "Draw history is insertable by authenticated users only"
  on draw_history for insert
  with check (auth.role() = 'authenticated');