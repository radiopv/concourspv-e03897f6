import { supabase } from "../../App";
import { calculatePointsAndAttempts } from "../../utils/pointsCalculator";

export const calculateFinalScore = async (participantId: string) => {
  try {
    // Get all participant answers with their corresponding questions
    const { data: answers, error: answersError } = await supabase
      .from('participant_answers')
      .select(`
        answer,
        question_id,
        questions!inner (
          correct_answer
        )
      `)
      .eq('participant_id', participantId);

    if (answersError) {
      console.error('Error fetching answers:', answersError);
      throw answersError;
    }

    if (!answers || answers.length === 0) {
      console.warn('No answers found for participant:', participantId);
      return 0;
    }

    // Count correct answers by comparing with question's correct answer
    const correctAnswers = answers.filter(answer => 
      answer.questions?.correct_answer === answer.answer
    ).length;
    
    // Calculate percentage
    const percentage = Math.round((correctAnswers / answers.length) * 100);
    
    // Calculate points and bonus attempts
    const { points, bonusAttempts } = calculatePointsAndAttempts(correctAnswers);

    console.log('Score calculation:', {
      totalAnswers: answers.length,
      correctAnswers,
      percentage,
      points,
      bonusAttempts
    });

    // Update participant's score and points
    const { error: updateError } = await supabase
      .from('participants')
      .update({
        score: percentage,
        points: points,
        bonus_attempts: bonusAttempts
      })
      .eq('id', participantId);

    if (updateError) {
      console.error('Error updating participant score:', updateError);
      throw updateError;
    }
    
    return percentage;
  } catch (error) {
    console.error('Error calculating final score:', error);
    throw error;
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

  if (error) {
    console.error('Error completing questionnaire:', error);
    throw error;
  }
};