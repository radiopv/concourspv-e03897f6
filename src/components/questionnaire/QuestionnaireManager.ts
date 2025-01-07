import { supabase } from "../../App";

interface ParticipantAnswer {
  answer: string;
  question: {
    correct_answer: string;
  };
}

interface AnswerResult {
  answer: string;
  questions: {
    correct_answer: string;
  };
}

export const calculateFinalScore = async (participantId: string) => {
  try {
    // Get all participant answers with their corresponding questions
    const { data: answers, error: answersError } = await supabase
      .from('participant_answers')
      .select(`
        answer,
        questions (
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

    // Count correct answers
    const correctAnswers = (answers as AnswerResult[]).filter(answer => 
      answer.questions?.correct_answer === answer.answer
    ).length;
    
    // Calculate percentage
    const percentage = Math.round((correctAnswers / answers.length) * 100);

    console.log('Score calculation:', {
      totalAnswers: answers.length,
      correctAnswers,
      percentage
    });

    // Update participant's score
    const { error: updateError } = await supabase
      .from('participants')
      .update({
        score: percentage,
        points: percentage,
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