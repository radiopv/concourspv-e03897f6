-- Enable RLS on questions table
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Policy to allow reading questions by anyone
CREATE POLICY "Questions are viewable by everyone" 
ON questions FOR SELECT 
TO public 
USING (true);

-- Policy to allow inserting questions by authenticated users
CREATE POLICY "Authenticated users can create questions" 
ON questions FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy to allow updating questions by authenticated users
CREATE POLICY "Authenticated users can update questions" 
ON questions FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Policy to allow deleting questions by authenticated users
CREATE POLICY "Authenticated users can delete questions" 
ON questions FOR DELETE 
TO authenticated 
USING (true);