-- Supprime la colonne is_active si elle existe
ALTER TABLE public.prize_catalog 
DROP COLUMN IF EXISTS is_active;

-- Ajoute les nouvelles colonnes si elles n'existent pas déjà
ALTER TABLE public.prize_catalog 
ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_hidden boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS images text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS main_image_url text;

-- Met à jour les politiques RLS
DROP POLICY IF EXISTS "Anyone can view prize catalog" ON public.prize_catalog;
DROP POLICY IF EXISTS "Authenticated users can manage prize catalog" ON public.prize_catalog;

CREATE POLICY "Anyone can view prize catalog"
  ON public.prize_catalog
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage prize catalog"
  ON public.prize_catalog
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);