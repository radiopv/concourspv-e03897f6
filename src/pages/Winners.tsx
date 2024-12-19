import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Gift } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import WinnerClaimDialog from "@/components/winners/WinnerClaimDialog";
import { useState } from "react";

const Winners = () => {
  const [selectedWinner, setSelectedWinner] = useState<any>(null);

  const { data: winners, isLoading } = useQuery({
    queryKey: ['winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          *,
          contest:contests(
            title,
            description
          ),
          prize:prizes(
            catalog_item:prize_catalog(*)
          )
        `)
        .eq('status', 'winner')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement des gagnants...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-bold">Tableau des Gagnants</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {winners?.map((winner) => (
          <Card key={winner.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{winner.first_name} {winner.last_name}</span>
                <Trophy className="w-5 h-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Concours</p>
                <p className="font-medium">{winner.contest?.title}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Prix gagné</p>
                <div className="flex items-center gap-2">
                  {winner.prize?.[0]?.catalog_item?.image_url && (
                    <img 
                      src={winner.prize[0].catalog_item.image_url} 
                      alt={winner.prize[0].catalog_item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <p className="font-medium">{winner.prize?.[0]?.catalog_item?.name}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Date du tirage</p>
                <p>{format(new Date(winner.updated_at), 'dd MMMM yyyy', { locale: fr })}</p>
              </div>

              {!winner.prize_claimed && (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setSelectedWinner(winner)}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Réclamer le prix
                </Button>
              )}

              {winner.prize_claimed && (
                <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Prix réclamé le {format(new Date(winner.prize_claimed_at), 'dd/MM/yyyy')}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <WinnerClaimDialog
        winner={selectedWinner}
        open={!!selectedWinner}
        onClose={() => setSelectedWinner(null)}
      />
    </div>
  );
};

export default Winners;