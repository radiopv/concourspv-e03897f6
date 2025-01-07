export const PARTICIPANT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  WINNER: 'winner'
} as const;

export type ParticipantStatus = typeof PARTICIPANT_STATUS[keyof typeof PARTICIPANT_STATUS];

export interface ParticipantPrize {
  prize: {
    catalog_item: CatalogItem;
  };
}

export interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  score?: number;
  status: ParticipantStatus;
  created_at: string;
  participant_prizes?: ParticipantPrize[];
}

export interface ContestWithParticipantCount extends Omit<Contest, 'participants'> {
  participants?: {
    count: number;
    data?: Participant[];
  };
}