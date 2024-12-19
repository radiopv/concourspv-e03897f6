-- Add foreign key constraint to ensure winners are linked to contests
ALTER TABLE participants
ADD CONSTRAINT fk_contest
FOREIGN KEY (contest_id)
REFERENCES contests(id)
ON DELETE CASCADE;

-- Add index to improve query performance
CREATE INDEX idx_participants_contest_status
ON participants(contest_id, status);

-- Update RLS policies to ensure proper access control
CREATE POLICY "Anyone can view winners"
ON participants
FOR SELECT
USING (
  status = 'winner' AND
  EXISTS (
    SELECT 1 FROM contests
    WHERE contests.id = participants.contest_id
    AND (contests.is_active = true OR auth.role() = 'authenticated')
  )
);