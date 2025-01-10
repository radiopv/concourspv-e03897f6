-- Add question_bank_id to questions table
ALTER TABLE questions
ADD COLUMN question_bank_id UUID REFERENCES question_bank(id);

-- Add status column to questions
ALTER TABLE questions
ADD COLUMN status TEXT NOT NULL DEFAULT 'active';