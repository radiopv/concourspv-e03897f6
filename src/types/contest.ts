export interface Contest {
  id: string;
  title: string;
  description?: string;
  is_new: boolean;
  has_big_prizes: boolean;
  status: string;
  participants: Array<{
    id: string;
    first_name: string;
    last_name: string;
    score: number;
    status: string;
    updated_at: string;
    prize_claimed?: boolean;
    prize_claimed_at?: string;
    prize?: Array<{
      catalog_item: {
        id: string;
        name: string;
        value: string;
        image_url: string;
      }
    }>;
  }>;
}