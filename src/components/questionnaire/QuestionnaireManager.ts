import { supabase } from "../../App";

export const completeQuestionnaire = async (userId: string, contestId: string, finalScore: number) => {
  const { error } = await supabase
    .from('participants')
    .update({ 
      status: 'completed',
      score: finalScore,
      completed_at: new Date().toISOString()
    })
    .eq('contest_id', contestId)
    .eq('id', userId);

  if (error) {
    console.error('Error completing questionnaire:', error);
    throw error;
  }

  return finalScore;
};

export const calculateFinalScore = async (userId: string) => {
  const { data: answers, error } = await supabase
    .from('participant_answers')
    .select('*, questions!inner(*)')
    .eq('participant_id', userId);

  if (error) {
    console.error('Error fetching answers:', error);
    return 0;
  }

  if (!answers || answers.length === 0) return 0;

  const correctAnswers = answers.filter(
    answer => answer.answer === answer.questions.correct_answer
  ).length;

  return Math.round((correctAnswers / answers.length) * 100);
};