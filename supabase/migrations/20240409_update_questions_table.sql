-- Drop type column if it exists (to avoid conflicts)
ALTER TABLE questions DROP COLUMN IF EXISTS type;

-- Add type column to questions table
ALTER TABLE questions 
ADD COLUMN type text DEFAULT 'multiple_choice';