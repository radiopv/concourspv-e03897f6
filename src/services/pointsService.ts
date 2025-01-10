import { supabase } from "@/lib/supabase";
import { Rank, UserRank, RANKS } from "../types/points";

export const calculateRank = (points: number): UserRank => {
  return RANKS.find(rank => points >= rank.minPoints && points <= rank.maxPoints) || RANKS[0];
};

export const calculateExtraParticipations = (points: number): number => {
  // Une participation supplémentaire tous les 50 points
  return Math.floor(points / 50);
};

export const initializeUserPoints = async (userId: string) => {
  console.log('Initializing user points for:', userId);
  try {
    const { data: existingPoints } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingPoints) {
      console.log('Points already initialized for user:', userId);
      return existingPoints;
    }

    const { data, error } = await supabase
      .from('user_points')
      .insert({
        user_id: userId,
        total_points: 0,
        current_streak: 0,
        best_streak: 0,
        current_rank: 'PIONERO',
        extra_participations: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error initializing user points:', error);
      throw error;
    }

    console.log('User points initialized successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in initializeUserPoints:', error);
    throw error;
  }
};

export const getUserPoints = async (userId: string) => {
  try {
    console.log('Getting user points for:', userId);
    
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error getting user points:', error);
      throw error;
    }

    if (!data) {
      console.log('No points found, initializing...');
      return await initializeUserPoints(userId);
    }

    console.log('User points retrieved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in getUserPoints:', error);
    throw error;
  }
};

// Nouveau système de points plus élaboré
export const awardPoints = async (
  userId: string,
  points: number,
  contestId: string,
  streak: number
) => {
  try {
    console.log('Awarding points:', { userId, points, contestId, streak });

    // Calcul des points bonus basé sur différents facteurs
    let bonusPoints = 0;

    // 1. Bonus de streak
    if (streak >= 3) {
      bonusPoints += Math.floor(streak / 3) * 2; // +2 points tous les 3 bonnes réponses consécutives
    }

    // 2. Bonus de rapidité (si disponible dans le futur)
    // bonusPoints += speedBonus;

    // 3. Bonus de première participation quotidienne
    const today = new Date().toISOString().split('T')[0];
    const { data: dailyParticipation } = await supabase
      .from('point_history')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', today)
      .limit(1);

    if (!dailyParticipation?.length) {
      bonusPoints += 5; // Bonus de première participation du jour
    }

    // 4. Bonus de difficulté du concours (à implémenter plus tard avec les niveaux de difficulté)
    // bonusPoints += difficultyBonus;

    const totalPointsToAward = points + bonusPoints;

    // Enregistrement dans l'historique
    const { error: historyError } = await supabase
      .from('point_history')
      .insert([{
        user_id: userId,
        points: totalPointsToAward,
        source: 'contest_participation',
        streak,
        contest_id: contestId,
      }]);

    if (historyError) throw historyError;

    // Mise à jour des points totaux
    const { data: currentPoints } = await supabase
      .from('user_points')
      .select('total_points, best_streak')
      .eq('user_id', userId)
      .maybeSingle();

    const newTotalPoints = (currentPoints?.total_points || 0) + totalPointsToAward;
    const newBestStreak = Math.max(currentPoints?.best_streak || 0, streak);
    const newRank = calculateRank(newTotalPoints);

    const { error: updateError } = await supabase
      .from('user_points')
      .upsert({
        user_id: userId,
        total_points: newTotalPoints,
        current_streak: streak,
        best_streak: newBestStreak,
        current_rank: newRank.rank,
        extra_participations: calculateExtraParticipations(newTotalPoints)
      });

    if (updateError) throw updateError;

    console.log('Points awarded successfully:', {
      basePoints: points,
      bonusPoints,
      totalPointsToAward,
      newTotalPoints,
      streak,
      newRank
    });

    return { 
      success: true, 
      newTotalPoints, 
      streak, 
      newRank,
      bonusDetails: {
        basePoints: points,
        streakBonus: streak >= 3 ? Math.floor(streak / 3) * 2 : 0,
        firstDailyBonus: !dailyParticipation?.length ? 5 : 0,
        totalBonus: bonusPoints
      }
    };
  } catch (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
};

export const getPointHistory = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('point_history')
      .select(`
        *,
        contests (
          title
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting point history:', error);
    throw error;
  }
};