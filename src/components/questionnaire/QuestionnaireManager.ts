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

    console.log('Retrieved answers:', answers);

    if (!answers || answers.length === 0) {
      console.log('No answers found, returning 0');
      return 0;
    }

    // Compter le nombre de réponses correctes
    const correctAnswers = answers.filter(answer => answer.is_correct === true).length;
    const totalQuestions = answers.length;
    
    console.log('Score calculation details:', {
      correctAnswers,
      totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100)
    });

    // Calculer le pourcentage exact
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    console.log('Final calculated score:', score);
    
    return score;
  } catch (error) {
    console.error('Error calculating final score:', error);
    return 0;
  }
};

export const completeQuestionnaire = async (participantId: string, finalScore: number) => {
  console.log('Completing questionnaire for participant:', participantId, 'with score:', finalScore);
  
  const { error } = await supabase
    .from('participants')
    .update({
      status: 'completed',
      score: finalScore,
      completed_at: new Date().toISOString()
    })
    .eq('participation_id', participantId);

  if (error) {
    console.error('Error completing questionnaire:', error);
    throw error;
  }
};