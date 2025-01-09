-- First, add is_correct column to participant_answers
ALTER TABLE participant_answers
ADD COLUMN IF NOT EXISTS is_correct BOOLEAN DEFAULT false;

-- Add completed_at column to participants if it doesn't exist
ALTER TABLE participants
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Drop the existing foreign key constraint if it exists
ALTER TABLE participant_answers
DROP CONSTRAINT IF EXISTS participant_answers_participant_id_fkey;

-- Ensure participants table has participation_id as primary key
ALTER TABLE participants
ADD COLUMN IF NOT EXISTS participation_id UUID DEFAULT gen_random_uuid(),
DROP CONSTRAINT IF EXISTS participants_pkey,
ADD PRIMARY KEY (participation_id);

-- Add the correct foreign key constraint
ALTER TABLE participant_answers
ADD CONSTRAINT participant_answers_participant_id_fkey
FOREIGN KEY (participant_id)
REFERENCES participants(participation_id)
ON DELETE CASCADE;

-- Update RLS policies for participant_answers
ALTER POLICY "Enable read access for all users" ON "public"."participant_answers"
    USING (true);

ALTER POLICY "Enable insert for authenticated users only" ON "public"."participant_answers"
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Update RLS policies for participants
ALTER POLICY "Enable read access for all users" ON "public"."participants"
    USING (true);

ALTER POLICY "Enable update for users based on id" ON "public"."participants"
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);