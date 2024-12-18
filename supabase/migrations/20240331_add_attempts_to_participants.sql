-- Add attempts column to participants table
ALTER TABLE participants ADD COLUMN attempts INTEGER DEFAULT 0;

-- Update RLS policies
ALTER POLICY "Enable read access for all users" ON "public"."participants"
    USING (true);

ALTER POLICY "Enable update for users based on id" ON "public"."participants"
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);