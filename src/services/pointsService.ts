import { UserRank } from "@/types/points";
import { supabase } from "@/lib/supabase";

export const RANKS: UserRank[] = [
  {
    rank: "NOVATO",
    minPoints: 0,
    maxPoints: 50,
    badge: "🌱",
    benefits: [
      "Accès aux concours de base",
      "1 participation par concours"
    ]
  },
  {
    rank: "HAVANA",
    minPoints: 51,
    maxPoints: 150,
    badge: "🌴",
    benefits: [
      "2 participations bonus par concours",
      "Bonus x1.5 sur les séries de 5"
    ]
  },
  {
    rank: "SANTIAGO",
    minPoints: 151,
    maxPoints: 300,
    badge: "🌺",
    benefits: [
      "3 participations bonus par concours",
      "Bonus x2 sur les séries de 5",
      "Accès prioritaire aux nouveaux concours"
    ]
  },
  {
    rank: "RIO",
    minPoints: 301,
    maxPoints: 600,
    badge: "🎭",
    benefits: [
      "4 participations bonus par concours",
      "Bonus x2.5 sur les séries de 5",
      "Accès aux concours exclusifs"
    ]
  },
  {
    rank: "CARNIVAL",
    minPoints: 601,
    maxPoints: 1000,
    badge: "🎪",
    benefits: [
      "5 participations bonus par concours",
      "Bonus x3 sur les séries de 5",
      "Accès VIP aux tirages au sort"
    ]
  },
  {
    rank: "ELDORADO",
    minPoints: 1001,
    maxPoints: Infinity,
    badge: "👑",
    benefits: [
      "6 participations bonus par concours",
      "Bonus x4 sur les séries de 5",
      "Statut légendaire permanent",
      "Accès à tous les avantages VIP"
    ]
  }
];

export const getPointHistory = async (userId: string) => {
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
};

export const getUserPoints = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;

  const currentRank = RANKS.find(
    rank => data.total_points >= rank.minPoints && data.total_points <= rank.maxPoints
  );

  return {
    total_points: data.total_points,
    current_rank: {
      rank: currentRank?.rank || 'NOVATO',
      badge: currentRank?.badge || '🌱'
    },
    best_streak: data.best_streak,
    extra_participations: data.extra_participations
  };
};

export const initializeUserPoints = async (userId: string) => {
  const { data: existingPoints } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!existingPoints) {
    const { error } = await supabase
      .from('user_points')
      .insert([{
        user_id: userId,
        total_points: 0,
        current_streak: 0,
        best_streak: 0,
        current_rank: 'NOVATO',
        extra_participations: 0,
        articles_read: 0
      }]);

    if (error) throw error;
  }
};

export const awardPoints = async (
  userId: string,
  basePoints: number,
  contestId?: string,
  streak?: number
) => {
  try {
    const { data: currentPoints, error: pointsError } = await supabase
      .from('user_points')
      .select('total_points, best_streak')
      .eq('user_id', userId)
      .single();

    if (pointsError) throw pointsError;

    // Calculer les points avec le nouveau système
    let bonusMultiplier = 1;
    if (streak) {
      if (streak >= 5) bonusMultiplier = 1.5;
      if (streak >= 10) bonusMultiplier = 2;
      if (streak >= 15) bonusMultiplier = 2.5;
      if (streak >= 20) bonusMultiplier = 3;
    }

    // Réduire les points de base et appliquer le multiplicateur
    const points = Math.round((basePoints * 0.5) * bonusMultiplier);
    const newTotalPoints = (currentPoints?.total_points || 0) + points;
    const newBestStreak = Math.max(streak || 0, currentPoints?.best_streak || 0);

    const newRank = RANKS.find(
      rank => newTotalPoints >= rank.minPoints && newTotalPoints <= rank.maxPoints
    );

    const { error: updateError } = await supabase
      .from('user_points')
      .update({
        total_points: newTotalPoints,
        current_streak: streak || 0,
        best_streak: newBestStreak,
        current_rank: newRank?.rank || 'NOVATO'
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    const { error: historyError } = await supabase
      .from('point_history')
      .insert([{
        user_id: userId,
        points: points,
        source: contestId ? 'contest' : 'system',
        contest_id: contestId,
        streak: streak || 0
      }]);

    if (historyError) throw historyError;

    return { newTotalPoints, newRank: newRank?.rank || 'NOVATO' };
  } catch (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
};