import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useParticipantInitialization = (
  contestId: string,
  userProfile: any | null,
  refetchParticipant: () => void
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const initializeParticipant = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          toast({
            title: "Non connecté",
            description: "Vous devez être connecté pour participer",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        if (!userProfile) {
          console.log('Waiting for user profile data...');
          return;
        }

        const { data: existingActive, error: checkError } = await supabase
          .from('participants')
          .select('*')
          .eq('contest_id', contestId)
          .eq('id', session.user.id)
          .eq('status', 'pending')
          .is('completed_at', null);

        if (checkError) {
          console.error('Error checking existing participation:', checkError);
          return;
        }

        if (existingActive && existingActive.length > 0) {
          console.log('Found existing active participation:', existingActive[0]);
          await refetchParticipant();
          return;
        }

        try {
          const { data: newParticipation, error: insertError } = await supabase
            .from('participants')
            .insert({
              id: session.user.id,
              contest_id: contestId,
              status: 'pending',
              first_name: userProfile.first_name,
              last_name: userProfile.last_name,
              email: userProfile.email,
              score: 0
            })
            .select()
            .single();

          if (insertError) {
            if (insertError.message.includes('already has an active participation')) {
              await refetchParticipant();
              return;
            }
            throw insertError;
          }

          console.log('Successfully created new participation:', newParticipation);
          await queryClient.invalidateQueries({ queryKey: ['participant-status', contestId] });

        } catch (insertError: any) {
          console.error('Error creating participant:', insertError);
          if (!insertError.message.includes('already has an active participation')) {
            toast({
              title: "Erreur",
              description: "Impossible d'initialiser la participation",
              variant: "destructive"
            });
          }
        }
      } catch (error: any) {
        console.error('Error in initializeParticipant:', error);
      }
    };

    if (contestId && userProfile) {
      initializeParticipant();
    }
  }, [contestId, queryClient, toast, navigate, userProfile, refetchParticipant]);
};