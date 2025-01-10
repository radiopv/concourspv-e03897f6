-- Supprime d'abord les contraintes existantes pour pouvoir modifier la table
ALTER TABLE participant_answers 
DROP CONSTRAINT IF EXISTS participant_answers_participant_id_fkey,
DROP CONSTRAINT IF EXISTS unique_participant_question_attempt;

-- Vérifie et ajoute la colonne is_correct si elle n'existe pas
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'participant_answers' 
                  AND column_name = 'is_correct') THEN
        ALTER TABLE participant_answers ADD COLUMN is_correct BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Vérifie et ajoute la colonne attempt_number si elle n'existe pas
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'participant_answers' 
                  AND column_name = 'attempt_number') THEN
        ALTER TABLE participant_answers ADD COLUMN attempt_number INTEGER DEFAULT 0;
    END IF;
END $$;

-- S'assure que les colonnes participant_id et question_id sont de type UUID
ALTER TABLE participant_answers
ALTER COLUMN participant_id TYPE UUID USING participant_id::UUID,
ALTER COLUMN question_id TYPE UUID USING question_id::UUID;

-- Recrée les contraintes
ALTER TABLE participant_answers
ADD CONSTRAINT participant_answers_participant_id_fkey
FOREIGN KEY (participant_id)
REFERENCES participants(participation_id)
ON DELETE CASCADE;

-- Ajoute la contrainte unique
ALTER TABLE participant_answers
ADD CONSTRAINT unique_participant_question_attempt
UNIQUE (participant_id, question_id, attempt_number);

-- Rafraîchit le cache du schéma
NOTIFY pgrst, 'reload schema';