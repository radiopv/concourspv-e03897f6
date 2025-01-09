-- Add score column if it doesn't exist
ALTER TABLE participants 
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;

-- Update RLS policies to allow access to the new column
ALTER POLICY "Enable read access for all users" ON "public"."participants"
    USING (true);

ALTER POLICY "Enable update for users based on id" ON "public"."participants"
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);