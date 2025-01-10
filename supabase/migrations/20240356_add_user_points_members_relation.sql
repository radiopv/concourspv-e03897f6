-- Drop existing constraint if it exists
ALTER TABLE public.user_points
DROP CONSTRAINT IF EXISTS fk_user_points_member;

-- Add foreign key constraint from user_points to members
ALTER TABLE public.user_points
ADD CONSTRAINT fk_user_points_member
FOREIGN KEY (user_id)
REFERENCES public.members(id)
ON DELETE CASCADE;

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON public.user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_total_points ON public.user_points(total_points);

-- Add RLS policies for user_points
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own points
CREATE POLICY "Users can view their own points"
ON public.user_points FOR SELECT
USING (auth.uid() = user_id);

-- Allow authenticated users to view all points for leaderboards
CREATE POLICY "Users can view all points for leaderboards"
ON public.user_points FOR SELECT
USING (true);