
export const calculateCorrectAnswers = (score: number, totalQuestions: number): number => {
  // Ensure we're working with valid numbers
  if (!score || !totalQuestions) return 0;
  
  // Calculate the number of correct answers
  const correctAnswers = Math.round((score / 100) * totalQuestions);
  
  // Log the calculation for debugging
  console.log('Score calculation:', {
    score,
    totalQuestions,
    correctAnswers,
    calculation: `${score}% of ${totalQuestions} = ${correctAnswers}`
  });
  
  return correctAnswers;
};

export const isQualifiedForDraw = (score: number, requiredPercentage: number = 80): boolean => {
  return score >= requiredPercentage;
};
