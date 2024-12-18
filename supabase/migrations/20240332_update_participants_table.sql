-- Drop existing primary key constraint
ALTER TABLE participants DROP CONSTRAINT IF EXISTS participants_pkey;

-- Add a new UUID column for unique participation ID
ALTER TABLE participants ADD COLUMN IF NOT EXISTS participation_id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Create a composite unique constraint for user-contest combination
ALTER TABLE participants 
ADD CONSTRAINT unique_user_contest UNIQUE (id, contest_id);

-- Update RLS policies
ALTER POLICY "Enable read access for all users" ON "public"."participants"
    USING (true);

ALTER POLICY "Enable insert for authenticated users only" ON "public"."participants"
    USING (auth.uid() = id);

ALTER POLICY "Enable update for users based on id" ON "public"."participants"
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);