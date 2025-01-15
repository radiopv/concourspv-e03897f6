-- Drop existing table if it exists
DROP TABLE IF EXISTS prizes CASCADE;

-- Recreate prizes table with proper foreign key relationship
CREATE TABLE public.prizes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    contest_id uuid REFERENCES public.contests(id) ON DELETE CASCADE,
    prize_catalog_id uuid REFERENCES public.prize_catalog(id) ON DELETE CASCADE NOT NULL,
    is_choice boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can manage prizes"
    ON public.prizes
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public users can view prizes"
    ON public.prizes
    FOR SELECT
    TO public
    USING (true);

-- Create indexes for better performance
CREATE INDEX idx_prizes_contest_id ON prizes(contest_id);
CREATE INDEX idx_prizes_prize_catalog_id ON prizes(prize_catalog_id);