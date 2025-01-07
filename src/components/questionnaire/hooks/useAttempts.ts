import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../../../App";

export const useAttempts = (contestId: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAttempts = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return;

        // First get the participant id
        const { data: participant } = await supabase
          .from('participants')
          .select('id')
          .eq('email', session.session.user.email)
          .single();

        if (participant) {
          // Then check participations
          const { data: participations } = await supabase
            .from('participations')
            .select('attempts')
            .eq('participant_id', participant.id)
            .eq('contest_id', contestId)
            .order('attempts', { ascending: false });

          const totalAttempts = participations?.length || 0;

          if (totalAttempts >= 3) {
            toast({
              title: "Limite atteinte",
              description: "Vous avez déjà utilisé vos 3 tentatives pour ce questionnaire.",
              variant: "destructive",
            });
            navigate('/contests');
          }
        }
      } catch (error) {
        console.error('Error in checkAttempts:', error);
      }
    };

    checkAttempts();
  }, [contestId, navigate, toast]);
};