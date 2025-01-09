import { supabase } from "@/lib/supabase";
import { Participant } from "../../types/database";

export const ensureParticipantExists = async (userId: string, contestId: string): Promise<string> => {
  try {
    console.log('Checking participant existence for user:', userId, 'contest:', contestId);
    
    // Vérifie si l'utilisateur participe déjà à ce concours
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

    // Récupère l'email de l'utilisateur depuis la session auth
    const { data: { session } } = await supabase.auth.getSession();
    const userEmail = session?.user?.email || 'anonymous@user.com';

    // Génère un nouveau UUID pour participation_id
    const participation_id = crypto.randomUUID();

    // Crée une nouvelle participation
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