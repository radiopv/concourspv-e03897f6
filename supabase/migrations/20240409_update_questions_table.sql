-- Add type column to questions table if it doesn't exist
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'multiple_choice';