export const PARTICIPANT_STATUS = {
  PENDING: 'pending',
  WINNER: 'winner',
  COMPLETED: 'completed'
} as const;

export type ParticipantStatus = typeof PARTICIPANT_STATUS[keyof typeof PARTICIPANT_STATUS];