import { supabase } from "../../App";

export const ensureParticipantExists = async (userId: string, contestId: string) => {
  // First check if participant already exists
  const { data: existingParticipant, error: fetchError } = await supabase
    .from('participants')
    .select('id')
    .eq('id', userId)
    .eq('contest_id', contestId)
    .maybeSingle(); // Use maybeSingle() instead of single() to handle no results case

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
      status: 'active',
      first_name: userEmail.split('@')[0], // Use email username as first_name
      last_name: 'Participant', // Default last name
      email: userEmail
    }])
    .select('id')
    .single();

  if (participantError) {
    console.error('Error creating participant:', participantError);
    throw participantError;
  }

  return newParticipant.id;
};