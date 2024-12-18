import { supabase } from "../../App";

export const calculateFinalScore = async (participationId: string) => {
  const { data: answers, error } = await supabase
    .from('participant_answers')
    .select('*')
    .eq('participant_id', participationId);

  if (error) throw error;

  const totalQuestions = answers?.length || 0;
  const correctAnswers = answers?.filter(a => a.is_correct)?.length || 0;
  
  return totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
};

export const completeQuestionnaire = async (participationId: string, finalScore: number) => {
  const { error } = await supabase
    .from('participants')
    .update({
      status: 'completed',
      score: finalScore,
      completed_at: new Date().toISOString()
    })
    .eq('participation_id', participationId);

  if (error) throw error;
};