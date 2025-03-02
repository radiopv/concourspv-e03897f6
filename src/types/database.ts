
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
  image_url?: string;
}

export interface QuestionFormProps {
  initialQuestion?: Omit<Question, "id">;
  contestId: string;
  onSubmit: (data: Omit<Question, "id">) => void;
  onCancel: () => void;
}

export interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  contest_id: string;
  status?: string;
  score?: number;
  attempts?: number;
  participation_id?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}
