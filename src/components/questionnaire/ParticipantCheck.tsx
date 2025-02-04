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

  useEffect(() => {
    if (participant?.status === 'completed') {
      navigate('/quiz-completion', {
        state: {
          contestId,
          score: participant.score,
          totalQuestions: questionsLength,
          requiredPercentage: settings?.required_percentage || 80,
        }
      });
      return;
    }
  }, [participant, navigate, questionsLength, contestId, settings]);

  return null;
};

export default ParticipantCheck;