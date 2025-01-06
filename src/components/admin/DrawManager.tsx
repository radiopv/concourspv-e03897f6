import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../App";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@/hooks/use-notifications";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sendWinnerAnnouncement } = useNotifications();

  const handleWinnerSelection = async (participant: Participant) => {
    try {
      setIsDrawing(true);
      
      // Update participant status
      const { error: updateError } = await supabase
        .from('participants')
        .update({ status: 'winner' })
        .eq('id', participant.id);

      if (updateError) throw updateError;

      // Record in draw history
      const { error: historyError } = await supabase
        .from('draw_history')
        .insert([{
          contest_id: contestId,
          participant_id: participant.id,
        }]);

      if (historyError) throw historyError;

      // Send winner announcement email
      await sendWinnerAnnouncement(participant.email, contest.title);

      toast({
        title: "Succès",
        description: "Le gagnant a été sélectionné et notifié.",
      });

      // Refresh data
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
    const eligibleParticipants = contest.participants.filter(
      (p) => p.status === 'completed'
    );

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
      <CardHeader>
        <CardTitle>Tirage au sort</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleRandomDraw}
          disabled={isDrawing || contest.participants.length === 0}
          className="w-full"
        >
          {isDrawing ? "Tirage en cours..." : "Effectuer le tirage"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DrawManager;