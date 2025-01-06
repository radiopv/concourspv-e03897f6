interface PointsResult {
  points: number;
  bonusAttempts: number;
  nextMilestone: {
    points: number;
    attemptsToUnlock: number;
  };
}

export const calculatePointsAndAttempts = (correctAnswers: number): PointsResult => {
  // Points de base : 1 point par bonne réponse
  const points = correctAnswers;
  let bonusAttempts = 0;

  // Calcul des participations bonus basé sur les paliers
  if (points >= 100) {
    bonusAttempts = 7;
    // +2 participations tous les 25 points au-dessus de 100
    const extraPoints = points - 100;
    const extraAttempts = Math.floor(extraPoints / 25) * 2;
    bonusAttempts += extraAttempts;
  } else if (points >= 50) {
    bonusAttempts = 3;
  } else if (points >= 25) {
    bonusAttempts = 1;
  }

  // Calcul du prochain palier
  let nextMilestonePoints = 25;
  let attemptsToUnlock = 1;

  if (points < 25) {
    nextMilestonePoints = 25;
    attemptsToUnlock = 1;
  } else if (points < 50) {
    nextMilestonePoints = 50;
    attemptsToUnlock = 2;
  } else if (points < 100) {
    nextMilestonePoints = 100;
    attemptsToUnlock = 4;
  } else {
    nextMilestonePoints = Math.ceil(points / 25) * 25 + 25;
    attemptsToUnlock = 2;
  }

  return {
    points,
    bonusAttempts,
    nextMilestone: {
      points: nextMilestonePoints,
      attemptsToUnlock,
    }
  };
};

// Calcul des points bonus pour les actions sociales
export const calculateSocialPoints = (action: 'share' | 'photo' | 'testimonial'): number => {
  switch (action) {
    case 'share':
      return 5; // Points pour le partage sur les réseaux sociaux
    case 'photo':
      return 10; // Points pour l'ajout d'une photo de profil
    case 'testimonial':
      return 15; // Points pour un témoignage
    default:
      return 0;
  }
};