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

        const { data, error } = await supabase
          .from('participants')
          .select('*')
          .eq('contest_id', contestId)
          .eq('status', 'completed' as ParticipantStatus)
          .gte('score', requiredScore);

        if (error) throw error;

        // Cast the status to ensure type safety
        const participantsWithCorrectStatus = (data || []).map(p => ({
          ...p,
          status: p.status as ParticipantStatus
        }));

        setEligibleParticipants(participantsWithCorrectStatus);
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