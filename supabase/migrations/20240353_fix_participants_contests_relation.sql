-- Drop existing constraint if it exists
ALTER TABLE public.participants 
DROP CONSTRAINT IF EXISTS fk_participants_contest;

-- Add foreign key constraint between participants and contests
ALTER TABLE public.participants
ADD CONSTRAINT fk_participants_contest
FOREIGN KEY (contest_id)
REFERENCES public.contests(id)
ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_participants_contest_id
ON public.participants(contest_id);

-- Update RLS policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.participants;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.participants;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.participants;

CREATE POLICY "Enable read access for all users"
ON public.participants FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.participants FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on id"
ON public.participants FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';