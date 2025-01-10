-- Add is_choice column to prizes table
ALTER TABLE public.prizes
ADD COLUMN is_choice BOOLEAN DEFAULT false;

-- Update RLS policies
CREATE POLICY "Anyone can view prize choices"
    ON public.prizes
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can update prize choices"
    ON public.prizes
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);