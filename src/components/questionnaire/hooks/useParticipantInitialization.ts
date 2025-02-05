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

        // Check for any existing participation (completed or pending)
        const { data: existingParticipation, error: checkError } = await supabase
          .from('participants')
          .select('*')
          .eq('contest_id', contestId)
          .eq('id', session.user.id)
          .order('created_at', { ascending: false })
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing participation:', checkError);
          return;
        }

        // If there's an existing participation, handle it accordingly
        if (existingParticipation) {
          if (existingParticipation.status === 'completed') {
            navigate('/quiz-completion', {
              state: {
                contestId,
                score: existingParticipation.score,
                requiredPercentage: 80,
              }
            });
            return;
          } else if (existingParticipation.status === 'pending') {
            console.log('Found existing pending participation:', existingParticipation);
            await refetchParticipant();
            return;
          }
        }

        // Get settings and user points for attempt validation
        const { data: settings } = await supabase
          .from('settings')
          .select('default_attempts')
          .single();

        const { data: userPoints } = await supabase
          .from('user_points')
          .select('extra_participations')
          .eq('user_id', session.user.id)
          .single();

        const maxAttempts = (settings?.default_attempts || 3) + (userPoints?.extra_participations || 0);

        // Get the latest attempt number
        const { data: latestParticipation } = await supabase
          .from('participants')
          .select('attempts')
          .eq('contest_id', contestId)
          .eq('id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const nextAttemptNumber = (latestParticipation?.attempts || 0) + 1;

        if (nextAttemptNumber > maxAttempts) {
          toast({
            title: "Limite de tentatives atteinte",
            description: `Vous avez atteint le nombre maximum de tentatives (${maxAttempts}) pour ce concours.`,
            variant: "destructive",
          });
          navigate('/contests');
          return;
        }

        // Create new participation
        const { error: insertError } = await supabase
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
          .single();

        if (insertError) {
          console.error('Error creating participant:', insertError);
          
          // If the error indicates the user has already participated, redirect to completion
          if (insertError.message.includes('déjà participé')) {
            navigate('/quiz-completion', {
              state: {
                contestId,
                score: 0,
                requiredPercentage: 80,
              }
            });
            return;
          }

          toast({
            title: "Erreur",
            description: "Impossible d'initialiser la participation",
            variant: "destructive"
          });
          return;
        }

        await queryClient.invalidateQueries({ queryKey: ['participant-status', contestId] });
        toast({
          title: `Tentative ${nextAttemptNumber}/${maxAttempts}`,
          description: "Bonne chance !",
        });

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