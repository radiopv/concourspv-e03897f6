import { supabase } from "../../App";
import { PARTICIPANT_STATUS, ParticipantStatus } from "@/types/participant";

export class ParticipantManager {
  static async ensureParticipantExists(userId: string, contestId: string, userEmail: string) {
    console.log('Checking if participant exists...', { userId, contestId, userEmail });
    
    try {
      const { data: participant, error } = await supabase
        .from('participants')
        .upsert(
          {
            id: userId,
            contest_id: contestId,
            status: PARTICIPANT_STATUS.PENDING as ParticipantStatus,
            first_name: userEmail.split('@')[0],
            last_name: 'Participant',
            email: userEmail,
            attempts: 0
          },
          {
            onConflict: 'id,contest_id',
            ignoreDuplicates: false
          }
        )
        .select('participation_id')
        .maybeSingle();

      if (error) {
        console.error('Error ensuring participant exists:', error);
        throw error;
      }

      if (!participant?.participation_id) {
        console.error('No participation_id returned');
        throw new Error('Failed to get participation_id');
      }

      console.log('Successfully got participation_id:', participant.participation_id);
      return participant.participation_id;

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