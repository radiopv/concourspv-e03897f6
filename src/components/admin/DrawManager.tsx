import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { Trash2, Trophy } from "lucide-react";
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
  const [winner, setWinner] = useState<any>(null);
  const queryClient = useQueryClient();

  // Add early return if no contestId is provided
  if (!contestId) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Aucun concours sélectionné</p>
      </div>
    );
  }

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
            status
          )
        `)
        .eq('id', contestId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!contestId
  });

  const currentWinner = contest?.participants?.find(p => p.status === 'winner');

  const deleteWinner = async () => {
    try {
      if (!currentWinner) return;

      // Reset winner status to completed
      const { error: updateError } = await supabase
        .from('participants')
        .update({ status: 'completed' })
        .eq('id', currentWinner.id);

      if (updateError) throw updateError;

      // Delete from draw history
      const { error: deleteError } = await supabase
        .from('draw_history')
        .delete()
        .eq('participant_id', currentWinner.id);

      if (deleteError) throw deleteError;

      queryClient.invalidateQueries({ queryKey: ['contest-draw', contestId] });
      queryClient.invalidateQueries({ queryKey: ['contests'] });

      toast({
        title: "Succès",
        description: "Le gagnant a été supprimé",
      });
    } catch (error) {
      console.error('Error deleting winner:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le gagnant",
        variant: "destructive",
      });
    }
  };

  const performDraw = async () => {
    try {
      // Récupérer tous les participants éligibles (score >= 70%)
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

      // Sélectionner un gagnant au hasard
      const randomWinner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
      setWinner(randomWinner);

      // Mettre à jour le statut du gagnant
      const { error: updateError } = await supabase
        .from('participants')
        .update({ status: 'winner' })
        .eq('id', randomWinner.id);

      if (updateError) throw updateError;

      // Add to draw history
      const { error: historyError } = await supabase
        .from('draw_history')
        .insert([{
          contest_id: contestId,
          participant_id: randomWinner.id,
        }]);

      if (historyError) throw historyError;

      queryClient.invalidateQueries({ queryKey: ['contest-draw', contestId] });
      queryClient.invalidateQueries({ queryKey: ['contests'] });

      toast({
        title: "Tirage effectué !",
        description: `Le gagnant est ${randomWinner.first_name} ${randomWinner.last_name}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer le tirage",
        variant: "destructive",
      });
    }
  };

  const canPerformDraw = contest?.draw_date && new Date(contest.draw_date) <= new Date();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tirage au sort</CardTitle>
        </CardHeader>
        <CardContent>
          {currentWinner ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold">Gagnant actuel :</h3>
                <p>{currentWinner.first_name} {currentWinner.last_name}</p>
                <p className="text-sm text-gray-600">{currentWinner.email}</p>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer le gagnant
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action supprimera le gagnant actuel et permettra un nouveau tirage.
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteWinner}>
                      Continuer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : canPerformDraw ? (
            <div className="space-y-4">
              <Button onClick={performDraw} className="w-full">
                <Trophy className="w-4 h-4 mr-2" />
                Effectuer le tirage
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