import { supabase } from "../../App";

export const ensureParticipantExists = async (userId: string, contestId: string) => {
  // First check if participant already exists
  const { data: existingParticipant } = await supabase
    .from('participants')
    .select('id')
    .eq('id', userId)  // Changed from user_id to id since that's the primary key
    .eq('contest_id', contestId)
    .single();

  if (existingParticipant) {
    return existingParticipant.id;
  }

  // If not, create new participant with minimal information
  const { data: newParticipant, error: participantError } = await supabase
    .from('participants')
    .insert([{
      id: userId,  // Using the auth user id directly as participant id
      contest_id: contestId,
      status: 'active'
    }])
    .select('id')
    .single();

  if (participantError) throw participantError;
  return newParticipant.id;
};