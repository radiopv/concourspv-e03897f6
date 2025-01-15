-- Drop existing constraints if they exist
ALTER TABLE IF EXISTS public.prizes
DROP CONSTRAINT IF EXISTS prizes_catalog_item_id_fkey,
DROP CONSTRAINT IF EXISTS prizes_prize_catalog_id_fkey;

-- Rename column if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'prizes' AND column_name = 'catalog_item_id') THEN
        ALTER TABLE public.prizes RENAME COLUMN catalog_item_id TO prize_catalog_id;
    END IF;
END $$;

-- Add or update the foreign key constraint
ALTER TABLE public.prizes
ADD CONSTRAINT fk_prize_catalog
FOREIGN KEY (prize_catalog_id)
REFERENCES public.prize_catalog(id)
ON DELETE CASCADE;

-- Create an index to improve join performance
CREATE INDEX IF NOT EXISTS idx_prizes_prize_catalog_id
ON public.prizes(prize_catalog_id);