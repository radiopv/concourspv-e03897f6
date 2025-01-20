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