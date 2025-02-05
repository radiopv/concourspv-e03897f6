import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useQuestionnaireQueries = (contestId: string) => {
  // Query for global settings
  const { 
    data: settings,
    isLoading: isSettingsLoading,
    error: settingsError
  } = useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      console.log('Fetching settings...');
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }
      return data || { default_attempts: 1, required_percentage: 80 };
    }
  });

  // Query for user profile
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      console.log('Fetching user profile...');
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

  // Query for participant status
  const {
    data: participant,
    isLoading: isParticipantLoading,
    error: participantError,
    refetch: refetchParticipant
  } = useQuery({
    queryKey: ['participant-status', contestId],
    queryFn: async () => {
      console.log('Fetching participant status for contest:', contestId);
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

        if (error) {
          console.error('Error fetching participant:', error);
          throw error;
        }
        console.log('Participant data:', data);
        return data;
      } catch (error: any) {
        console.error('Error in participant query:', error);
        throw error;
      }
    },
    enabled: !!contestId
  });

  // Query for questions
  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError
  } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      console.log('Fetching questions for contest:', contestId);
      if (!contestId) throw new Error('Contest ID is required');
      
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('contest_id', contestId)
        .order('order_number', { ascending: true });

      if (error) throw error;
      console.log('Questions loaded:', data?.length || 0);
      return data;
    },
    enabled: !!contestId
  });

  const isLoading = isSettingsLoading || isProfileLoading || isParticipantLoading || isQuestionsLoading;
  const error = settingsError || profileError || participantError || questionsError;

  return {
    settings,
    userProfile,
    participant,
    questions,
    refetchParticipant,
    isLoading,
    error
  };
};