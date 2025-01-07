-- Add columns for tracking question usage
ALTER TABLE question_bank
ADD COLUMN IF NOT EXISTS last_used_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_used_contest TEXT;