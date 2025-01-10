-- Supprime d'abord les contraintes existantes
ALTER TABLE participant_answers 
DROP CONSTRAINT IF EXISTS participant_answers_participant_id_fkey,
DROP CONSTRAINT IF EXISTS unique_participant_question_attempt;

-- Modifie le type des colonnes pour utiliser UUID
ALTER TABLE participant_answers
ALTER COLUMN participant_id TYPE UUID USING participant_id::UUID,
ALTER COLUMN question_id TYPE UUID USING question_id::UUID;

-- Recrée les contraintes avec les bons types
ALTER TABLE participant_answers
ADD CONSTRAINT participant_answers_participant_id_fkey
FOREIGN KEY (participant_id)
REFERENCES participants(participation_id)
ON DELETE CASCADE;

-- Ajoute la contrainte unique avec attempt_number
ALTER TABLE participant_answers
ADD CONSTRAINT unique_participant_question_attempt
UNIQUE (participant_id, question_id, attempt_number);

-- Rafraîchit le cache du schéma
NOTIFY pgrst, 'reload schema';