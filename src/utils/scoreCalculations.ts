export const calculateCorrectAnswers = (score: number, totalQuestions: number): number => {
  return Math.round((score / 100) * totalQuestions);
};

export const isQualifiedForDraw = (score: number, requiredPercentage: number = 90): boolean => {
  return score >= requiredPercentage;
};

export const calculateFinalScore = (correctAnswers: number, totalQuestions: number): number => {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
};