import { supabase } from "@/lib/supabase";

export const calculateFinalScore = async (participantId: string) => {
  try {
    console.log('Calculating final score for participant:', participantId);
    
    // Récupérer toutes les réponses du participant
    const { data: answers, error: answersError } = await supabase
      .from('participant_answers')
      .select('is_correct')
      .eq('participant_id', participantId);

    if (answersError) {
      console.error('Error fetching answers:', answersError);
      throw answersError;
    }

    if (!answers || answers.length === 0) {
      console.log('No answers found, returning 0');
      return 0;
    }

    // Compter simplement le nombre de réponses correctes
    const correctAnswers = answers.filter(answer => answer.is_correct === true).length;
    const totalQuestions = answers.length;
    
    // Calcul simple : (nombre de bonnes réponses / nombre total de questions) * 100
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    console.log('Score calculation:', {
      correctAnswers,
      totalQuestions,
      score
    });
    
    return score;
  } catch (error) {
    console.error('Error calculating final score:', error);
    return 0;
  }
};