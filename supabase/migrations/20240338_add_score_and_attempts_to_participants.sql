-- Add score and attempts columns if they don't exist
ALTER TABLE participants 
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 0;

-- Update RLS policies to allow access to the new columns
ALTER POLICY "Enable read access for all users" ON "public"."participants"
    USING (true);

ALTER POLICY "Enable update for users based on id" ON "public"."participants"
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);