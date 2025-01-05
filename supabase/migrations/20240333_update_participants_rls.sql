-- Enable RLS
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
ON "public"."participants"
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON "public"."participants"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
ON "public"."participants"
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Enable delete for admin only"
ON "public"."participants"
FOR DELETE
TO authenticated
USING (auth.email() = 'renaudcanuel@me.com');

-- Add check constraint for status
ALTER TABLE participants DROP CONSTRAINT IF EXISTS participants_status_check;
ALTER TABLE participants ADD CONSTRAINT participants_status_check 
  CHECK (status IN ('pending', 'completed', 'winner'));