-- Add foreign key constraint between participants and contests
ALTER TABLE public.participants
ADD CONSTRAINT fk_participants_contest
FOREIGN KEY (contest_id)
REFERENCES public.contests(id)
ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_participants_contest_id
ON public.participants(contest_id);

-- Update RLS policies to reflect the relationship
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
ON public.participants FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.participants FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for contest owners"
ON public.participants FOR UPDATE
USING (
    EXISTS (
        SELECT 1
        FROM public.contests c
        WHERE c.id = participants.contest_id
        AND c.created_by = auth.uid()
    )
);