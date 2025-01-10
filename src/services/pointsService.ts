import { supabase } from "@/lib/supabase";
import { Rank, UserRank, RANKS } from "../types/points";

export const calculateRank = (points: number): UserRank => {
  return RANKS.find(rank => points >= rank.minPoints && points <= rank.maxPoints) || RANKS[0];
};

export const calculateExtraParticipations = (points: number): number => {
  return Math.floor(points / 25);
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

export const awardPoints = async (
  userId: string,
  points: number,
  contestId: string,
  streak: number
) => {
  try {
    console.log('Awarding points:', { userId, points, contestId, streak });

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

    const { data: currentPoints } = await supabase
      .from('user_points')
      .select('total_points, best_streak')
      .eq('user_id', userId)
      .maybeSingle();

    const newTotalPoints = (currentPoints?.total_points || 0) + points;
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

    console.log('Points awarded successfully');
    return { success: true, newTotalPoints, streak, newRank };
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
