-- Drop the score column if it exists (to avoid conflicts)
ALTER TABLE participants 
DROP COLUMN IF EXISTS score;

-- Add the score column
ALTER TABLE participants 
ADD COLUMN score INTEGER DEFAULT 0;

-- Update RLS policies to allow access to the score column
CREATE POLICY "Enable read access for score column" ON "public"."participants"
    FOR SELECT
    USING (true);

CREATE POLICY "Enable update for score column" ON "public"."participants"
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);