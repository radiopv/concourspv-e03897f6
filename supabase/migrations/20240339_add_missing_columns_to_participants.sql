-- Add missing columns to participants table
ALTER TABLE participants 
ADD COLUMN IF NOT EXISTS participation_id UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 0;

-- Add primary key constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'participants_pkey'
    ) THEN
        ALTER TABLE participants ADD PRIMARY KEY (participation_id);
    END IF;
END $$;

-- Add composite unique constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_user_contest'
    ) THEN
        ALTER TABLE participants ADD CONSTRAINT unique_user_contest UNIQUE (id, contest_id);
    END IF;
END $$;

-- Update RLS policies
ALTER POLICY "Enable read access for all users" ON "public"."participants"
    USING (true);

ALTER POLICY "Enable update for users based on id" ON "public"."participants"
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);