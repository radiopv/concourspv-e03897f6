-- Add missing columns to participants table
ALTER TABLE participants 
ADD COLUMN IF NOT EXISTS participation_id UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;

-- Add primary key constraint on participation_id
ALTER TABLE participants 
DROP CONSTRAINT IF EXISTS participants_pkey,
ADD PRIMARY KEY (participation_id);

-- Add composite unique constraint for user-contest combination
ALTER TABLE participants 
DROP CONSTRAINT IF EXISTS unique_user_contest,
ADD CONSTRAINT unique_user_contest UNIQUE (id, contest_id);

-- Update RLS policies
ALTER POLICY "Enable read access for all users" ON "public"."participants"
    USING (true);

ALTER POLICY "Enable insert for authenticated users only" ON "public"."participants"
    USING (auth.uid() = id);

ALTER POLICY "Enable update for users based on id" ON "public"."participants"
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);