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
  prizes?: {
    id: string;
    catalog_item: {
      name: string;
      value: string;
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