-- Add image_url column to questions table
ALTER TABLE questions 
ADD COLUMN image_url TEXT;

-- Create storage bucket for question images if it doesn't exist
INSERT INTO storage.buckets (id, name)
SELECT 'questions', 'questions'
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'questions'
);

-- Set up storage policies for questions bucket
CREATE POLICY "Questions images are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'questions');

CREATE POLICY "Authenticated users can upload question images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'questions');

CREATE POLICY "Authenticated users can update question images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'questions');

CREATE POLICY "Authenticated users can delete question images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'questions');