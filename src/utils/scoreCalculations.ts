
// Utility function to calculate correct answers
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

// Check if score qualifies for prize draw
export const isQualifiedForDraw = (score: number, requiredPercentage: number = 80): boolean => {
  return score >= requiredPercentage;
};

// Calculate streak bonus points
export const calculateStreakBonus = (streak: number, basePoints: number): number => {
  if (streak >= 20) return basePoints * 3;
  if (streak >= 15) return basePoints * 2.5;
  if (streak >= 10) return basePoints + 25;
  if (streak >= 5) return basePoints + 10;
  if (streak >= 3) return basePoints + 5;
  return basePoints;
};

// Calculate final score with proper rounding
export const calculateFinalScore = (correctAnswers: number, totalQuestions: number): number => {
  if (!totalQuestions) return 0;
  const rawScore = (correctAnswers / totalQuestions) * 100;
  return Math.round(rawScore);
};
