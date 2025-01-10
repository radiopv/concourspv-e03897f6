-- Add new columns to prize_catalog table
ALTER TABLE public.prize_catalog
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'archived')),
ADD COLUMN IF NOT EXISTS is_visible boolean DEFAULT true;

-- Update existing records to have default values
UPDATE public.prize_catalog 
SET status = 'active', is_visible = true 
WHERE status IS NULL OR is_visible IS NULL;