import { supabase } from "@/lib/supabase";
import { Participant } from "../../types/database";

export const ensureParticipantExists = async (userId: string, contestId: string): Promise<string> => {
  try {
    console.log('Checking participant existence for user:', userId, 'contest:', contestId);
    
    // Vérifier si le participant existe déjà
    const { data: existingParticipant, error: fetchError } = await supabase
      .from('participants')
      .select('participation_id, attempts, status')
      .eq('id', userId)
      .eq('contest_id', contestId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking participant:', fetchError);
      throw fetchError;
    }

    // Si le participant existe, vérifier son statut et ses tentatives
    if (existingParticipant?.participation_id) {
      console.log('Found existing participant:', existingParticipant);
      
      // Si le statut est 'completed', créer une nouvelle participation
      if (existingParticipant.status === 'completed') {
        const { data: userProfile } = await supabase
          .from('members')
          .select('first_name, last_name, email')
          .eq('id', userId)
          .single();

        if (!userProfile) {
          throw new Error('User profile not found');
        }

        const { data: newParticipant, error: insertError } = await supabase
          .from('participants')
          .insert({
            id: userId,
            contest_id: contestId,
            status: 'pending',
            attempts: (existingParticipant.attempts || 0) + 1,
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            email: userProfile.email,
            score: 0
          })
          .select('participation_id')
          .single();

        if (insertError) {
          console.error('Error creating new participant:', insertError);
          throw insertError;
        }

        return newParticipant.participation_id;
      }

      // Si le statut n'est pas 'completed', retourner l'ID existant
      return existingParticipant.participation_id;
    }

    // Si le participant n'existe pas, créer une nouvelle entrée
    const { data: userProfile } = await supabase
      .from('members')
      .select('first_name, last_name, email')
      .eq('id', userId)
      .single();

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    const { data: newParticipant, error: insertError } = await supabase
      .from('participants')
      .insert({
        id: userId,
        contest_id: contestId,
        status: 'pending',
        attempts: 1,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        email: userProfile.email,
        score: 0
      })
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
  
  return data;
};