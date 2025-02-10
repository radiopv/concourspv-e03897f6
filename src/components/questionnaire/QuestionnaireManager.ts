
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

    // Calculer le nombre de réponses correctes
    const correctAnswers = answers.filter(answer => answer.is_correct).length;
    const totalQuestions = answers.length;
    
    console.log('Score calculation details:', {
      correctAnswers,
      totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100)
    });

    // Mettre à jour le score dans la table participants
    const { error: updateError } = await supabase
      .from('participants')
      .update({ 
        score: Math.round((correctAnswers / totalQuestions) * 100) 
      })
      .eq('participation_id', participantId);

    if (updateError) {
      console.error('Error updating participant score:', updateError);
    }

    if (totalQuestions === 0) return 0;
    
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    console.log('Final calculated score:', finalScore);
    
    return finalScore;
  } catch (error) {
    console.error('Error calculating final score:', error);
    return 0;
  }
};
