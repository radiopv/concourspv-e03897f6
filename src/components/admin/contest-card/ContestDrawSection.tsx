import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { drawService } from '../services/drawService';
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ContestDrawSectionProps {
  contestId: string;
  status: string;
  drawDate: Date | null;
  winners: any[];
}

const ContestDrawSection = ({ contestId, status, drawDate, winners }: ContestDrawSectionProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDraw = async () => {
    try {
      const winner = await drawService.performDraw(contestId, queryClient);
      toast({
        title: "Tirage effectué",
        description: `Le gagnant est ${winner.first_name} ${winner.last_name} avec un score de ${winner.score}%`,
      });
    } catch (error) {
      console.error('Error during draw:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'effectuer le tirage",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {status === 'active' && (
        <Button 
          onClick={handleDraw}
          className="w-full bg-amber-500 hover:bg-amber-600"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Terminer et tirer au sort maintenant
        </Button>
      )}

      {drawDate && winners && winners.length > 0 && (
        <div className="pt-2 border-t">
          <p className="text-sm text-gray-600 mb-2">
            Tirage effectué le {format(drawDate, 'dd MMMM yyyy', { locale: fr })}
          </p>
          <div className="bg-amber-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <h4 className="font-semibold text-amber-900">Gagnants</h4>
            </div>
            {winners.map((winner) => (
              <div key={winner.id} className="bg-white p-3 rounded-md shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-amber-900">
                      {winner.first_name} {winner.last_name}
                    </p>
                    <p className="text-sm text-amber-700">Score: {winner.score}%</p>
                  </div>
                  {winner.prize?.[0]?.catalog_item && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-purple-600">
                        Prix: {winner.prize[0].catalog_item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Valeur: {winner.prize[0].catalog_item.value}€
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestDrawSection;