-- Add completed_at column to participants table
ALTER TABLE participants ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;

-- Update RLS policies to allow reading and updating completed_at
ALTER POLICY "Enable read access for all users" ON "public"."participants"
    USING (true);

ALTER POLICY "Enable insert for authenticated users only" ON "public"."participants"
    USING (auth.uid() = id);

ALTER POLICY "Enable update for users based on id" ON "public"."participants"
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);