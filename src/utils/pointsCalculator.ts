/**
 * Calcule le nombre de participations bonus en fonction des points
 * @param points Nombre total de points
 * @returns Nombre de participations bonus
 */
export const calculateBonusAttempts = (points: number): number => {
  if (points < 25) return 0;
  if (points < 50) return 1;
  if (points < 100) return 3; // 1 + 2
  
  // Au-delà de 100 points, calcul progressif
  const baseAttempts = 7; // 1 + 2 + 4
  const additionalPoints = points - 100;
  const additionalAttempts = Math.floor(additionalPoints / 25) * 2;
  
  return baseAttempts + additionalAttempts;
};

/**
 * Calcule le score et les participations bonus
 * @param correctAnswers Nombre de bonnes réponses
 * @returns Object contenant les points et participations bonus
 */
export const calculatePointsAndAttempts = (correctAnswers: number) => {
  const points = correctAnswers; // 1 point par bonne réponse
  const bonusAttempts = calculateBonusAttempts(points);
  
  return {
    points,
    bonusAttempts,
    nextMilestone: getNextMilestone(points)
  };
};

/**
 * Détermine le prochain palier de points à atteindre
 * @param currentPoints Points actuels
 * @returns Information sur le prochain palier
 */
const getNextMilestone = (currentPoints: number) => {
  const milestones = [25, 50, 100];
  const nextMilestone = milestones.find(m => m > currentPoints) || 
    Math.ceil(currentPoints / 25) * 25 + 25;

  return {
    points: nextMilestone,
    attemptsToUnlock: calculateBonusAttempts(nextMilestone) - calculateBonusAttempts(currentPoints)
  };
};