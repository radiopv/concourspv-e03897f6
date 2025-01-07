-- Drop type column if it exists (to avoid conflicts)
ALTER TABLE questions DROP COLUMN IF EXISTS type;

-- Add type column to questions table with NOT NULL constraint and default value
ALTER TABLE questions 
ADD COLUMN type text NOT NULL DEFAULT 'multiple_choice';