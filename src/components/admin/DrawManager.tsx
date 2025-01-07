import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Participant, ParticipantStatus } from "@/types/participant";
import { DrawManagerContent } from "./draw/DrawManagerContent";

interface DrawManagerProps {
  contestId: string;
  contest: {
    title: string;
    participants: Participant[];
  };
}

const DrawManager = ({ contestId, contest }: DrawManagerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [eligibleParticipants, setEligibleParticipants] = useState<Participant[]>([]);
  const [requiredScore, setRequiredScore] = useState(70);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEligibleParticipants = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching eligible participants for contest:", contestId);
        
        const { data: settings } = await supabase
          .from('settings')
          .select('required_percentage')
          .single();

        if (settings?.required_percentage) {
          setRequiredScore(settings.required_percentage);
        }

        // Calculate scores for participants based on their responses
        const { data: responses } = await supabase
          .from('responses')
          .select(`
            participant_id,
            question_id,
            answer_text,
            questions!inner (
              correct_answer
            )
          `)
          .eq('contest_id', contestId);

        if (!responses) return;

        // Group responses by participant
        const participantScores = responses.reduce((acc, response) => {
          const participantId = response.participant_id;
          if (!acc[participantId]) {
            acc[participantId] = {
              correct: 0,
              total: 0
            };
          }
          
          const isCorrect = response.answer_text === response.questions.correct_answer;
          acc[participantId].correct += isCorrect ? 1 : 0;
          acc[participantId].total += 1;
          
          return acc;
        }, {} as Record<string, { correct: number; total: number }>);

        // Fetch participants with calculated scores
        const { data: participantsData } = await supabase
          .from('participants')
          .select(`
            id,
            first_name,
            last_name,
            email,
            created_at,
            updated_at
          `)
          .in('id', Object.keys(participantScores));

        if (!participantsData) return;

        // Add scores to participants
        const participantsWithScores: Participant[] = participantsData.map(p => ({
          ...p,
          score: participantScores[p.id] 
            ? Math.round((participantScores[p.id].correct / participantScores[p.id].total) * 100)
            : 0,
          status: 'completed' as ParticipantStatus
        }));

        // Filter eligible participants
        const eligible = participantsWithScores.filter(p => (p.score || 0) >= requiredScore);
        setEligibleParticipants(eligible);

      } catch (error) {
        console.error('Error fetching eligible participants:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer la liste des participants éligibles.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (contestId) {
      fetchEligibleParticipants();
    }
  }, [contestId, requiredScore, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DrawManagerContent
        contestId={contestId}
        contest={contest}
        eligibleParticipants={eligibleParticipants}
        requiredScore={requiredScore}
      />
    </div>
  );
};

export default DrawManager;