import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Participant } from "@/types/participant";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Settings {
  default_attempts: number;
  required_percentage: number;
}

interface ParticipantCheckProps {
  participant: Participant | null;
  settings: Settings | undefined;
  contestId: string;
  questionsLength: number;
}

const ParticipantCheck = ({ participant, settings, contestId, questionsLength }: ParticipantCheckProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user points to check for extra participations
  const { data: userPoints } = useQuery({
    queryKey: ['user-points'],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user?.id) return null;

      const { data, error } = await supabase
        .from('user_points')
        .select('extra_participations')
        .eq('user_id', sessionData.session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user points:', error);
        return null;
      }

      return data;
    }
  });

  useEffect(() => {
    const maxAttempts = (settings?.default_attempts || 3) + (userPoints?.extra_participations || 0);

    if (participant?.attempts && participant.attempts > maxAttempts) {
      toast({
        title: "Limite de tentatives atteinte",
        description: `Vous avez atteint le nombre maximum de tentatives autorisées (${maxAttempts}) pour ce concours.`,
        variant: "destructive",
      });
      navigate('/contests');
      return;
    }

    if (participant?.status === 'completed') {
      navigate('/quiz-completion', {
        state: {
          contestId,
          score: participant.score,
          totalQuestions: questionsLength,
          requiredPercentage: settings?.required_percentage || 90, // Default to 90% if not set
        }
      });
      return;
    }
  }, [participant, navigate, questionsLength, contestId, settings, toast, userPoints]);

  return null;
};

export default ParticipantCheck;