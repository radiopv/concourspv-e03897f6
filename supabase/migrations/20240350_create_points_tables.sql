-- Create point_history table
CREATE TABLE IF NOT EXISTS public.point_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    source TEXT NOT NULL,
    streak INTEGER DEFAULT 0,
    contest_id UUID REFERENCES public.contests(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_points table
CREATE TABLE IF NOT EXISTS public.user_points (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    current_rank TEXT DEFAULT 'BEGINNER',
    extra_participations INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.point_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

-- Point history policies
CREATE POLICY "Users can view their own point history"
    ON public.point_history
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert point history"
    ON public.point_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- User points policies
CREATE POLICY "Users can view their own points"
    ON public.user_points
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can update user points"
    ON public.user_points
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_point_history_user_id ON public.point_history(user_id);
CREATE INDEX IF NOT EXISTS idx_point_history_contest_id ON public.point_history(contest_id);