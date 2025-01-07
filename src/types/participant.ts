export const PARTICIPANT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  WINNER: 'winner'
} as const;

export type ParticipantStatus = typeof PARTICIPANT_STATUS[keyof typeof PARTICIPANT_STATUS];

export interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  score?: number;
  status?: ParticipantStatus;
}

export interface ParticipationWithResponses extends Participant {
  responses: {
    question_id: string;
    answer_text: string;
  }[];
}