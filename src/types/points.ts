export type Rank = 'PIONERO' | 'GUAJIRO' | 'HABANERO' | 'CUBANO' | 'MAXIMO';

export interface UserRank {
  rank: Rank;
  minPoints: number;
  maxPoints: number;
  badge: string;
  benefits: string[];
  description: string;
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
  extra_participations: number;
}

export const RANKS: UserRank[] = [
  {
    rank: 'PIONERO',
    minPoints: 0,
    maxPoints: 24,
    badge: '🌱',
    benefits: ['Accès aux concours débutants'],
    description: 'Les "Pioneros" sont les jeunes élèves cubains, symbolisant les premiers pas et l\'apprentissage. Comme eux, vous débutez votre voyage dans notre communauté.'
  },
  {
    rank: 'GUAJIRO',
    minPoints: 25,
    maxPoints: 49,
    badge: '🌾',
    benefits: ['Participation supplémentaire', 'Accès aux concours Guajiro'],
    description: 'Le "Guajiro" est le paysan traditionnel cubain, connu pour sa persévérance et son authenticité. Ce rang représente votre engagement grandissant.'
  },
  {
    rank: 'HABANERO',
    minPoints: 50,
    maxPoints: 99,
    badge: '🎭',
    benefits: ['2 participations supplémentaires', 'Accès aux concours Habanero'],
    description: 'Les "Habaneros", habitants de La Havane, incarnent l\'élégance et la sophistication de la capitale cubaine. Vous maîtrisez maintenant les bases.'
  },
  {
    rank: 'CUBANO',
    minPoints: 100,
    maxPoints: 499,
    badge: '🌴',
    benefits: ['3 participations supplémentaires', 'Accès aux concours Cubano'],
    description: 'Être "Cubano" représente la fierté et l\'excellence de la culture cubaine. À ce niveau, vous êtes un membre respecté de notre communauté.'
  },
  {
    rank: 'MAXIMO',
    minPoints: 500,
    maxPoints: Infinity,
    badge: '⭐',
    benefits: ['Participations illimitées', 'Accès à tous les concours'],
    description: 'Inspiré par Máximo Gómez, héros de l\'indépendance cubaine, ce rang représente l\'excellence absolue et la maîtrise totale. Vous êtes une légende!'
  }
];