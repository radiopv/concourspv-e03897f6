-- Add foreign key constraint from user_points to members
ALTER TABLE public.user_points
ADD CONSTRAINT fk_user_points_member
FOREIGN KEY (user_id)
REFERENCES public.members(id)
ON DELETE CASCADE;

-- Add index to improve query performance
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON public.user_points(user_id);