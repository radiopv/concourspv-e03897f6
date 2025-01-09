-- Drop existing constraints
ALTER TABLE participants 
DROP CONSTRAINT IF EXISTS participants_pkey1,
DROP CONSTRAINT IF EXISTS participants_pkey;

-- Ensure participation_id is UUID and NOT NULL
ALTER TABLE participants 
ALTER COLUMN participation_id SET DATA TYPE UUID USING (gen_random_uuid()),
ALTER COLUMN participation_id SET NOT NULL;

-- Add new primary key constraint
ALTER TABLE participants 
ADD CONSTRAINT participants_pkey PRIMARY KEY (participation_id);

-- Add unique constraint for user-contest combination
ALTER TABLE participants 
DROP CONSTRAINT IF EXISTS unique_user_contest,
ADD CONSTRAINT unique_user_contest UNIQUE (id, contest_id);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';