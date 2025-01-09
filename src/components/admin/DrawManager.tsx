import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface DrawManagerProps {
  contestId: string;
}

const DrawManager = ({ contestId }: DrawManagerProps) => {
  const { toast } = useToast();
  const [winner, setWinner] = useState<any>(null);

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
        .select('*')
        .eq('id', contestId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!contestId // Only run query if contestId exists
  });

  const performDraw = async () => {
    try {
      // Récupérer tous les participants éligibles (score >= 70%)
      const { data: eligibleParticipants, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .gte('score', 70);

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
      await supabase
        .from('participants')
        .update({ status: 'winner' })
        .eq('id', randomWinner.id);

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
          {canPerformDraw ? (
            <div className="space-y-4">
              <Button onClick={performDraw} disabled={!!winner}>
                Effectuer le tirage
              </Button>

              {winner && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold">Gagnant :</h3>
                  <p>{winner.first_name} {winner.last_name}</p>
                  <p className="text-sm text-gray-600">{winner.email}</p>
                </div>
              )}
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
