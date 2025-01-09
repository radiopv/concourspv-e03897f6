-- Drop and recreate the is_correct column to ensure it's properly added
ALTER TABLE participant_answers DROP COLUMN IF EXISTS is_correct;
ALTER TABLE participant_answers ADD COLUMN is_correct BOOLEAN DEFAULT false;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';