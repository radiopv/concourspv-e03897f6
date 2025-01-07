export interface Contest {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  start_date: string;
  end_date: string;
  draw_date?: string;
  is_featured: boolean;
  is_new: boolean;
  has_big_prizes: boolean;
  created_at?: string;
  prize_image_url?: string;
  shop_url?: string;
  prizes?: {
    id: string;
    catalog_item: {
      name: string;
      value: number; // Changed from string to number
      image_url?: string;
      description?: string;
      shop_url?: string;
    };
  }[];
  questions?: {
    id: string;
    title: string;
    description?: string;
    questions?: {
      id: string;
      question_text: string;
      options?: string[];
      correct_answer?: string;
      article_url?: string;
      order_number?: number;
    }[];
  }[];
}

// Re-export Participant type from participant.ts
export { Participant } from './participant';