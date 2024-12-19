import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Award } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ContestDrawProps {
  contestId: string;
  drawDate: string;
}

const ContestDraw = ({ contestId, drawDate }: ContestDrawProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDrawing, setIsDrawing] = useState(false);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<any>(null);

  const { data: eligibleParticipants } = useQuery({
    queryKey: ['eligible-participants', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*, prizes(catalog_item_id, prize_catalog(*))')
        .eq('contest_id', contestId)
        .gte('score', 70)
        .is('status', null);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: availablePrizes } = useQuery({
    queryKey: ['available-prizes', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prizes')
        .select('*, prize_catalog(*)')
        .eq('contest_id', contestId)
        .is('participant_id', null);
      
      if (error) throw error;
      return data;
    }
  });

  const drawMutation = useMutation({
    mutationFn: async () => {
      if (!eligibleParticipants?.length) {
        throw new Error('Aucun participant éligible');
      }

      const winner = eligibleParticipants[Math.floor(Math.random() * eligibleParticipants.length)];
      
      const { error } = await supabase
        .from('participants')
        .update({ status: 'winner' })
        .eq('id', winner.id);

      if (error) throw error;
      return winner;
    },
    onSuccess: (winner) => {
      setSelectedWinner(winner);
      setShowWinnerDialog(true);
      queryClient.invalidateQueries({ queryKey: ['contest-winners', contestId] });
      queryClient.invalidateQueries({ queryKey: ['eligible-participants', contestId] });
      toast({
        title: "Tirage effectué !",
        description: `Le gagnant est ${winner.first_name} ${winner.last_name}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    }
  });

  const canDraw = new Date() >= new Date(drawDate);

  const handleDraw = async () => {
    if (!canDraw) {
      toast({
        title: "Impossible d'effectuer le tirage",
        description: "La date du tirage n'est pas encore arrivée",
        variant: "destructive",
      });
      return;
    }

    setIsDrawing(true);
    try {
      await drawMutation.mutateAsync();
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          Tirage au sort
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{eligibleParticipants?.length || 0} participants éligibles</span>
          </div>

          <Button 
            onClick={handleDraw}
            disabled={!canDraw || isDrawing || !eligibleParticipants?.length}
            className="w-full"
          >
            {isDrawing ? 'Tirage en cours...' : 'Effectuer le tirage'}
          </Button>

          {!canDraw && (
            <p className="text-sm text-amber-600">
              Le tirage sera possible à partir du {new Date(drawDate).toLocaleDateString('fr-FR')}
            </p>
          )}

          {availablePrizes && availablePrizes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Prix disponibles :</h3>
              <div className="space-y-2">
                {availablePrizes.map((prize) => (
                  <div key={prize.id} className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">{prize.prize_catalog.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={showWinnerDialog} onOpenChange={setShowWinnerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Félicitations au gagnant !</DialogTitle>
          </DialogHeader>
          {selectedWinner && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-900">
                    {selectedWinner.first_name} {selectedWinner.last_name}
                  </h4>
                </div>
                <p className="text-sm text-amber-700">
                  Score : {selectedWinner.score}%
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ContestDraw;