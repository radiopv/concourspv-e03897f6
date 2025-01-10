-- Supprime l'ancienne contrainte unique si elle existe
ALTER TABLE public.participant_answers 
DROP CONSTRAINT IF EXISTS unique_participant_question;

-- Ajoute une nouvelle contrainte unique qui inclut le numéro de tentative
ALTER TABLE public.participant_answers 
ADD CONSTRAINT unique_participant_question_attempt 
UNIQUE (participant_id, question_id, attempt_number);

-- Met à jour les politiques RLS pour permettre plusieurs tentatives
ALTER POLICY "Enable insert for authenticated users only" ON "public"."participant_answers"
USING (auth.role() = 'authenticated');

-- Ajoute un index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_participant_answers_attempt 
ON public.participant_answers(participant_id, question_id, attempt_number);