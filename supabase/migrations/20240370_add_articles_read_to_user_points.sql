-- Add articles_read column to user_points table
ALTER TABLE public.user_points
ADD COLUMN articles_read INTEGER DEFAULT 0;

-- Update existing rows to have a default value
UPDATE public.user_points
SET articles_read = 0
WHERE articles_read IS NULL;