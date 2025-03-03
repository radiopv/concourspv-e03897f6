
import { useQuery } from '@tanstack/react-query';
import { localData } from '@/lib/data';

// Mock settings data
const defaultSettings = {
  default_attempts: 1,
  required_percentage: 80
};

// Mock user profile data
const defaultUserProfile = {
  first_name: "Test",
  last_name: "User",
  email: "test@example.com"
};

export const useQuestionnaireQueries = (contestId: string) => {
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      // In a real app, this would come from a settings file or API
      return defaultSettings;
    },
    staleTime: Infinity, // Ces données ne changent pas souvent
  });

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      // In a real app, this would come from authentication
      return defaultUserProfile;
    },
    staleTime: Infinity, // Ces données ne changent pas souvent
  });

  const { 
    data: participant, 
    refetch: refetchParticipant,
    isLoading: isLoadingParticipant 
  } = useQuery({
    queryKey: ['participant-status', contestId],
    queryFn: async () => {
      try {
        if (!contestId) return null;
        
        const participants = await localData.participants.getByContestId(contestId);
        // Simulating finding a participant based on current user
        // In a real app, this would use the authenticated user ID
        const participant = participants.find(p => p.email === defaultUserProfile.email);
        
        return participant || null;
      } catch (error) {
        console.error('Error fetching participant:', error);
        return null;
      }
    },
    enabled: !!contestId,
    staleTime: 30000, // 30 secondes
  });

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['questions', contestId],
    queryFn: async () => {
      if (!contestId) throw new Error('Contest ID is required');
      
      const contestQuestions = await localData.questions.getByContestId(contestId);
      return contestQuestions;
    },
    enabled: !!contestId,
    staleTime: 60000, // 1 minute
  });

  const isLoading = isLoadingSettings || isLoadingProfile || isLoadingParticipant || isLoadingQuestions;

  return {
    settings,
    userProfile,
    participant,
    questions,
    refetchParticipant,
    isLoading
  };
};
