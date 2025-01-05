export interface Contest {
  id: string;
  title: string;
  description?: string;
  is_new: boolean;
  has_big_prizes: boolean;
  status: string;
  participants?: {
    count: number;
    data?: Array<{
      id: string;
      first_name: string;
      last_name: string;
      score: number;
      status: string;
      updated_at: string;
    }>;
  };
}