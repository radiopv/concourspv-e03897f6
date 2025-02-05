import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useParticipantManagement = (contestId: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkExistingParticipation = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return null;

    const { data: existingParticipation, error } = await supabase
      .from('participants')
      .select('participation_id, status, score')
      .eq('contest_id', contestId)
      .eq('id', session.user.id)
      .eq('status', 'completed')
      .maybeSingle();

    if (error) {
      console.error('Error checking participation:', error);
      return null;
    }

    if (existingParticipation) {
      toast({
        title: "Participation existante",
        description: "Vous avez déjà participé à ce concours. Une seule participation est autorisée.",
      });
      navigate(`/quiz-completion/${contestId}`);
    }

    return existingParticipation;
  };

  const createOrUpdateParticipant = async () => {
    try {
      setIsSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const { data: userProfile, error: profileError } = await supabase
        .from('members')
        .select('first_name, last_name, email')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw new Error('Could not fetch user profile');
      }

      if (!userProfile?.first_name || !userProfile?.last_name || !userProfile?.email) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Votre profil est incomplet. Veuillez le compléter avant de participer."
        });
        navigate('/profile');
        return null;
      }

      const { data: existingParticipant } = await supabase
        .from('participants')
        .select('participation_id')
        .eq('contest_id', contestId)
        .eq('id', session.user.id)
        .maybeSingle();

      if (existingParticipant?.participation_id) {
        return existingParticipant.participation_id;
      }

      const { data: newParticipant, error: createError } = await supabase
        .from('participants')
        .insert({
          id: session.user.id,
          contest_id: contestId,
          status: 'pending',
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          email: userProfile.email
        })
        .select('participation_id')
        .single();

      if (createError) {
        console.error('Error creating participant:', createError);
        throw createError;
      }

      return newParticipant.participation_id;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    checkExistingParticipation,
    createOrUpdateParticipant
  };
};