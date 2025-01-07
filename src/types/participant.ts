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
  status: ParticipantStatus;
  created_at: string;
  contest_id?: string; // Made optional since it's not always needed in the UI context
  participant_prizes?: ParticipantPrize[];
}

export interface ParticipantPrize {
  prize: {
    catalog_item: {
      id: string;
      name: string;
      value: string;
      image_url: string;
    }
  }
}