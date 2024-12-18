import { supabase } from "@/lib/supabase";

export const useAttempts = async (userId: string, contestId: string) => {
  const { data, error } = await supabase
    .from('participants')
    .select('attempts')
    .eq('id', userId)
    .eq('contest_id', contestId)
    .single();

  if (error) {
    console.error('Error fetching attempts:', error);
    throw error;
  }

  return data?.attempts || 0;
};
