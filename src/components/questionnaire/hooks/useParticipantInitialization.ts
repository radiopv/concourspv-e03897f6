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

        // First, check for any existing active participation
        const { data: existingParticipations, error: checkError } = await supabase
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

        if (existingParticipations && existingParticipations.length > 0) {
          console.log('Found existing active participation:', existingParticipations[0]);
          await refetchParticipant();
          return;
        }

        // Get the latest participation to determine the next attempt number
        const { data: latestParticipation, error: latestError } = await supabase
          .from('participants')
          .select('attempts')
          .eq('contest_id', contestId)
          .eq('id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestError) {
          console.error('Error checking latest participation:', latestError);
          return;
        }

        const nextAttemptNumber = (latestParticipation?.attempts || 0) + 1;

        // Create new participation
        const { data: newParticipation, error: insertError } = await supabase
          .from('participants')
          .insert({
            id: session.user.id,
            contest_id: contestId,
            status: 'pending',
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            email: userProfile.email,
            score: 0,
            attempts: nextAttemptNumber
          })
          .select()
          .maybeSingle();

        if (insertError) {
          if (insertError.message.includes('active participation')) {
            console.log('Race condition detected, refetching participant data');
            await refetchParticipant();
            return;
          }
          
          console.error('Error creating participant:', insertError);
          toast({
            title: "Erreur",
            description: "Impossible d'initialiser la participation",
            variant: "destructive"
          });
          return;
        }

        if (newParticipation) {
          console.log('Successfully created new participation:', newParticipation);
          await queryClient.invalidateQueries({ queryKey: ['participant-status', contestId] });
        }

      } catch (error: any) {
        console.error('Error in initializeParticipant:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'initialisation",
          variant: "destructive"
        });
      }
    };

    if (contestId && userProfile) {
      initializeParticipant();
    }
  }, [contestId, queryClient, toast, navigate, userProfile, refetchParticipant]);
};