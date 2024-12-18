-- Add draw_date column to contests table
ALTER TABLE contests ADD COLUMN IF NOT EXISTS draw_date TIMESTAMP WITH TIME ZONE;

-- Update RLS policies
ALTER POLICY "Enable read access for all users" ON "public"."contests"
    USING (true);

ALTER POLICY "Enable update for authenticated users only" ON "public"."contests"
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');