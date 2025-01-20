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
  score: number;
  attempts: number;
  status: ParticipantStatus | null;
  contest_id: string;
  completed_at?: string;
  participation_id?: string;
}