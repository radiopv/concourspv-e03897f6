import { supabase } from "@/lib/supabase";

export const calculateCorrectAnswers = (score: number, totalQuestions: number): number => {
  return Math.round((score / 100) * totalQuestions);
};

export const isQualifiedForDraw = (score: number, requiredPercentage: number = 90): boolean => {
  return score >= requiredPercentage;
};

export const calculateFinalScore = async (participationId: string): Promise<number> => {
  const { data: answers, error } = await supabase
    .from('participant_answers')
    .select('is_correct')
    .eq('participant_id', participationId);

  if (error) throw error;

  if (!answers || answers.length === 0) return 0;

  const correctAnswers = answers.filter(answer => answer.is_correct).length;
  return Math.round((correctAnswers / answers.length) * 100);
};