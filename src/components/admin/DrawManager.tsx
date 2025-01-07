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

        // First get participants with their participations
        const { data: participantsData, error: participantsError } = await supabase
          .from('participants')
          .select(`
            id,
            first_name,
            last_name,
            email,
            created_at,
            updated_at,
            participations!inner (
              status,
              score,
              contest_id
            )
          `)
          .eq('participations.contest_id', contestId)
          .eq('participations.status', 'completed' as ParticipantStatus)
          .gte('participations.score', requiredScore);

        if (participantsError) throw participantsError;

        // Transform the data to match the Participant type
        const participants: Participant[] = participantsData.map(p => ({
          id: p.id,
          first_name: p.first_name,
          last_name: p.last_name,
          email: p.email,
          created_at: p.created_at,
          updated_at: p.updated_at,
          score: p.participations[0].score,
          status: p.participations[0].status as ParticipantStatus
        }));

        setEligibleParticipants(participants);
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