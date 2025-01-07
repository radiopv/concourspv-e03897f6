import { supabase } from "../../App";
import { PARTICIPANT_STATUS, ParticipantStatus } from "@/types/participant";

export const ensureParticipantExists = async (userId: string, contestId: string) => {
  try {
    // First, check if the user exists
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("No session found");
    }

    const userEmail = session.user.email;
    if (!userEmail) {
      throw new Error("No user email found");
    }

    // Check if participant already exists
    const { data: existingParticipant } = await supabase
      .from('participants')
      .select('participation_id')
      .eq('id', userId)
      .eq('contest_id', contestId)
      .maybeSingle();

    if (existingParticipant) {
      return existingParticipant.participation_id;
    }

    // If not, create a new participant
    const { data: newParticipant, error } = await supabase
      .from('participants')
      .upsert([{
        id: userId,
        contest_id: contestId,
        status: PARTICIPANT_STATUS.PENDING as ParticipantStatus,
        first_name: userEmail.split('@')[0],
        last_name: 'Participant',
        email: userEmail,
        attempts: 0,
        participation_id: crypto.randomUUID()
      }])
      .select('participation_id')
      .single();

    if (error) {
      console.error('Error creating participant:', error);
      throw error;
    }

    return newParticipant.participation_id;
  } catch (error) {
    console.error('Error in ensureParticipantExists:', error);
    throw error;
  }
};