-- First, drop the existing foreign key constraint
ALTER TABLE participant_answers 
DROP CONSTRAINT IF EXISTS participant_answers_participant_id_fkey;

-- Add the correct foreign key constraint referencing the participants table's participation_id
ALTER TABLE participant_answers
ADD CONSTRAINT participant_answers_participant_id_fkey
FOREIGN KEY (participant_id)
REFERENCES participants(participation_id)
ON DELETE CASCADE;

-- Ensure RLS policies are updated
ALTER POLICY "Enable read access for all users" ON "public"."participant_answers"
    USING (true);

ALTER POLICY "Enable insert for authenticated users only" ON "public"."participant_answers"
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';