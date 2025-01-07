import { supabase } from "../../App";

export class ParticipantManager {
  static async ensureParticipantExists(userId: string, contestId: string, userEmail: string) {
    console.log('Ensuring participant exists...', { userId, contestId, userEmail });
    
    try {
      // Step 1: Get or create participant
      const { data: participant, error: participantError } = await supabase
        .from('participants')
        .upsert({
          email: userEmail,
          first_name: userEmail.split('@')[0], // Default first name
          last_name: 'Participant' // Default last name
        }, {
          onConflict: 'email',
          ignoreDuplicates: true
        })
        .select('id')
        .single();

      if (participantError) {
        console.error('Error ensuring participant:', participantError);
        throw participantError;
      }

      if (!participant?.id) {
        throw new Error('Failed to get or create participant');
      }

      // Step 2: Get current attempt number
      const { data: lastParticipation } = await supabase
        .from('participations')
        .select('attempts')
        .eq('participant_id', participant.id)
        .eq('contest_id', contestId)
        .order('attempts', { ascending: false })
        .limit(1)
        .single();

      const nextAttempt = (lastParticipation?.attempts || 0) + 1;

      // Step 3: Create new participation
      const { data: participation, error: participationError } = await supabase
        .from('participations')
        .insert({
          participant_id: participant.id,
          contest_id: contestId,
          attempts: nextAttempt,
          status: 'active'
        })
        .select('id')
        .single();

      if (participationError) {
        console.error('Error creating participation:', participationError);
        throw participationError;
      }

      console.log('Successfully created participation:', participation);
      return participation.id;

    } catch (error) {
      console.error('Error in ensureParticipantExists:', error);
      throw error;
    }
  }

  static async updateParticipationStatus(participationId: string, status: string) {
    console.log('Updating participation status...', { participationId, status });
    
    const { error } = await supabase
      .from('participations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', participationId);

    if (error) {
      console.error('Error updating participation status:', error);
      throw error;
    }

    console.log('Successfully updated participation status');
  }
}