import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { Trophy, RefreshCcw } from "lucide-react";
import WinnerManager from "./winners/WinnerManager";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DrawManagerProps {
  contestId: string;
}

const DrawManager = ({ contestId }: DrawManagerProps) => {
  const { toast } = useToast();
  const [isDrawing, setIsDrawing] = useState(false);
  const queryClient = useQueryClient();

  const { data: contest } = useQuery({
    queryKey: ['contest-draw', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants(
            id,
            first_name,
            last_name,
            email,
            score,
            status,
            facebook_profile_url,
            profile_image_url
          )
        `)
        .eq('id', contestId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!contestId
  });

  const resetAndRedraw = async () => {
    try {
      setIsDrawing(true);
      
      // Reset current winner status
      const currentWinner = contest?.participants?.find(p => p.status === 'winner');
      if (currentWinner) {
        const { error: resetError } = await supabase
          .from('participants')
          .update({ status: 'completed' })
          .eq('id', currentWinner.id);

        if (resetError) throw resetError;

        // Delete from draw history
        const { error: historyError } = await supabase
          .from('draw_history')
          .delete()
          .eq('participant_id', currentWinner.id);

        if (historyError) throw historyError;
      }

      // Get eligible participants for new draw
      const { data: eligibleParticipants, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .gte('score', 70)
        .neq('status', 'winner');

      if (error) throw error;

      if (!eligibleParticipants?.length) {
        toast({
          title: "Impossible d'effectuer le tirage",
          description: "Aucun participant éligible trouvé",
          variant: "destructive",
        });
        return;
      }

      // Select new winner
      const newWinner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];

      // Update new winner status
      const { error: updateError } = await supabase
        .from('participants')
        .update({ status: 'winner' })
        .eq('id', newWinner.id);

      if (updateError) throw updateError;

      // Add to draw history
      const { error: historyError } = await supabase
        .from('draw_history')
        .insert([{
          contest_id: contestId,
          participant_id: newWinner.id,
        }]);

      if (historyError) throw historyError;

      await queryClient.invalidateQueries({ queryKey: ['contest-draw', contestId] });
      await queryClient.invalidateQueries({ queryKey: ['contests'] });

      toast({
        title: "Nouveau tirage effectué !",
        description: `Le nouveau gagnant est ${newWinner.first_name} ${newWinner.last_name}`,
      });
    } catch (error) {
      console.error('Error during redraw:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer le nouveau tirage",
        variant: "destructive",
      });
    } finally {
      setIsDrawing(false);
    }
  };

  const performDraw = async () => {
    try {
      setIsDrawing(true);
      const { data: eligibleParticipants, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .gte('score', 70)
        .neq('status', 'winner');

      if (error) throw error;

      if (!eligibleParticipants?.length) {
        toast({
          title: "Impossible d'effectuer le tirage",
          description: "Aucun participant éligible trouvé",
          variant: "destructive",
        });
        return;
      }

      const randomWinner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];

      const { error: updateError } = await supabase
        .from('participants')
        .update({ status: 'winner' })
        .eq('id', randomWinner.id);

      if (updateError) throw updateError;

      const { error: historyError } = await supabase
        .from('draw_history')
        .insert([{
          contest_id: contestId,
          participant_id: randomWinner.id,
        }]);

      if (historyError) throw historyError;

      await queryClient.invalidateQueries({ queryKey: ['contest-draw', contestId] });
      await queryClient.invalidateQueries({ queryKey: ['contests'] });

      toast({
        title: "Tirage effectué !",
        description: `Le gagnant est ${randomWinner.first_name} ${randomWinner.last_name}`,
      });
    } catch (error) {
      console.error('Error during draw:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer le tirage",
        variant: "destructive",
      });
    } finally {
      setIsDrawing(false);
    }
  };

  const currentWinner = contest?.participants?.find(p => p.status === 'winner');
  const canPerformDraw = contest?.draw_date && new Date(contest.draw_date) <= new Date();

  if (!contestId) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Aucun concours sélectionné</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tirage au sort</CardTitle>
        </CardHeader>
        <CardContent>
          {currentWinner ? (
            <div className="space-y-4">
              <WinnerManager
                contestId={contestId}
                winner={currentWinner}
                onWinnerDeleted={() => {
                  queryClient.invalidateQueries({ queryKey: ['contest-draw', contestId] });
                }}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Refaire le tirage
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Refaire le tirage ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action va supprimer le gagnant actuel et effectuer un nouveau tirage.
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={resetAndRedraw}>
                      Continuer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : canPerformDraw ? (
            <div className="space-y-4">
              <Button 
                onClick={performDraw} 
                disabled={isDrawing}
                className="w-full"
              >
                <Trophy className="w-4 h-4 mr-2" />
                {isDrawing ? 'Tirage en cours...' : 'Effectuer le tirage'}
              </Button>
            </div>
          ) : (
            <p className="text-gray-600">
              Le tirage au sort n'est pas encore disponible.
              {contest?.draw_date && (
                <span> Il sera possible le {new Date(contest.draw_date).toLocaleDateString()}</span>
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DrawManager;