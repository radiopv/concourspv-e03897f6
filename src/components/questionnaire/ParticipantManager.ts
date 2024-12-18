import { supabase } from "../../App";

export const ensureParticipantExists = async (userId: string, contestId: string) => {
  // First check if participant already exists
  const { data: existingParticipant, error: fetchError } = await supabase
    .from('participants')
    .select('id')
    .eq('id', userId)
    .eq('contest_id', contestId)
    .maybeSingle();

  if (existingParticipant) {
    return existingParticipant.id;
  }

  // Get user's email from auth session
  const { data: { session } } = await supabase.auth.getSession();
  const userEmail = session?.user?.email || 'anonymous@user.com';

  // If not, create new participant with required fields
  const { data: newParticipant, error: participantError } = await supabase
    .from('participants')
    .insert([{
      id: userId,
      contest_id: contestId,
      status: 'pending', // Changed from 'active' to 'pending' to match the check constraint
      first_name: userEmail.split('@')[0],
      last_name: 'Participant',
      email: userEmail,
      attempts: 0
    }])
    .select('id')
    .single();

  if (participantError) {
    console.error('Error creating participant:', participantError);
    throw participantError;
  }

  return newParticipant.id;
};