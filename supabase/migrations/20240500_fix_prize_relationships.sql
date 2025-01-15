-- Drop existing constraints if they exist
ALTER TABLE IF EXISTS prizes
DROP CONSTRAINT IF EXISTS prizes_catalog_item_id_fkey;

ALTER TABLE IF EXISTS participant_prizes
DROP CONSTRAINT IF EXISTS participant_prizes_prize_id_fkey;

-- Recreate the prizes table with proper foreign key
ALTER TABLE prizes
ADD CONSTRAINT prizes_catalog_item_id_fkey
FOREIGN KEY (catalog_item_id)
REFERENCES prize_catalog(id)
ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prizes_catalog_item_id
ON prizes(catalog_item_id);

CREATE INDEX IF NOT EXISTS idx_participant_prizes_prize_id
ON participant_prizes(prize_id);

-- Update the select queries in the components