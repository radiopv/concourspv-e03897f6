import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../App";
import { Button } from "@/components/ui/button";
import { Trophy, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DrawScheduler from "../draw/DrawScheduler";
import DrawHistory from "../draw/DrawHistory";
import { drawService } from "../draw/drawService";

interface ContestDrawProps {
  contestId: string;
  drawDate: string;
}

const ContestDraw = ({ contestId, drawDate }: ContestDrawProps) => {
  const { toast } = useToast();
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

  const handleDraw = async () => {
    setIsDrawing(true);
    try {
      const winner = await drawService.performDraw(contestId);
      
      toast({
        title: "Tirage effectué !",
        description: `Le gagnant est ${winner.first_name} ${winner.last_name}`,
      });

      // Publication automatique des résultats
      await drawService.publishResults(contestId);
      
      toast({
        title: "Résultats publiés",
        description: "Les résultats ont été publiés automatiquement",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsDrawing(false);
    }
  };

  const canDraw = drawDate && new Date(drawDate) <= new Date();

  return (
    <div className="space-y-6">
      <DrawScheduler 
        contestId={contestId}
        currentDrawDate={drawDate}
        onSchedule={(newDate) => console.log('Draw scheduled:', newDate)}
      />

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

            {!canDraw && drawDate && (
              <p className="text-sm text-amber-600">
                Le tirage sera possible à partir du {new Date(drawDate).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <DrawHistory contestId={contestId} />
    </div>
  );
};

export default ContestDraw;