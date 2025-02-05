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

        // Vérifier d'abord si une participation complétée existe
        const { data: existingCompletedParticipation, error: checkError } = await supabase
          .from('participants')
          .select('*')
          .eq('contest_id', contestId)
          .eq('id', session.user.id)
          .eq('status', 'completed')
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing participation:', checkError);
          return;
        }

        // Si une participation complétée existe, rediriger vers la page de résultats
        if (existingCompletedParticipation) {
          navigate('/quiz-completion', {
            state: {
              contestId,
              score: existingCompletedParticipation.score,
              requiredPercentage: 80,
            }
          });
          return;
        }

        // Vérifier les participations en cours
        const { data: existingPendingParticipation } = await supabase
          .from('participants')
          .select('*')
          .eq('contest_id', contestId)
          .eq('id', session.user.id)
          .eq('status', 'pending')
          .maybeSingle();

        if (existingPendingParticipation) {
          console.log('Found existing pending participation:', existingPendingParticipation);
          await refetchParticipant();
          return;
        }

        // Get settings for max attempts and user's extra participations
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

        // Get the latest participation to determine the next attempt number
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
          .single();

        if (insertError) {
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
          toast({
            title: `Tentative ${nextAttemptNumber}/${maxAttempts}`,
            description: "Bonne chance !",
          });
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