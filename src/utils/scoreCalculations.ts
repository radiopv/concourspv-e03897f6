import { supabase } from "@/lib/supabase";

export const calculateCorrectAnswers = (score: number, totalQuestions: number): number => {
  return Math.round((score / 100) * totalQuestions);
};

export const isQualifiedForDraw = (score: number, requiredPercentage: number = 80): boolean => {
  return score >= requiredPercentage;
};

export const calculateFinalScore = async (participationId: string): Promise<number> => {
  try {
    if (!participationId || participationId === "0") {
      console.log('Invalid participation ID:', participationId);
      return 0;
    }

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
    
    console.log('Calculation details:', {
      correctAnswers,
      totalQuestions
    });

    if (totalQuestions === 0) return 0;
    // Calculate percentage based on correct answers out of total questions
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    console.log('Final score:', score);
    return score;
  } catch (error) {
    console.error('Error calculating final score:', error);
    return 0;
  }
};