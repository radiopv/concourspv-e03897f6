-- Add prize_id column to participants table
ALTER TABLE public.participants
ADD COLUMN prize_id uuid REFERENCES public.prizes(id);

-- Add foreign key constraint
ALTER TABLE public.participants
ADD CONSTRAINT fk_participant_prize
FOREIGN KEY (prize_id)
REFERENCES public.prizes(id)
ON DELETE SET NULL;