export interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  article_url: string;
  order_number?: number;
  contest_id?: string;
  type: 'multiple_choice';
  status: 'available' | 'in_use' | 'archived';
  created_at?: string;
  updated_at?: string;
}
