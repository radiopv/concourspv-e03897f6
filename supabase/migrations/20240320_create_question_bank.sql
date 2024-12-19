-- Create question bank table
CREATE TABLE question_bank (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  article_url TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Question bank is viewable by authenticated users" 
ON question_bank FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Question bank is insertable by authenticated users" 
ON question_bank FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Question bank is updatable by authenticated users" 
ON question_bank FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);