import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../App";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@/hooks/use-notifications";
import { Trophy, Users, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [eligibleParticipants, setEligibleParticipants] = useState<Participant[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sendWinnerAnnouncement } = useNotifications();

  useEffect(() => {
    const fetchEligibleParticipants = async () => {
      try {
        console.log("Fetching eligible participants for contest:", contestId);
        const { data: settings } = await supabase
          .from('settings')
          .select('required_percentage')
          .single();

        const requiredScore = settings?.required_percentage || 70;

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
      }
    };

    fetchEligibleParticipants();
  }, [contestId, toast]);

  const handleWinnerSelection = async (participant: Participant) => {
    try {
      setIsDrawing(true);
      console.log("Selecting winner:", participant);
      
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
          draw_date: new Date().toISOString()
        }]);

      if (historyError) throw historyError;

      // Send winner announcement email
      await sendWinnerAnnouncement(participant.email, contest.title);

      toast({
        title: "Succès !",
        description: `${participant.first_name} ${participant.last_name} a été sélectionné(e) comme gagnant(e).`,
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Tirage au sort - {contest.title}
          </CardTitle>
          <CardDescription>
            Sélectionnez un gagnant parmi les participants éligibles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-blue-500" />
            <span>{eligibleParticipants.length} participants éligibles</span>
          </div>

          {eligibleParticipants.length === 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Aucun participant n'est actuellement éligible pour le tirage.
                Les participants doivent avoir complété le questionnaire avec un score suffisant.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleRandomDraw}
            disabled={isDrawing || eligibleParticipants.length === 0}
            className="w-full"
          >
            {isDrawing ? "Tirage en cours..." : "Effectuer le tirage"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DrawManager;