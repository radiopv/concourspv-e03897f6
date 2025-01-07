-- Add new columns for extended profile information
ALTER TABLE members
ADD COLUMN IF NOT EXISTS facebook_profile_url TEXT,
ADD COLUMN IF NOT EXISTS street_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'France',
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Update the RLS policies to allow users to update their own profile
CREATE POLICY "Users can update their own extended profile"
ON members
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);