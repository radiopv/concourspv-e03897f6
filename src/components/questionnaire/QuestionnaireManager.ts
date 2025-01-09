import { supabase } from "../../App";

export const calculateFinalScore = async (participantId: string) => {
  try {
    // Récupérer toutes les réponses du participant
    const { data: answers, error: answersError } = await supabase
      .from('participant_answers')
      .select(`
        is_correct,
        questions (
          correct_answer
        )
      `)
      .eq('participant_id', participantId);

    if (answersError) throw answersError;

    if (!answers || answers.length === 0) return 0;

    // Compter le nombre de réponses correctes
    const correctAnswers = answers.filter(answer => answer.is_correct).length;
    
    // Calculer le pourcentage
    const percentage = (correctAnswers / answers.length) * 100;
    
    // Arrondir le pourcentage à l'entier le plus proche
    return Math.round(percentage);
  } catch (error) {
    console.error('Error calculating final score:', error);
    return 0;
  }
};

export const completeQuestionnaire = async (participantId: string, finalScore: number) => {
  const { error } = await supabase
    .from('participants')
    .update({
      status: 'completed',
      score: finalScore,
      completed_at: new Date().toISOString()
    })
    .eq('id', participantId);

  if (error) throw error;
};