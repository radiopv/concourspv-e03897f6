-- Supprimer l'ancienne contrainte de clé étrangère si elle existe
ALTER TABLE IF EXISTS public.participant_prizes
DROP CONSTRAINT IF EXISTS participant_prizes_participant_id_fkey;

-- Ajouter la nouvelle contrainte de clé étrangère avec la bonne référence
ALTER TABLE public.participant_prizes
ADD CONSTRAINT participant_prizes_participant_id_fkey
FOREIGN KEY (participant_id)
REFERENCES public.participants(participation_id)
ON DELETE CASCADE;

-- Créer un index pour améliorer les performances des jointures
CREATE INDEX IF NOT EXISTS idx_participant_prizes_participant_id
ON public.participant_prizes(participant_id);

-- Mettre à jour les politiques RLS pour assurer la cohérence
ALTER TABLE public.participant_prizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view their own prizes"
ON public.participant_prizes
FOR SELECT
USING (
  participant_id IN (
    SELECT participation_id 
    FROM public.participants 
    WHERE auth.uid() = id
  )
);

CREATE POLICY "Admins can manage all participant prizes"
ON public.participant_prizes
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.members 
    WHERE user_id = auth.uid() 
    AND role = 'ADMIN'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.members 
    WHERE user_id = auth.uid() 
    AND role = 'ADMIN'
  )
);