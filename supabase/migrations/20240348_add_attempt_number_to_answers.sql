-- Add attempt_number column to participant_answers if it doesn't exist
ALTER TABLE participant_answers 
ADD COLUMN IF NOT EXISTS attempt_number INTEGER DEFAULT 0;

-- Update existing answers to have attempt_number = 0
UPDATE participant_answers 
SET attempt_number = 0 
WHERE attempt_number IS NULL;

-- Add composite unique constraint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_participant_question_attempt'
    ) THEN
        ALTER TABLE participant_answers 
        ADD CONSTRAINT unique_participant_question_attempt 
        UNIQUE (participant_id, question_id, attempt_number);
    END IF;
END $$;