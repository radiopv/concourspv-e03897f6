import { supabase } from "@/lib/supabase";

export const calculateCorrectAnswers = (score: number, totalQuestions: number): number => {
  return Math.round((score / 100) * totalQuestions);
};

export const isQualifiedForDraw = (score: number, requiredPercentage: number = 90): boolean => {
  return score >= requiredPercentage;
};

export const calculateFinalScore = async (participationId: string): Promise<number> => {
  try {
    console.log('Calculating final score for participant:', participationId);
    
    const { data: answers, error: answersError } = await supabase
      .from('participant_answers')
      .select('is_correct')
      .eq('participant_id', participationId);

    if (answersError) {
      console.error('Error fetching answers:', answersError);
      throw answersError;
    }

    if (!answers || answers.length === 0) {
      console.log('No answers found, returning 0');
      return 0;
    }

    const correctAnswers = answers.filter(answer => answer.is_correct === true).length;
    const totalQuestions = answers.length;
    
    if (totalQuestions === 0) return 0;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    console.log('Final score:', score);
    return score;
  } catch (error) {
    console.error('Error calculating final score:', error);
    return 0;
  }
};