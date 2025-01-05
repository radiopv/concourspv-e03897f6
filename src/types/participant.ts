// Define valid participant statuses as an enum
export const PARTICIPANT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  WINNER: 'winner'
} as const;

export type ParticipantStatus = typeof PARTICIPANT_STATUS[keyof typeof PARTICIPANT_STATUS];

// Helper function to validate status values
export const isValidParticipantStatus = (status: string): status is ParticipantStatus => {
  return Object.values(PARTICIPANT_STATUS).includes(status as ParticipantStatus);
};