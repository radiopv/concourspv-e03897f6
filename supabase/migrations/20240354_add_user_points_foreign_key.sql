-- Add foreign key constraint to user_points table
ALTER TABLE public.user_points
ADD CONSTRAINT fk_user_points_member
FOREIGN KEY (user_id)
REFERENCES public.members(id)
ON DELETE CASCADE;

-- Add RLS policies for user_points
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own points"
ON public.user_points
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all points"
ON public.user_points
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.members 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);