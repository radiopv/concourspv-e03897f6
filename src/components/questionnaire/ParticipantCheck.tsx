import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Participant } from "@/types/participant";

interface ParticipantCheckProps {
  participant: Participant | null;
  settings: { default_attempts: number } | undefined;
  contestId: string;
  questionsLength: number;
}

const ParticipantCheck = ({ participant, settings, contestId, questionsLength }: ParticipantCheckProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (participant?.attempts && settings?.default_attempts && 
        participant.attempts >= settings.default_attempts) {
      toast({
        title: "Limite de tentatives atteinte",
        description: "Vous avez atteint le nombre maximum de tentatives autorisées pour ce concours.",
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
          requiredPercentage: settings?.required_percentage || 70,
        }
      });
      return;
    }
  }, [participant, navigate, questionsLength, contestId, settings, toast]);

  return null;
};

export default ParticipantCheck;