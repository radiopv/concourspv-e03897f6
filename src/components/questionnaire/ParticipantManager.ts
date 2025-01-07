import { supabase } from "../../App";
import { PARTICIPANT_STATUS, ParticipantStatus } from "@/types/participant";

export const ensureParticipantExists = async (userId: string, contestId: string) => {
  try {
    // Check if user already participates in this contest
    const { data: existingParticipant, error: fetchError } = await supabase
      .from('participants')
      .select('participation_id, attempts')
      .eq('id', userId)
      .eq('contest_id', contestId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking participant:', fetchError);
      throw fetchError;
    }

    if (existingParticipant) {
      console.log('Existing participant found:', existingParticipant);
      return existingParticipant.participation_id;
    }

    // Get user's email from auth session
    const { data: { session } } = await supabase.auth.getSession();
    const userEmail = session?.user?.email || 'anonymous@user.com';

    // Use upsert to handle potential race conditions
    const { data: newParticipant, error: upsertError } = await supabase
      .from('participants')
      .upsert([{
        id: userId,
        contest_id: contestId,
        status: PARTICIPANT_STATUS.PENDING,
        first_name: userEmail.split('@')[0],
        last_name: 'Participant',
        email: userEmail,
        attempts: 0,
        participation_id: crypto.randomUUID()
      }])
      .select('participation_id')
      .single();

    if (upsertError) {
      console.error('Error creating participant:', upsertError);
      throw upsertError;
    }

    if (!newParticipant) {
      throw new Error('Failed to create participant record');
    }

    console.log('New participant created:', newParticipant);
    return newParticipant.participation_id;

  } catch (error) {
    console.error('Error in ensureParticipantExists:', error);
    throw error;
  }
};

export const getParticipantStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('participants')
    .select(`
      contest_id,
      status,
      attempts,
      score,
      completed_at,
      contests (
        title
      )
    `)
    .eq('id', userId);

  if (error) throw error;
  return data;
};