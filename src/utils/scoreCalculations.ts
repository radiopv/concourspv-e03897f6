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