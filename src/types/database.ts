export interface Participant {
  participation_id: string;
  id: string;
  contest_id: string;
  status: 'pending' | 'completed' | 'winner';
  first_name: string;
  last_name: string;
  email: string;
  attempts: number;
  score: number;
  completed_at?: string;
}

export interface ParticipantAnswer {
  id: string;
  participant_id: string;
  question_id: string;
  answer: string;
  is_correct: boolean;
  created_at: string;
}

export interface Question {
  id: string;
  contest_id: string;
  question_text: string;
  correct_answer: string;
  options: string[];
  article_url?: string;
  type: 'multiple_choice' | 'text';
}