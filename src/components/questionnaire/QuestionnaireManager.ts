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

    console.log('Raw answers data:', answers);

    if (!answers || answers.length === 0) {
      console.log('No answers found, returning 0');
      return 0;
    }

    // Calcul basique : nombre de réponses correctes / nombre total de questions * 100
    const correctAnswers = answers.filter(answer => answer.is_correct === true).length;
    const totalQuestions = answers.length;
    
    console.log('Calculation details:', {
      correctAnswers,
      totalQuestions,
      rawPercentage: (correctAnswers / totalQuestions) * 100
    });

    // Arrondir à l'entier le plus proche
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    console.log('Final score:', score);
    
    return score;
  } catch (error) {
    console.error('Error calculating final score:', error);
    return 0;
  }
};