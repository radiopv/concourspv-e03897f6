-- Remove not-null constraint from questionnaire_id in questions table
ALTER TABLE questions 
ALTER COLUMN questionnaire_id DROP NOT NULL;

-- Add status column to participants table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'participants' 
                  AND column_name = 'status') THEN
        ALTER TABLE participants 
        ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- Add constraint to status column
ALTER TABLE participants
ADD CONSTRAINT participants_status_check
CHECK (status IN ('pending', 'completed', 'winner'));