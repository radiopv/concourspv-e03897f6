import { supabase } from "@/lib/supabase";
import { Participant } from "../../types/database";

export const ensureParticipantExists = async (userId: string, contestId: string): Promise<string> => {
  try {
    console.log('Checking participant existence for user:', userId, 'contest:', contestId);
    
    // Vérifier si le participant existe déjà
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

    // Si le participant existe, incrémenter le nombre de tentatives et retourner son participation_id
    if (existingParticipant?.participation_id) {
      console.log('Found existing participant:', existingParticipant);
      
      // Incrémenter le nombre de tentatives
      const { error: updateError } = await supabase
        .from('participants')
        .update({ 
          attempts: (existingParticipant.attempts || 0) + 1,
          score: 0, // Réinitialiser le score pour la nouvelle tentative
          status: 'pending'
        })
        .eq('participation_id', existingParticipant.participation_id);

      if (updateError) {
        console.error('Error updating attempts:', updateError);
        throw updateError;
      }

      return existingParticipant.participation_id;
    }

    // Si le participant n'existe pas, créer une nouvelle entrée
    const { data: { session } } = await supabase.auth.getSession();
    const userEmail = session?.user?.email || 'anonymous@user.com';
    const participation_id = crypto.randomUUID();

    const { data: newParticipant, error: insertError } = await supabase
      .from('participants')
      .insert({
        participation_id,
        id: userId,
        contest_id: contestId,
        status: 'pending',
        first_name: userEmail.split('@')[0],
        last_name: 'Participant',
        email: userEmail,
        attempts: 1,
        score: 0
      })
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
  
  return data;
};