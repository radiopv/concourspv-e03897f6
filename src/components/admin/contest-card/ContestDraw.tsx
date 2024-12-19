import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { Button } from "@/components/ui/button";
import { Trophy, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContestDrawProps {
  contestId: string;
  drawDate: string;
}

const ContestDraw = ({ contestId, drawDate }: ContestDrawProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDrawing, setIsDrawing] = useState(false);

  const { data: eligibleParticipants } = useQuery({
    queryKey: ['eligible-participants', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contestId)
        .gte('score', 70)
        .is('status', null);
      
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ContestDraw;