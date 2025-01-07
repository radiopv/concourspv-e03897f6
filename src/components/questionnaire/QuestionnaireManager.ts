import { supabase } from "../../App";

interface ParticipantAnswer {
  answer: string;
  question: {
    correct_answer: string;
  };
}

// Update the interface to match the Supabase response structure
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

    // Type assertion to ensure the response matches our interface
    const typedAnswers = answers as unknown as AnswerResult[];

    // Count correct answers
    const correctAnswers = typedAnswers.filter(answer => 
      answer.questions?.correct_answer === answer.answer
    ).length;
    
    // Calculate percentage
    const percentage = Math.round((correctAnswers / typedAnswers.length) * 100);

    console.log('Score calculation:', {
      totalAnswers: typedAnswers.length,
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