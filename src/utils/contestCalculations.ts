export const calculateWinningChance = (participantsCount: number, totalPrizes: number = 1) => {
  if (participantsCount === 0) return 100;
  return Math.round((totalPrizes / participantsCount) * 100);
};