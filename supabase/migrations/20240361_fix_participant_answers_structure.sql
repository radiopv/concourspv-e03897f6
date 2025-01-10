-- Ajout de la colonne is_correct si elle n'existe pas
ALTER TABLE public.participant_answers 
ADD COLUMN IF NOT EXISTS is_correct BOOLEAN DEFAULT false;

-- Ajout de la colonne attempt_number si elle n'existe pas
ALTER TABLE public.participant_answers 
ADD COLUMN IF NOT EXISTS attempt_number INTEGER DEFAULT 0;

-- Mise à jour de la contrainte unique pour inclure attempt_number
ALTER TABLE public.participant_answers 
DROP CONSTRAINT IF EXISTS unique_participant_question_attempt;

ALTER TABLE public.participant_answers 
ADD CONSTRAINT unique_participant_question_attempt 
UNIQUE (participant_id, question_id, attempt_number);

-- Rafraîchir le cache du schéma
NOTIFY pgrst, 'reload schema';