-- Add columns for tracking question usage
ALTER TABLE question_bank
ADD COLUMN last_used_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN last_used_contest TEXT;