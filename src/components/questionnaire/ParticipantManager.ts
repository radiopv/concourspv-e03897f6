import { supabase } from "../../App";

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
      console.log('Found existing participant:', existingParticipant);
      return existingParticipant.participation_id;
    }

    // Get user's email from auth session
    const { data: { session } } = await supabase.auth.getSession();
    const userEmail = session?.user?.email || 'anonymous@user.com';

    // Generate a new UUID for participation_id
    const participation_id = crypto.randomUUID();

    // Create new participation entry
    const { data: newParticipant, error: insertError } = await supabase
      .from('participants')
      .insert([{
        participation_id,
        id: userId,
        contest_id: contestId,
        status: 'pending',
        first_name: userEmail.split('@')[0],
        last_name: 'Participant',
        email: userEmail,
        attempts: 0,
        score: 0
      }])
      .select('participation_id')
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