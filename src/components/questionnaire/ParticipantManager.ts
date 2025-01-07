import { supabase } from "../../App";
import { PARTICIPANT_STATUS, ParticipantStatus } from "@/types/participant";

export class ParticipantManager {
  static async ensureParticipantExists(userId: string, contestId: string, userEmail: string) {
    console.log('Checking if participant exists...', { userId, contestId, userEmail });
    
    // First, try to find an existing participant
    const { data: existingParticipant, error: findError } = await supabase
      .from('participants')
      .select('participation_id')
      .eq('id', userId)
      .eq('contest_id', contestId)
      .maybeSingle();

    if (findError) {
      console.error('Error finding participant:', findError);
      throw findError;
    }

    if (existingParticipant?.participation_id) {
      console.log('Found existing participant:', existingParticipant);
      return existingParticipant.participation_id;
    }

    // If no participant exists, create a new one
    console.log('Creating new participant...');
    const { data: newParticipant, error: createError } = await supabase
      .from('participants')
      .insert({
        id: userId,
        contest_id: contestId,
        status: PARTICIPANT_STATUS.PENDING as ParticipantStatus,
        first_name: userEmail.split('@')[0],
        last_name: 'Participant',
        email: userEmail,
        attempts: 0
      })
      .select('participation_id')
      .single();

    if (createError) {
      console.error('Error creating participant:', createError);
      throw createError;
    }

    if (!newParticipant?.participation_id) {
      console.error('No participation_id returned after creation');
      throw new Error('Failed to create participant: no participation_id returned');
    }

    console.log('Created new participant:', newParticipant);
    return newParticipant.participation_id;
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