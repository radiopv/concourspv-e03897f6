export enum PARTICIPANT_STATUS {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  WINNER = 'winner'
}

export type ParticipantStatus = PARTICIPANT_STATUS;

export interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  score: number;
  status?: ParticipantStatus;
  created_at: string;
  updated_at: string;
}

export interface ParticipationWithResponses extends Participant {
  responses: {
    question_id: string;
    answer_text: string;
  }[];
}