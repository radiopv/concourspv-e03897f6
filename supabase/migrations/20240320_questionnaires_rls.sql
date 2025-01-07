-- Enable RLS on questionnaires table
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;

-- Policy to allow reading questionnaires by anyone
CREATE POLICY "Questionnaires are viewable by everyone" 
ON questionnaires FOR SELECT 
TO public 
USING (true);

-- Policy to allow inserting questionnaires by authenticated users
CREATE POLICY "Authenticated users can create questionnaires" 
ON questionnaires FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy to allow updating questionnaires by authenticated users
CREATE POLICY "Authenticated users can update questionnaires" 
ON questionnaires FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Policy to allow deleting questionnaires by authenticated users
CREATE POLICY "Authenticated users can delete questionnaires" 
ON questionnaires FOR DELETE 
TO authenticated 
USING (true);