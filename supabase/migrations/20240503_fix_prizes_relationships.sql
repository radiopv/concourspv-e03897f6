-- Drop existing constraints if they exist
ALTER TABLE IF EXISTS public.prizes
DROP CONSTRAINT IF EXISTS prizes_catalog_item_id_fkey,
DROP CONSTRAINT IF EXISTS prizes_prize_catalog_id_fkey,
DROP CONSTRAINT IF EXISTS fk_prize_catalog;

-- Recreate the prizes table with correct relationships
CREATE TABLE IF NOT EXISTS public.prizes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    contest_id uuid REFERENCES public.contests(id) ON DELETE CASCADE,
    prize_catalog_id uuid REFERENCES public.prize_catalog(id) ON DELETE CASCADE,
    is_choice boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users"
    ON public.prizes FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users only"
    ON public.prizes FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
    ON public.prizes FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Enable delete for authenticated users only"
    ON public.prizes FOR DELETE
    TO authenticated
    USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_prizes_contest_id ON public.prizes(contest_id);
CREATE INDEX IF NOT EXISTS idx_prizes_prize_catalog_id ON public.prizes(prize_catalog_id);