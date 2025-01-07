-- Disable RLS temporarily to apply changes
ALTER TABLE questionnaires DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Questionnaires are viewable by everyone" ON questionnaires;
DROP POLICY IF EXISTS "Authenticated users can create questionnaires" ON questionnaires;
DROP POLICY IF EXISTS "Authenticated users can update questionnaires" ON questionnaires;
DROP POLICY IF EXISTS "Authenticated users can delete questionnaires" ON questionnaires;

-- Enable RLS
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper access control
CREATE POLICY "Enable read access for all users"
ON questionnaires FOR SELECT
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON questionnaires FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON questionnaires FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON questionnaires FOR DELETE
TO authenticated
USING (true);