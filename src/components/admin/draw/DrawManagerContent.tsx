import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@/hooks/use-notifications";
import { Loader2 } from "lucide-react";
import { DrawHeader } from "./DrawHeader";
import { EligibleParticipantsList } from "./EligibleParticipantsList";
import { NoParticipantsAlert } from "./NoParticipantsAlert";
import { Participant } from "@/types/participant";

interface DrawManagerContentProps {
  contestId: string;
  contest: {
    title: string;
    participants: Participant[];
  };
  eligibleParticipants: Participant[];
  requiredScore: number;
}

export const DrawManagerContent = ({
  contestId,
  contest,
  eligibleParticipants,
  requiredScore
}: DrawManagerContentProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sendWinnerAnnouncement } = useNotifications();

  const handleWinnerSelection = async (participant: Participant) => {
    try {
      setIsDrawing(true);
      console.log("Selecting winner:", participant);
      
      const { error: updateError } = await supabase
        .from('new_participants')
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

  return (
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
  );
};