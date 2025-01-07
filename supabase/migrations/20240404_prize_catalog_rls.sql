-- Enable RLS on prize_catalog table
ALTER TABLE prize_catalog ENABLE ROW LEVEL SECURITY;

-- Policy to allow reading prize catalog by anyone
CREATE POLICY "Prize catalog is viewable by everyone" 
ON prize_catalog FOR SELECT 
TO public 
USING (true);

-- Policy to allow inserting prizes by authenticated users
CREATE POLICY "Authenticated users can create prizes" 
ON prize_catalog FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy to allow updating prizes by authenticated users
CREATE POLICY "Authenticated users can update prizes" 
ON prize_catalog FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Policy to allow deleting prizes by authenticated users
CREATE POLICY "Authenticated users can delete prizes" 
ON prize_catalog FOR DELETE 
TO authenticated 
USING (true);

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Anyone can view prize catalog" ON prize_catalog;
DROP POLICY IF EXISTS "Authenticated users can manage prize catalog" ON prize_catalog;