import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../../../lib/supabase";

export const useAttempts = (contestId: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAttempts = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return;

        const { data: participant } = await supabase
          .from('participants')
          .select('attempts')
          .eq('contest_id', contestId)
          .eq('id', session.session.user.id)
          .maybeSingle();

        if (participant && participant.attempts >= 3) {
          toast({
            title: "Limite atteinte",
            description: "Vous avez déjà utilisé vos 3 tentatives pour ce questionnaire.",
            variant: "destructive",
          });
          navigate('/contests');
        }
      } catch (error) {
        console.error('Error in checkAttempts:', error);
      }
    };

    checkAttempts();
  }, [contestId, navigate, toast]);
};
