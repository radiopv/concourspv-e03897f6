export interface Contest {
  id: string;
  title: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  draw_date?: Date;
  prize_image_url?: string;
  shop_url?: string;
  is_featured?: boolean;
  is_new?: boolean;
  has_big_prizes?: boolean;
  share_image_url?: string;
  main_image_url?: string;
}

export interface Question {
  id: string;
  contest_id: string;
  question_text: string;
  correct_answer: string;
  options: string[];
  article_url?: string;
  image_url?: string;
  type: 'multiple_choice' | 'text';
  order_number?: number;
}

export interface QuestionFormProps {
  initialQuestion?: Question;
  contestId: string;
  onSubmit: (data: Omit<Question, "id">) => void;
  onCancel: () => void;
}

export interface QuestionCardProps {
  question: Question;
  contestId: string;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onSave: (updatedQuestion: Omit<Question, "id">) => Promise<void>;
  onCancel: () => void;
}
