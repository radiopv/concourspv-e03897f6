import { supabase } from "../../App";
import { PARTICIPANT_STATUS, ParticipantStatus } from "@/types/participant";

export class ParticipantManager {
  static async ensureParticipantExists(userId: string, contestId: string, userEmail: string) {
    console.log('Checking if participant exists...', { userId, contestId, userEmail });
    
    try {
      // First check if participant exists
      const { data: existingParticipant, error: checkError } = await supabase
        .from('participants')
        .select('*')
        .eq('id', userId)
        .eq('contest_id', contestId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking for existing participant:', checkError);
        throw checkError;
      }

      if (existingParticipant) {
        console.log('Found existing participant:', existingParticipant);
        return existingParticipant.participation_id;
      }

      // If no participant exists, create a new one
      const { data: newParticipant, error: insertError } = await supabase
        .from('participants')
        .insert({
          id: userId,
          contest_id: contestId,
          status: PARTICIPANT_STATUS.PENDING as ParticipantStatus,
          first_name: userEmail.split('@')[0],
          last_name: 'Participant',
          email: userEmail,
          attempts: 0,
          participation_id: crypto.randomUUID() // Generate a unique ID here
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating participant:', insertError);
        throw insertError;
      }

      console.log('Created new participant:', newParticipant);
      return newParticipant.participation_id;

    } catch (error) {
      console.error('Error in ensureParticipantExists:', error);
      throw error;
    }
  }

  static async updateParticipantStatus(participationId: string, status: ParticipantStatus) {
    console.log('Updating participant status...', { participationId, status });
    
    const { error } = await supabase
      .from('participants')
      .update({ status })
      .eq('participation_id', participationId);

    if (error) {
      console.error('Error updating participant status:', error);
      throw error;
    }

    console.log('Successfully updated participant status');
  }
}