export interface Contest {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface Question {
  id: string;
  questionnaire_id: string;
  question_text: string;
  options?: string[];
  correct_answer?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Response {
  id: string;
  participant_id: string;
  question_id: string;
  contest_id: string;
  answer_text: string;
  created_at?: string;
}