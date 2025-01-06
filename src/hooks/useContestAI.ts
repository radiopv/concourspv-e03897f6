import { useState } from 'react';
import { useToast } from './use-toast';
import { supabase } from '../App';

export const useContestAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const callAIFunction = async (action: string, data: any) => {
    setIsLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('contest-ai', {
        body: { action, data },
      });

      if (error) throw error;
      return response.content;

    } catch (error) {
      console.error('AI function error:', error);
      toast({
        title: "Error",
        description: "Failed to process AI request. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const suggestContest = (theme: string) => {
    return callAIFunction('suggest-contest', { theme });
  };

  const generateContent = (title: string) => {
    return callAIFunction('generate-content', { title });
  };

  const getParticipantFeedback = (score: number, contestTitle: string) => {
    return callAIFunction('participant-feedback', { score, contestTitle });
  };

  const predictDifficulty = (questions: any[]) => {
    return callAIFunction('predict-difficulty', { questions });
  };

  return {
    isLoading,
    suggestContest,
    generateContent,
    getParticipantFeedback,
    predictDifficulty,
  };
};