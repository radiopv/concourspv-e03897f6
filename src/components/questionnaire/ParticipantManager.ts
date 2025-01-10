import { supabase } from "@/lib/supabase";
import { Participant } from "../../types/database";

export const ensureParticipantExists = async (userId: string, contestId: string): Promise<string> => {
  try {
    console.log('Checking participant existence for user:', userId, 'contest:', contestId);
    
    // Check if participant exists, using maybeSingle() to handle no results gracefully
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

    // If participant exists, return their participation_id
    if (existingParticipant?.participation_id) {
      console.log('Found existing participant:', existingParticipant);
      return existingParticipant.participation_id;
    }

    // Get user email from session
    const { data: { session } } = await supabase.auth.getSession();
    const userEmail = session?.user?.email || 'anonymous@user.com';

    // Generate a new UUID for participation_id
    const participation_id = crypto.randomUUID();

    // Try to create new participant with upsert to handle potential race conditions
    const { data: newParticipant, error: insertError } = await supabase
      .from('participants')
      .upsert({
        participation_id,
        id: userId,
        contest_id: contestId,
        status: 'pending',
        first_name: userEmail.split('@')[0],
        last_name: 'Participant',
        email: userEmail,
        attempts: 0,
        score: 0
      }, {
        onConflict: 'id,contest_id',
        ignoreDuplicates: true
      })
      .select('participation_id')
      .maybeSingle();

    if (insertError) {
      console.error('Error creating participant:', insertError);
      throw insertError;
    }

    if (!newParticipant?.participation_id) {
      throw new Error('Failed to create participant: no participation_id returned');
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