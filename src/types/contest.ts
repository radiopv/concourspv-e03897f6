export type ContestStatus = 'draft' | 'active' | 'archived';

export interface ContestStatusUpdate {
  is_new?: boolean;
  has_big_prizes?: boolean;
  status?: ContestStatus;
}

export interface Contest {
  id: string;
  title: string;
  description?: string;
  status: ContestStatus;
  start_date: string;
  end_date: string;
  draw_date: string;
  is_featured: boolean;
  is_new: boolean;
  has_big_prizes: boolean;
  participants?: { count: number };
  questions?: { count: number };
  shop_url?: string;
  prize_image_url?: string;
}