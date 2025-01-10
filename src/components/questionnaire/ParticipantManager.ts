import { supabase } from "@/lib/supabase";
import { Participant } from "../../types/database";

export const ensureParticipantExists = async (userId: string, contestId: string): Promise<string> => {
  try {
    console.log('Checking participant existence for user:', userId, 'contest:', contestId);
    
    // First check if participant exists - using select() and checking array length
    const { data: existingParticipants, error: fetchError } = await supabase
      .from('participants')
      .select('participation_id, attempts')
      .eq('id', userId)
      .eq('contest_id', contestId);

    if (fetchError) {
      console.error('Error checking participant:', fetchError);
      throw fetchError;
    }

    // If participant exists, return their participation_id
    if (existingParticipants && existingParticipants.length > 0) {
      console.log('Found existing participant:', existingParticipants[0]);
      return existingParticipants[0].participation_id;
    }

    // Get user email from auth session
    const { data: { session } } = await supabase.auth.getSession();
    const userEmail = session?.user?.email || 'anonymous@user.com';

    // Generate a new UUID for participation_id
    let participation_id = crypto.randomUUID();
    let retryCount = 0;
    const maxRetries = 3;

    // Keep trying until we get a unique participation_id or max retries reached
    while (retryCount < maxRetries) {
      // Check if participation_id already exists - using select() instead of single()
      const { data: existingIds, error: idCheckError } = await supabase
        .from('participants')
        .select('participation_id')
        .eq('participation_id', participation_id);

      if (idCheckError) {
        console.error('Error checking participation_id:', idCheckError);
        throw idCheckError;
      }

      // If no existing ID found, we can use this one
      if (!existingIds || existingIds.length === 0) {
        break;
      }

      // Generate a new UUID and try again
      console.log('Duplicate participation_id found, generating new one');
      participation_id = crypto.randomUUID();
      retryCount++;
    }

    if (retryCount >= maxRetries) {
      throw new Error('Failed to generate unique participation_id after maximum retries');
    }

    // Create new participant with the unique participation_id
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
    return participation_id;
  } catch (error) {
    console.error('Error in ensureParticipantExists:', error);
    throw error;
  }
};

export const getParticipantStats = async (userId: string): Promise<Participant[]> => {
  const { data, error } = await supabase
    .from('participants')
    .select(`
      participation_id,
      id,
      contest_id,
      status,
      first_name,
      last_name,
      email,
      attempts,
      score,
      completed_at,
      contests (
        title
      )
    `)
    .eq('id', userId);

  if (error) throw error;
  
  // Transform the data to match the Participant interface
  const participants: Participant[] = data.map(item => ({
    participation_id: item.participation_id,
    id: item.id,
    contest_id: item.contest_id,
    status: item.status,
    first_name: item.first_name,
    last_name: item.last_name,
    email: item.email,
    attempts: item.attempts,
    score: item.score,
    completed_at: item.completed_at
  }));

  return participants;
};
