import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useQuestionnaireQueries = (contestId: string) => {
  const { data: settings } = useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data || { default_attempts: 1, required_percentage: 80 };
    }
  });

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('members')
        .select('first_name, last_name, email')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const { data: participant, refetch: refetchParticipant } = useQuery({
    queryKey: ['participant-status', contestId],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return null;

        const { data, error } = await supabase
          .from('participants')
          .select('*')
          .eq('contest_id', contestId)
          .eq('id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error('Error fetching participant:', error);
        return null;
      }
    },
    enabled: !!contestId
  });

  const { data: questions } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      if (!contestId) throw new Error('Contest ID is required');
      
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId)
        .order('order_number', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!contestId
  });

  return {
    settings,
    userProfile,
    participant,
    questions,
    refetchParticipant
  };
};