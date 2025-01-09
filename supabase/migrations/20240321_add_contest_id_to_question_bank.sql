-- Add contest_id to question_bank table
ALTER TABLE question_bank
ADD COLUMN contest_id UUID REFERENCES contests(id);

-- Add foreign key constraint
ALTER TABLE question_bank
ADD CONSTRAINT fk_question_bank_contest
FOREIGN KEY (contest_id)
REFERENCES contests(id)
ON DELETE SET NULL;