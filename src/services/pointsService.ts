import { supabase } from "../App";
import { Rank, UserRank } from "../types/points";

export const RANKS: UserRank[] = [
  {
    rank: 'BEGINNER',
    minPoints: 0,
    maxPoints: 24,
    badge: '🌱',
    benefits: ['Accès aux concours standards']
  },
  {
    rank: 'BRONZE',
    minPoints: 25,
    maxPoints: 49,
    badge: '🥉',
    benefits: ['Participation supplémentaire', 'Accès aux concours Bronze']
  },
  {
    rank: 'SILVER',
    minPoints: 50,
    maxPoints: 74,
    badge: '🥈',
    benefits: ['2 participations supplémentaires', 'Accès aux concours Silver']
  },
  {
    rank: 'GOLD',
    minPoints: 75,
    maxPoints: 99,
    badge: '🥇',
    benefits: ['3 participations supplémentaires', 'Accès aux concours Gold']
  },
  {
    rank: 'MASTER',
    minPoints: 100,
    maxPoints: Infinity,
    badge: '👑',
    benefits: ['Participations illimitées', 'Accès à tous les concours']
  }
];

export const calculateRank = (points: number): UserRank => {
  return RANKS.find(rank => points >= rank.minPoints && points <= rank.maxPoints) || RANKS[0];
};

export const calculateExtraParticipations = (points: number): number => {
  return Math.floor(points / 25);
};

export const awardPoints = async (
  userId: string,
  points: number,
  contestId: string,
  streak: number
) => {
  try {
    console.log('Awarding points:', { userId, points, contestId, streak });

    // Ajouter les points à l'historique
    const { error: historyError } = await supabase
      .from('point_history')
      .insert([{
        user_id: userId,
        points,
        source: 'contest_participation',
        streak,
        contest_id: contestId,
      }]);

    if (historyError) throw historyError;

    // Mettre à jour les points totaux de l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('user_points')
      .select('total_points, best_streak')
      .eq('user_id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') throw userError;

    const newTotalPoints = (userData?.total_points || 0) + points;
    const newBestStreak = Math.max(userData?.best_streak || 0, streak);

    const { error: updateError } = await supabase
      .from('user_points')
      .upsert({
        user_id: userId,
        total_points: newTotalPoints,
        current_streak: streak,
        best_streak: newBestStreak,
        current_rank: calculateRank(newTotalPoints).rank,
        extra_participations: calculateExtraParticipations(newTotalPoints)
      });

    if (updateError) throw updateError;

    console.log('Points awarded successfully');
    return { success: true, newTotalPoints, streak };
  } catch (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
};

export const getUserPoints = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user points:', error);
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