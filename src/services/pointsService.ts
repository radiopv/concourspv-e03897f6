import { UserRank } from "@/types/points";
import { supabase } from "@/lib/supabase";

export const RANKS: UserRank[] = [
  {
    rank: "NOVATO",
    minPoints: 0,
    maxPoints: 75,
    badge: "🌱",
    benefits: [
      "Accès aux concours de base",
      "1 participation par concours"
    ]
  },
  {
    rank: "HAVANA",
    minPoints: 76,
    maxPoints: 200,
    badge: "🌴",
    benefits: [
      "2 participations bonus par concours",
      "Bonus x2 sur les séries de 5"
    ]
  },
  {
    rank: "SANTIAGO",
    minPoints: 201,
    maxPoints: 500,
    badge: "🌺",
    benefits: [
      "4 participations bonus par concours",
      "Bonus x3 sur les séries de 5",
      "Accès prioritaire aux nouveaux concours"
    ]
  },
  {
    rank: "RIO",
    minPoints: 501,
    maxPoints: 1000,
    badge: "🎭",
    benefits: [
      "6 participations bonus par concours",
      "Bonus x4 sur les séries de 5",
      "Accès aux concours exclusifs"
    ]
  },
  {
    rank: "CARNIVAL",
    minPoints: 1001,
    maxPoints: 2000,
    badge: "🎪",
    benefits: [
      "8 participations bonus par concours",
      "Bonus x5 sur les séries de 5",
      "Accès VIP aux tirages au sort"
    ]
  },
  {
    rank: "ELDORADO",
    minPoints: 2001,
    maxPoints: Infinity,
    badge: "👑",
    benefits: [
      "Participations illimitées aux concours",
      "Bonus x6 sur les séries de 5",
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