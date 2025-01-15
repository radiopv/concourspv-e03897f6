-- Create the prizes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.prizes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    contest_id uuid REFERENCES public.contests(id) ON DELETE CASCADE NOT NULL,
    catalog_item_id uuid REFERENCES public.prize_catalog(id) ON DELETE CASCADE NOT NULL
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

-- Add the foreign key constraint with the correct name
ALTER TABLE public.prizes
ADD CONSTRAINT fk_prize_catalog
FOREIGN KEY (catalog_item_id)
REFERENCES public.prize_catalog(id)
ON DELETE CASCADE;

-- Create indexes to improve join performance
CREATE INDEX IF NOT EXISTS idx_prizes_catalog_item_id
ON public.prizes(catalog_item_id);

CREATE INDEX IF NOT EXISTS idx_prizes_contest_id
ON public.prizes(contest_id);