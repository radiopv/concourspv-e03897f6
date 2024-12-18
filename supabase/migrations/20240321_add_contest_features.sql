-- Add new columns for contest features
ALTER TABLE contests
ADD COLUMN is_featured BOOLEAN DEFAULT false,
ADD COLUMN is_new BOOLEAN DEFAULT false,
ADD COLUMN has_big_prizes BOOLEAN DEFAULT false;

-- Update the contests policy to allow updating these new fields
CREATE POLICY "Enable update for authenticated users only" ON "public"."contests"
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');