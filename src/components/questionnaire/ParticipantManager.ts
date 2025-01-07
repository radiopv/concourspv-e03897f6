import { supabase } from "../../App";
import { PARTICIPANT_STATUS, ParticipantStatus } from "@/types/participant";

export const ensureParticipantExists = async (userId: string, contestId: string) => {
  try {
    console.log('Ensuring participant exists for user:', userId, 'contest:', contestId);
    
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
    const { data: existingParticipant, error: fetchError } = await supabase
      .from('participants')
      .select('participation_id')
      .eq('id', userId)
      .eq('contest_id', contestId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching participant:', fetchError);
      throw fetchError;
    }

    if (existingParticipant?.participation_id) {
      console.log('Found existing participant with ID:', existingParticipant.participation_id);
      return existingParticipant.participation_id;
    }

    // If not, create a new participant
    console.log('Creating new participant...');
    const { data: newParticipant, error: createError } = await supabase
      .from('participants')
      .insert([{
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

    if (createError) {
      console.error('Error creating participant:', createError);
      throw createError;
    }

    console.log('Created new participant with ID:', newParticipant.participation_id);
    return newParticipant.participation_id;
  } catch (error) {
    console.error('Error in ensureParticipantExists:', error);
    throw error;
  }
};