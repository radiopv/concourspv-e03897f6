export const calculatePointsAndAttempts = (correctAnswers: number) => {
  // Base points: 1 point per correct answer
  const points = correctAnswers;
  let bonusAttempts = 0;

  // Calculate bonus attempts based on points thresholds
  if (points >= 100) {
    bonusAttempts = 7; // Base bonus for 100 points
    // Additional bonus attempts for every 25 points above 100
    const extraPoints = points - 100;
    const extraBonusAttempts = Math.floor(extraPoints / 25) * 2;
    bonusAttempts += extraBonusAttempts;
  } else if (points >= 50) {
    bonusAttempts = 3;
  } else if (points >= 25) {
    bonusAttempts = 1;
  }

  return { points, bonusAttempts };
};