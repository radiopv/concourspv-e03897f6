-- Add new columns for contest features
ALTER TABLE contests
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_new boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_big_prizes boolean DEFAULT false;

-- Create policy to allow admins to update these fields
CREATE POLICY "Enable update for admins on contests features" ON contests
FOR UPDATE
USING (auth.jwt() ->> 'email' = 'renaudcanuel@me.com')
WITH CHECK (auth.jwt() ->> 'email' = 'renaudcanuel@me.com');