
-- Add new columns for enhanced contest features
ALTER TABLE contests
ADD COLUMN IF NOT EXISTS is_exclusive boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_limited boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_vip boolean DEFAULT false;

-- Update existing policies to include new columns
CREATE POLICY "Enable update for admins on new contest features" ON contests
FOR UPDATE
USING (auth.jwt() ->> 'email' = 'renaudcanuel@me.com')
WITH CHECK (auth.jwt() ->> 'email' = 'renaudcanuel@me.com');
