
import { supabase } from "@/lib/supabase";

export const calculateFinalScore = async (participantId: string) => {
  try {
    console.log('Calculating final score for participant:', participantId);
    
    // Récupérer toutes les réponses du participant pour sa dernière tentative
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .select('attempts')
      .eq('participation_id', participantId)
      .single();

    if (participantError) {
      console.error('Error fetching participant:', participantError);
      throw participantError;
    }

    const currentAttempt = participant?.attempts || 1;
    console.log('Current attempt number:', currentAttempt);

    // Récupérer les réponses de la dernière tentative uniquement
    const { data: answers, error: answersError } = await supabase
      .from('participant_answers')
      .select('is_correct')
      .eq('participant_id', participantId)
      .eq('attempt_number', currentAttempt);

    if (answersError) {
      console.error('Error fetching answers:', answersError);
      throw answersError;
    }

    console.log('Raw answers data:', answers);

    if (!answers || answers.length === 0) {
      console.log('No answers found for attempt', currentAttempt);
      return 0;
    }

    // Calculer le nombre de réponses correctes
    const correctAnswers = answers.filter(answer => answer.is_correct === true).length;
    const totalQuestions = answers.length;
    
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    
    console.log('Score calculation details:', {
      correctAnswers,
      totalQuestions,
      finalScore,
      attemptNumber: currentAttempt
    });

    // Mettre à jour le score dans la table participants
    const { error: updateError } = await supabase
      .from('participants')
      .update({ 
        score: finalScore,
        status: 'completed'
      })
      .eq('participation_id', participantId);

    if (updateError) {
      console.error('Error updating participant score:', updateError);
      throw updateError;
    }

    console.log('Final score updated successfully:', finalScore);
    return finalScore;
  } catch (error) {
    console.error('Error calculating final score:', error);
    throw error;
  }
};
