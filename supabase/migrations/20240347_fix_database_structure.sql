-- Supprime d'abord les contraintes existantes pour éviter les conflits
ALTER TABLE participant_answers 
DROP CONSTRAINT IF EXISTS participant_answers_participant_id_fkey;

ALTER TABLE participants 
DROP CONSTRAINT IF EXISTS participants_pkey,
DROP CONSTRAINT IF EXISTS participants_pkey1,
DROP CONSTRAINT IF EXISTS unique_user_contest;

-- Nettoie les données incohérentes
DELETE FROM participant_answers 
WHERE participant_id NOT IN (SELECT participation_id FROM participants);

-- Configure correctement la table participants
ALTER TABLE participants 
ALTER COLUMN participation_id SET DATA TYPE UUID USING (gen_random_uuid()),
ALTER COLUMN participation_id SET NOT NULL,
ADD PRIMARY KEY (participation_id),
ADD CONSTRAINT unique_user_contest UNIQUE (id, contest_id);

-- Recrée la contrainte de clé étrangère pour participant_answers
ALTER TABLE participant_answers
ADD CONSTRAINT participant_answers_participant_id_fkey
FOREIGN KEY (participant_id)
REFERENCES participants(participation_id)
ON DELETE CASCADE;

-- Rafraîchit le cache du schéma
NOTIFY pgrst, 'reload schema';