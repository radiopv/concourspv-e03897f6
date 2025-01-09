-- First, drop the existing foreign key constraint if it exists
ALTER TABLE participant_answers
DROP CONSTRAINT IF EXISTS participant_answers_participant_id_fkey;

-- Add the correct foreign key constraint referencing the participants table
ALTER TABLE participant_answers
ADD CONSTRAINT participant_answers_participant_id_fkey
FOREIGN KEY (participant_id)
REFERENCES participants(participation_id)
ON DELETE CASCADE;

-- Ensure the participants table has the correct primary key
ALTER TABLE participants
ADD COLUMN IF NOT EXISTS participation_id UUID DEFAULT gen_random_uuid(),
ADD PRIMARY KEY (participation_id);

-- Update RLS policies
ALTER POLICY "Enable read access for all users" ON "public"."participant_answers"
    USING (true);

ALTER POLICY "Enable insert for authenticated users only" ON "public"."participant_answers"
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);