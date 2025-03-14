export type Rank = 'NOVATO' | 'HAVANA' | 'SANTIAGO' | 'RIO' | 'CARNIVAL' | 'ELDORADO';

export interface UserRank {
  rank: Rank;
  minPoints: number;
  maxPoints: number;
  badge: string;
  benefits: string[];
}

export interface PointHistory {
  id: string;
  user_id: string;
  points: number;
  source: string;
  streak: number;
  created_at: string;
  contest_id?: string;
}

export interface UserPoints {
  total_points: number;
  current_streak: number;
  best_streak: number;
  current_rank: Rank;
  articles_read: number;
}