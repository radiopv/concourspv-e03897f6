import React from 'react';
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { drawService } from '../services/drawService';
import { PARTICIPANT_STATUS } from '@/types/participant';

interface ContestDrawSectionProps {
  contestId: string;
  status: string;
  drawDate: Date | null;
  winners: any[];
}

const ContestDrawSection = ({ contestId, status, drawDate, winners }: ContestDrawSectionProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleEndContestAndDraw = async () => {
    try {
      const winner = await drawService.endContestAndDraw(contestId, queryClient);
      toast({
        title: "Concours terminé",
        description: `Le gagnant est ${winner.first_name} ${winner.last_name} avec un score de ${winner.score}%`,
      });
    } catch (error) {
      console.error('Error ending contest:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de terminer le concours",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {status === 'active' && (
        <Button 
          onClick={handleEndContestAndDraw}
          className="w-full bg-amber-500 hover:bg-amber-600"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Terminer et tirer au sort maintenant
        </Button>
      )}

      {drawDate && winners && winners.length > 0 && (
        <div className="pt-2 border-t">
          <p className="text-sm text-gray-600 mb-2">
            Date du tirage : {format(drawDate, 'dd MMMM yyyy', { locale: fr })}
          </p>
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <h4 className="font-semibold text-amber-900">Gagnants</h4>
            </div>
            {winners.map((winner) => (
              <div key={winner.id} className="mt-2 text-sm text-amber-800">
                {winner.first_name} {winner.last_name} ({winner.score}%)
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ContestDrawSection;