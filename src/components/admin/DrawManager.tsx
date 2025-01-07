import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@/hooks/use-notifications";
import { Loader2 } from "lucide-react";
import { DrawHeader } from "./draw/DrawHeader";
import { EligibleParticipantsList } from "./draw/EligibleParticipantsList";
import { NoParticipantsAlert } from "./draw/NoParticipantsAlert";

interface Participant {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  score: number;
  status: string;
}

interface DrawManagerProps {
  contestId: string;
  contest: {
    title: string;
    participants: Participant[];
  };
}

const DrawManager = ({ contestId, contest }: DrawManagerProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eligibleParticipants, setEligibleParticipants] = useState<Participant[]>([]);
  const [requiredScore, setRequiredScore] = useState(70);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sendWinnerAnnouncement } = useNotifications();

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
          .eq('status', 'completed')
          .gte('score', requiredScore);

        if (error) throw error;

        console.log("Eligible participants:", data);
        setEligibleParticipants(data || []);
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

  const handleWinnerSelection = async (participant: Participant) => {
    try {
      setIsDrawing(true);
      console.log("Selecting winner:", participant);
      
      const { error: updateError } = await supabase
        .from('participants')
        .update({ status: 'winner' })
        .eq('id', participant.id);

      if (updateError) throw updateError;

      const { error: historyError } = await supabase
        .from('draw_history')
        .insert([{
          contest_id: contestId,
          participant_id: participant.id,
          draw_date: new Date().toISOString()
        }]);

      if (historyError) throw historyError;

      await sendWinnerAnnouncement(participant.email, contest.title);

      toast({
        title: "Succès !",
        description: `${participant.first_name} ${participant.last_name} a été sélectionné(e) comme gagnant(e).`,
      });

      await queryClient.invalidateQueries({ queryKey: ['contests'] });
      await queryClient.invalidateQueries({ queryKey: ['contest-winners', contestId] });
    } catch (error) {
      console.error('Error selecting winner:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sélection du gagnant.",
      });
    } finally {
      setIsDrawing(false);
    }
  };

  const handleRandomDraw = async () => {
    if (eligibleParticipants.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Aucun participant éligible pour le tirage.",
      });
      return;
    }

    const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
    const selectedWinner = eligibleParticipants[randomIndex];
    await handleWinnerSelection(selectedWinner);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <DrawHeader 
          contestTitle={contest.title}
          eligibleCount={eligibleParticipants.length}
          requiredScore={requiredScore}
        />
        <CardContent className="space-y-4">
          {eligibleParticipants.length === 0 ? (
            <NoParticipantsAlert requiredScore={requiredScore} />
          ) : (
            <EligibleParticipantsList
              participants={eligibleParticipants}
              onSelectWinner={handleWinnerSelection}
              isDrawing={isDrawing}
            />
          )}

          <Button
            onClick={handleRandomDraw}
            disabled={isDrawing || eligibleParticipants.length === 0}
            className="w-full"
          >
            {isDrawing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tirage en cours...
              </>
            ) : (
              "Effectuer un tirage aléatoire"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DrawManager;