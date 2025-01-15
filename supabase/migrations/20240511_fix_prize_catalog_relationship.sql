-- First, ensure we have the correct column name
ALTER TABLE IF EXISTS public.prizes 
  RENAME COLUMN catalog_item_id TO prize_catalog_id;

-- Drop existing constraints if they exist
ALTER TABLE IF EXISTS public.prizes
DROP CONSTRAINT IF EXISTS prizes_catalog_item_id_fkey,
DROP CONSTRAINT IF EXISTS prizes_prize_catalog_id_fkey,
DROP CONSTRAINT IF EXISTS fk_prize_catalog;

-- Add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.prizes
ADD CONSTRAINT fk_prize_catalog
FOREIGN KEY (prize_catalog_id)
REFERENCES public.prize_catalog(id)
ON DELETE CASCADE;

-- Create an index to improve join performance
CREATE INDEX IF NOT EXISTS idx_prizes_prize_catalog_id 
ON public.prizes(prize_catalog_id);

-- Refresh the schema cache
SELECT pg_reload_conf();