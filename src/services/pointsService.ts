import { supabase } from "@/lib/supabase";
import { Rank, UserRank } from "../types/points";

export const RANKS: UserRank[] = [
  {
    rank: 'BEGINNER',
    minPoints: 0,
    maxPoints: 75,
    badge: '🌱',
    benefits: ['Accès aux concours standards']
  },
  {
    rank: 'BRONZE',
    minPoints: 76,
    maxPoints: 200,
    badge: '🥉',
    benefits: ['2 participations supplémentaires', 'Accès aux concours Bronze']
  },
  {
    rank: 'SILVER',
    minPoints: 201,
    maxPoints: 500,
    badge: '🥈',
    benefits: ['4 participations supplémentaires', 'Accès aux concours Silver', 'Bonus de streak x2']
  },
  {
    rank: 'GOLD',
    minPoints: 501,
    maxPoints: 1000,
    badge: '🥇',
    benefits: ['6 participations supplémentaires', 'Accès aux concours Gold', 'Bonus de streak x3']
  },
  {
    rank: 'MASTER',
    minPoints: 1001,
    maxPoints: 2000,
    badge: '👑',
    benefits: ['8 participations supplémentaires', 'Accès à tous les concours', 'Bonus de streak x4']
  },
  {
    rank: 'LEGEND',
    minPoints: 2001,
    maxPoints: Infinity,
    badge: '⭐',
    benefits: ['Participations illimitées', 'Accès exclusif', 'Bonus de streak x5']
  }
];

export const calculateRank = (points: number): UserRank => {
  return RANKS.find(rank => points >= rank.minPoints && points <= rank.maxPoints) || RANKS[0];
};

export const calculateExtraParticipations = (points: number): number => {
  const rank = calculateRank(points);
  switch (rank.rank) {
    case 'BRONZE': return 2;
    case 'SILVER': return 4;
    case 'GOLD': return 6;
    case 'MASTER': return 8;
    case 'LEGEND': return 999;
    default: return 0;
  }
};

export const calculateStreakBonus = (streak: number, rank: Rank): number => {
  const baseBonus = Math.floor(streak / 5) * 5; // Bonus tous les 5 streaks
  const multiplier = {
    'BEGINNER': 1,
    'BRONZE': 1.5,
    'SILVER': 2,
    'GOLD': 3,
    'MASTER': 4,
    'LEGEND': 5
  }[rank] || 1;

  return Math.floor(baseBonus * multiplier);
};

export const calculateReadingBonus = (articlesRead: number): number => {
  return Math.floor(articlesRead / 10) * 15; // 15 points bonus tous les 10 articles lus
};

export const initializeUserPoints = async (userId: string) => {
  console.log('Initializing user points for:', userId);
  try {
    // Vérifie d'abord si les points existent déjà
    const { data: existingPoints } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingPoints) {
      console.log('Points already initialized for user:', userId);
      return existingPoints;
    }

    // Si les points n'existent pas, on les initialise
    const { data, error } = await supabase
      .from('user_points')
      .insert({
        user_id: userId,
        total_points: 0,
        current_streak: 0,
        best_streak: 0,
        current_rank: 'BEGINNER',
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
    
    // Utilise maybeSingle() au lieu de single() pour éviter l'erreur 406
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error getting user points:', error);
      throw error;
    }

    // Si aucun point n'existe, initialise les points
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

export const awardPoints = async (
  userId: string,
  points: number,
  contestId: string,
  streak: number,
  hasReadArticle: boolean = false
) => {
  try {
    console.log('Awarding points:', { userId, points, contestId, streak, hasReadArticle });

    // Récupérer les points actuels de l'utilisateur
    const { data: currentPoints } = await supabase
      .from('user_points')
      .select('total_points, best_streak, current_rank, articles_read')
      .eq('user_id', userId)
      .maybeSingle();

    if (!currentPoints) {
      throw new Error('User points not found');
    }

    // Calculer les bonus
    const streakBonus = calculateStreakBonus(streak, currentPoints.current_rank as Rank);
    const readingBonus = hasReadArticle ? 2 : 0; // 2 points bonus par article lu
    const newArticlesRead = hasReadArticle ? (currentPoints.articles_read || 0) + 1 : (currentPoints.articles_read || 0);
    const totalReadingBonus = calculateReadingBonus(newArticlesRead);

    const totalPoints = points + streakBonus + readingBonus + totalReadingBonus;
    const newTotalPoints = (currentPoints.total_points || 0) + totalPoints;
    const newBestStreak = Math.max(currentPoints.best_streak || 0, streak);
    const newRank = calculateRank(newTotalPoints);

    // Mettre à jour les points de l'utilisateur
    const { error: updateError } = await supabase
      .from('user_points')
      .update({
        total_points: newTotalPoints,
        current_streak: streak,
        best_streak: newBestStreak,
        current_rank: newRank.rank,
        extra_participations: calculateExtraParticipations(newTotalPoints),
        articles_read: newArticlesRead
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Ajouter à l'historique
    const { error: historyError } = await supabase
      .from('point_history')
      .insert([{
        user_id: userId,
        points: totalPoints,
        source: 'contest_participation',
        streak,
        contest_id: contestId,
      }]);

    if (historyError) throw historyError;

    console.log('Points awarded successfully', {
      totalPoints,
      streakBonus,
      readingBonus,
      totalReadingBonus,
      newRank: newRank.rank
    });

    return {
      success: true,
      newTotalPoints,
      streak,
      bonuses: {
        streak: streakBonus,
        reading: readingBonus,
        totalReading: totalReadingBonus
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
