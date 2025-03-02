
export type ContestStatus = 'draft' | 'active' | 'archived';

export interface Prize {
  id: string;
  name: string;
  description: string;
  image_url: string;
  shop_url: string;
  value: number;
}

export interface ContestStatusUpdate {
  is_new?: boolean;
  has_big_prizes?: boolean;
  is_featured?: boolean;
  is_exclusive?: boolean;
  is_limited?: boolean;
  is_vip?: boolean;
  is_rank_restricted?: boolean;
  min_rank?: string;
  status?: ContestStatus;
  start_date?: string;
  end_date?: string;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  status: ContestStatus;
  start_date: string;
  end_date: string;
  draw_date: string;
  is_featured: boolean;
  is_new: boolean;
  has_big_prizes: boolean;
  is_exclusive: boolean;
  is_limited: boolean;
  is_vip: boolean;
  is_rank_restricted: boolean;
  min_rank?: string; // This is clearly marked as optional
  created_at: string;
  updated_at: string;
  participants?: { count: number };
  questions?: { count: number };
  prizes?: Prize[];
  shop_url?: string;
  prize_image_url?: string;
}
