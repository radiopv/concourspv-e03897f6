
/**
 * Utility functions for score calculations
 */

// Utility function to calculate correct answers with improved precision
export const calculateCorrectAnswers = (score: number, totalQuestions: number): number => {
  // Ensure we're working with valid numbers and handle edge cases
  if (typeof score !== 'number' || typeof totalQuestions !== 'number') return 0;
  if (score < 0 || totalQuestions <= 0) return 0;
  
  // Calculate the number of correct answers with proper rounding
  const correctAnswers = Math.round((score / 100) * totalQuestions);
  
  // Log calculation details for debugging
  console.log('Score calculation:', {
    score,
    totalQuestions,
    correctAnswers,
    calculation: `${score}% of ${totalQuestions} = ${correctAnswers}`,
    roundedResult: correctAnswers
  });
  
  return correctAnswers;
};

// Check if score qualifies for prize draw with improved validation
export const isQualifiedForDraw = (score: number, requiredPercentage: number = 80): boolean => {
  if (typeof score !== 'number' || typeof requiredPercentage !== 'number') return false;
  if (score < 0 || requiredPercentage < 0) return false;
  
  const isQualified = score >= requiredPercentage;
  
  console.log('Qualification check:', {
    score,
    requiredPercentage,
    isQualified
  });
  
  return isQualified;
};

// Calculate streak bonus points with improved scaling
export const calculateStreakBonus = (streak: number, basePoints: number): number => {
  // Validate inputs
  if (typeof streak !== 'number' || typeof basePoints !== 'number') return 0;
  if (streak < 0 || basePoints < 0) return 0;

  let bonus = basePoints;
  let multiplier = 1;

  if (streak >= 20) multiplier = 3;
  else if (streak >= 15) multiplier = 2.5;
  else if (streak >= 10) bonus += 25;
  else if (streak >= 5) bonus += 10;
  else if (streak >= 3) bonus += 5;

  const finalPoints = streak >= 15 ? basePoints * multiplier : bonus;

  console.log('Streak bonus calculation:', {
    streak,
    basePoints,
    multiplier,
    finalPoints
  });

  return Math.round(finalPoints);
};

// Calculate final score with improved precision and validation
export const calculateFinalScore = (correctAnswers: number, totalQuestions: number): number => {
  // Validate inputs
  if (typeof correctAnswers !== 'number' || typeof totalQuestions !== 'number') return 0;
  if (correctAnswers < 0 || totalQuestions <= 0) return 0;
  if (correctAnswers > totalQuestions) correctAnswers = totalQuestions; // Cap at maximum

  const rawScore = (correctAnswers / totalQuestions) * 100;
  const roundedScore = Math.round(rawScore);

  console.log('Final score calculation:', {
    correctAnswers,
    totalQuestions,
    rawScore,
    roundedScore
  });

  return roundedScore;
};

// New: Calculate global statistics for a contest
export const calculateContestStatistics = (scores: number[]): {
  averageScore: number;
  participantsCount: number;
  qualifiedCount: number;
  successRate: number;
} => {
  if (!Array.isArray(scores) || scores.length === 0) {
    return {
      averageScore: 0,
      participantsCount: 0,
      qualifiedCount: 0,
      successRate: 0
    };
  }

  // Filter out invalid scores
  const validScores = scores.filter(score => 
    typeof score === 'number' && 
    !isNaN(score) && 
    score >= 0 && 
    score <= 100
  );

  const total = validScores.reduce((sum, score) => sum + score, 0);
  const average = validScores.length > 0 ? total / validScores.length : 0;
  const qualified = validScores.filter(score => score >= 80).length;

  const stats = {
    averageScore: Math.round(average),
    participantsCount: validScores.length,
    qualifiedCount: qualified,
    successRate: validScores.length > 0 
      ? Math.round((qualified / validScores.length) * 100) 
      : 0
  };

  console.log('Contest statistics:', stats);

  return stats;
};

// New: Validate individual score calculations
export const validateScoreCalculation = (
  answers: { is_correct: boolean }[], 
  totalQuestions: number
): boolean => {
  if (!Array.isArray(answers) || typeof totalQuestions !== 'number') return false;
  if (totalQuestions <= 0 || answers.length !== totalQuestions) return false;

  const correctCount = answers.filter(a => a.is_correct).length;
  const calculatedScore = calculateFinalScore(correctCount, totalQuestions);
  const expectedScore = Math.round((correctCount / totalQuestions) * 100);

  const isValid = calculatedScore === expectedScore;

  console.log('Score validation:', {
    correctAnswers: correctCount,
    totalQuestions,
    calculatedScore,
    expectedScore,
    isValid
  });

  return isValid;
};
