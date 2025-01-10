-- First, drop the existing foreign key if it exists
ALTER TABLE IF EXISTS public.prizes
DROP CONSTRAINT IF EXISTS prizes_catalog_item_id_fkey;

-- Add the foreign key constraint with a proper name
ALTER TABLE public.prizes
ADD CONSTRAINT fk_prize_catalog
FOREIGN KEY (catalog_item_id)
REFERENCES public.prize_catalog(id)
ON DELETE CASCADE;

-- Create an index to improve join performance
CREATE INDEX IF NOT EXISTS idx_prizes_catalog_item_id
ON public.prizes(catalog_item_id);